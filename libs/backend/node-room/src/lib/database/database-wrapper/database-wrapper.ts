import { instance_manager_table_name, is_there_space_in_string, node_room_config_database, parse_sql_string } from '../../utils';
import { ExecuteDaoOnline } from '../../dao/online-daos/execute_dao_online';
import { InstanceClient } from './instance-client';
import { InstanceClientManager } from './instance-client-manager';
import { OfflineSync } from '../sync/sync';
import { dao_execute_type, IDatabaseWrapper, inited_instances, init_waiting_list, MYSQLConnectionConfig, rootDatabase } from '../../main-interface';
import { DatabaseConnection } from './database_connection';
import { v4 as uuid } from 'uuid';
import { Connection } from 'mysql';

export class DatabaseWrapper implements IDatabaseWrapper {
    private root_database_name: string;
    private all_instances: inited_instances[] = [];
    private init_waiting_list: init_waiting_list[] = [];
    private connectedInstances: Map<string, InstanceClientManager> = new Map(); // string is actually instance_uuid
    private rootDatabaseInstance: rootDatabase;

    constructor(private MYSQLConfig: MYSQLConnectionConfig, private RootDatabase: { initInstance(): void; getInstance(): any }) {
        /**
         * Init the root database that required no param
         */
        RootDatabase.initInstance();

        /** Get the root database instance and assign it to the  rootDatabaseInstance */
        this.rootDatabaseInstance = RootDatabase.getInstance() as rootDatabase;

        /** Get  the root database name */
        this.root_database_name = this.rootDatabaseInstance.db_name;
    }

    /** Run the instant dao on the connected instance_uuid */
    public runInstantDao(instance_uuid: string, extra_data: dao_execute_type[]) {
        const found_instance = this.connectedInstances.get(instance_uuid);
        if (found_instance) {
            for (const instant_dao of extra_data) {
                found_instance.executeInstantDao(instant_dao);
            }
        }
    }

    /** Notify the connected browser for the given instance */

    public notifyInstance(instance_uuid: string, table_range: string[]) {
        const found_instance = this.connectedInstances.get(instance_uuid);
        if (found_instance) {
            found_instance.modificationHappen(table_range);
        }
    }
    /*
    Each socket represent the unique client connected to the server
    After succesful connection , send the event on the route {root_database_name} for the database connection
    */
    public incomingConnection = (socket: SocketIO.Socket) => {
        socket.on(`${this.root_database_name}`, (data: any) => {
            console.log(`new incoming connection with id - ${socket.id}`);

            /*
            This is generated on the clinet side
            When the client first open the broswer 
            And get destroyed when the client close his browser
            */
            const socket_connection_uuid: string = data.socket_connection_uuid;
            /*
            This is globally uniue id for the database instance
            This get created on the server when the server init the database instance (in MYSQL) with name given as label
            This represent the created database on the mysql server using Bluprint Database class
            */
            const instance_uuid: string = data.instance_uuid;
            // Child database can be null which represent the root database
            const child_database_name: string = data.child_database_name;
            // child_database_param_object can be null in case of the root database or if child database do not need inputs
            const child_database_param_object: string = data.child_database_param_object;

            // Find the corresponding instance in the all_instances property of this class
            const found_instance = this.all_instances.find((val) => val.instance_uuid === instance_uuid);
            if (found_instance) {
                // given instance already exit in the MYSQL database
                // check if the connectedInstances property already holding the same instance
                let connected_instance = this.connectedInstances.get(found_instance.instance_uuid);
                if (connected_instance) {
                    // do nothing because instance manager is already connected to the server
                    /**
                     * This instance manager act like a room which holds all the connected browser with same instance_uuid
                     * All the childs of the root DB also connect to same manager
                     */
                } else {
                    /*
                    Create new instance manager that manage all the connection to given instance_uuid
                    */
                    connected_instance = new InstanceClientManager(this.MYSQLConfig, found_instance.instance_name);
                    this.connectedInstances.set(found_instance.instance_uuid, connected_instance);
                }

                /*
                InstanceClient represent the one client, or browser windows
                */
                const instance_client = new InstanceClient(socket, connected_instance.removeClient, connected_instance.modificationHappen);

                const dao_online = new ExecuteDaoOnline(
                    socket,
                    connected_instance.DB_connection,
                    found_instance.instance_name,
                    found_instance.instance_uuid,
                    this,
                    this.rootDatabaseInstance,
                    child_database_name,
                    child_database_param_object,
                    instance_client.onlineDaoModification,
                    connected_instance.executeInstantDao
                );

                const sync = new OfflineSync(
                    socket,
                    this.MYSQLConfig,
                    found_instance.instance_name,
                    this.rootDatabaseInstance,
                    child_database_name,
                    child_database_param_object,
                    instance_client.onlineDaoModification
                );

                instance_client.add_client_area(sync, dao_online);

                connected_instance.addClient(instance_client);

                socket.emit(`${this.root_database_name}_response`, {
                    err: false,
                    data: 'Ok',
                });
            } else {
                socket.emit(`${this.root_database_name}_response`, {
                    err: true,
                    data: 'Not Found',
                });
            }
        });
    };

    /**
     * Init the root database on the server side
     * @param label : Uniue string to init the Root Database (database name)
     */
    init = (label: string) => {
        // Chekc if there is space in the database name
        if (is_there_space_in_string(label)) {
            throw new Error("label can't contain the space");
        }

        return new Promise<'OK'>((resolve, reject) => {
            this.init_waiting_list.push({
                label: label,
                resolve: resolve,
                reject: reject,
            });
            if (this.init_waiting_list.length === 1) {
                this.start_init();
            }
        });
    };

    // will loop on the waiting list until there is no items in waiting list
    // will create tables and view in the database on the server
    private start_init = async () => {
        if (this.init_waiting_list.length === 0) {
            return;
        }

        const first_init = this.init_waiting_list[0];
        try {
            // init the node room config database and table
            await this.setup_config_table();
            // check if instance with given label already exit in the table
            const is_already_exit = await this.is_instance_already_exit(first_init.label);
            if (is_already_exit) {
                // just resolve the promise
                await this.retrive_all_prev_instances();
                first_init.resolve('OK');
            } else {
                // retrive all tables and views from the rootDatabase
                await this.create_table_and_views(first_init.label);
                await this.create_new_instance_to_config_db(first_init.label, first_init.label);
                first_init.resolve('OK');
                this.init_waiting_list = this.init_waiting_list.filter((p) => p.label !== first_init.label);
                await this.start_init();
            }
        } catch (error) {
            first_init.reject(error);
            throw new Error(error);
        }
    };

    private create_table_and_views = async (instance_name: string) => {
        // create database first
        // then create all tables and views
        await this.create_database(instance_name);
        const db_instance = this.rootDatabaseInstance;
        const table_creation_multi_command = db_instance.allEntityCreationQuery();
        // create the UD_LOG table
        const UD_LOG_TABLES = db_instance.getUDLogTablesCreationQuery();
        const creation_query = ` ${table_creation_multi_command} ${UD_LOG_TABLES}`;
        await this.do_multiple_query_given_database(instance_name, creation_query);
        return 'ok';
    };

    private do_multiple_query_given_database = (database_name: string, query: string) => {
        return new Promise<'OK'>((resolve, reject) => {
            const connection_to_db = this.create_mysql_connection(true, database_name);
            connection_to_db.query(query, (error: any, result: any) => {
                if (error) {
                    connection_to_db.destroy();
                    reject(error);
                } else {
                    connection_to_db.destroy();
                    resolve('OK');
                }
            });
        });
    };

    private create_database = (database_name: string) => {
        return new Promise<'OK'>((resolve, reject) => {
            const connection = this.create_mysql_connection();
            connection.query(`CREATE DATABASE IF NOT EXISTS ${database_name};`, (err: any, result: any) => {
                if (err) {
                    connection.destroy();
                    reject(err);
                } else {
                    connection.destroy();
                    resolve('OK');
                }
            });
        });
    };

    public get_instance = (label: string) => {
        const found_instance = this.all_instances.find((val) => val.label === label);
        if (found_instance) {
            return found_instance;
        } else {
            return null;
        }
    };

    private setup_config_table = async () => {
        await this.create_node_room_config_db();
        await this.create_instance_manager_table();
    };

    private create_new_instance_to_config_db = async (instance_name: string, label: string) => {
        const instance_uuid = uuid();
        await this.insert_new_instance_to_manager_table(instance_uuid, instance_name, label);
        // retrive all instance
        await this.retrive_all_prev_instances();
    };

    private insert_new_instance_to_manager_table = (instance_uuid: string, instance_name: string, label: string) => {
        return new Promise<void>((resolve, reject) => {
            const connection = this.create_mysql_connection(false, node_room_config_database);
            connection.query(insert_new_instance(this.root_database_name, instance_name, instance_uuid, label), (error: any, result: any) => {
                if (error) {
                    connection.destroy();
                    reject(error);
                } else {
                    connection.destroy();
                    resolve();
                }
            });
        });
    };

    private create_node_room_config_db = () => {
        return new Promise<void>((resolve, reject) => {
            const connection = this.create_mysql_connection();
            connection.query(`CREATE DATABASE IF NOT EXISTS ${node_room_config_database};`, (error: any, result: any) => {
                if (error) {
                    connection.destroy();
                    reject(error);
                } else {
                    connection.destroy();
                    resolve();
                }
            });
        });
    };

    private create_instance_manager_table = () => {
        return new Promise<void>((resolve, reject) => {
            const connection = this.create_mysql_connection(false, node_room_config_database);
            connection.query(instance_manager_table(this.root_database_name), (error: any, results: any, fields: any) => {
                if (error) {
                    connection.destroy();
                    reject(error);
                } else {
                    connection.destroy();
                    resolve();
                }
            });
        });
    };

    private is_instance_already_exit = async (label: string) => {
        return new Promise<boolean>((resolve, reject) => {
            // connect to config database
            const connection = this.create_mysql_connection(false, node_room_config_database);
            connection.query(select_prev_instance_with_given_label(label, this.root_database_name), (error: any, result: any) => {
                if (error) {
                    connection.destroy();
                    reject(error);
                } else {
                    const is_exit = (result as any[]).length === 0 ? false : true;
                    connection.destroy();
                    resolve(is_exit);
                }
            });
        });
    };

    /**
     * just use the connection once and disconnect after work
     * no connection polling
     */
    private retrive_all_prev_instances = () => {
        return new Promise<void>((resolve, reject) => {
            const connection = this.create_mysql_connection(false, node_room_config_database);
            connection.query(check_prev_instances(this.root_database_name), (error: any, results: any, fields: any) => {
                if (error) {
                    connection.destroy();
                    reject(error);
                } else {
                    connection.destroy();
                    this.all_instances = results as any[];
                    resolve();
                }
            });
        });
    };

    /**
     * create the mysql connection
     * on at a time
     */
    private create_mysql_connection = (multiple_query = false, database_name?: string) => {
        const connection: Connection = new DatabaseConnection().create_mysql_connection(this.MYSQLConfig, multiple_query, database_name);
        return connection;
    };
}

/**
 *
 * @param root_database_name : Root database name
 */
function instance_manager_table(root_database_name: string) {
    return `
    CREATE TABLE IF NOT EXISTS ${instance_manager_table_name(root_database_name)} (
        instance_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        instance_uuid text,
        instance_name text,
        label text,
        date_created DATETIME
    );
    `;
}

/**
 *
 * @param root_database_name : Root databae name
 * @param instance_name : instance name to create in the database
 * @param instance_uuid : unique string related to instance
 * @param label : unique string for instance used by client to identify the created instance
 */
function insert_new_instance(root_database_name: string, instance_name: string, instance_uuid: string, label: string) {
    return `
    INSERT INTO ${instance_manager_table_name(root_database_name)} (
        instance_uuid,
        instance_name,
        label,
        date_created
    )
    VALUES
    (
        ${parse_sql_string(instance_uuid)},
        ${parse_sql_string(instance_name)},
        ${parse_sql_string(label)},
        NOW()
    );
    `;
}

/**
 *
 * @param root_database_name : Name of the root databse
 */
function check_prev_instances(root_database_name: string) {
    return `SELECT * FROM ${instance_manager_table_name(root_database_name)};`;
}

/**
 *
 * @param label : instance unique label
 * @param root_database_name : root database name
 */
function select_prev_instance_with_given_label(label: string, root_database_name: string) {
    return `
    SELECT * FROM ${instance_manager_table_name(root_database_name)}
    WHERE label = ${parse_sql_string(label)};
    `;
}
