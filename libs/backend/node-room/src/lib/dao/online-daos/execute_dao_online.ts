import { Subscription } from 'rxjs';
import { DatabaseWrapper } from '../../database/database-wrapper/database-wrapper';
import { daoClassType, daoType, dao_execute_type, MYSQLConnectionConfig, rootDatabase } from '../../main-interface';
import { is_two_array_intersect } from '../../utils';
import { QueryServerDatabase } from './query_database';

/*
    We are assuming that child database name is unique in the root Database
    Database name should be unique in the whole application
*/

export class ExecuteDaoOnline {
    private root_database_name: string;
    private dao_map: Map<string, ManageLiveData> = new Map();
    private getDaoMethod!: (dao_name: string) => daoClassType | undefined; // Get the dao class using the dao name

    /**
     *
     * @param socket : Client socket connection
     * @param mysqlConfig : MYSQL server connection configiration
     * @param database_name : root database name , instance
     * @param rootDatabaseInstance : root database class instance
     * @param childDatabaseName : child database name if connected client is child database or null if not
     * @param childDatabaseParamObject : child database param object ( key: val ) pair, if client is child database because root database do not accept parameter
     * @param modification_happen : A callback which will get fired once there is any change in the database (DELETE, UPDATE , INSERT)
     * @param execute_instant_dao: A callback which will get fired once there is need to excute the dao on the client instantly
     */
    constructor(
        private socket: any,
        private connectionMYSQL: QueryServerDatabase,
        private database_name: string,
        private instance_uuid: string,
        private database_wrapper: DatabaseWrapper,
        private rootDatabaseInstance: rootDatabase,
        private childDatabaseName: string | null,
        private childDatabaseParamObject: any | null,
        private modification_happen: (table_range: string[]) => void,
        private execute_instant_dao: (dao: dao_execute_type) => void
    ) {
        this.childDatabaseParamObject = this.childDatabaseParamObject ? this.childDatabaseParamObject : {}; // Stable the object
        this.root_database_name = this.rootDatabaseInstance.db_name; // Extract the database instance name
        this.assignGetDaoMethod(); // Assign the dao method extracter

        /**
         * Assign the callback for the online dao  execution
         */
        this.socket.on('dao_online', (data: any) => {
            console.log('dao online called', data);

            if (
                !(
                    data.hasOwnProperty('dao_call_uuid') &&
                    data.hasOwnProperty('mode') &&
                    data.hasOwnProperty('dao_name') &&
                    data.hasOwnProperty('dao_init_uuid') &&
                    data.hasOwnProperty('dao_param_object')
                )
            ) {
                console.log('incoming dao has missing param ', data);
                return;
            }

            /**
             * Extract the object property into the separate var
             */
            const dao_call_uuid = data.dao_call_uuid; // on each  and every dao call we get unique uuid, which represent dao call
            const dao_name: string = data.dao_name; // name of the dao for the execution
            const dao_init_uuid: string = data.dao_init_uuid; // dao inited uuid
            const dao_param_object: any = data.dao_param_object; // dao param object which is key val pair of param and value of the dao's fetch function
            const mode: 'async' | 'obs' = data.mode;

            /*
            Search the map which is dao_map to check if the dao already exit
            */
            const found_dao_in_map = this.dao_map.get(dao_init_uuid);

            if (found_dao_in_map) {
                // found in the map , this dao already exit in the map, just update the param object and dao_call_uuid and fetch the data
                found_dao_in_map.update_param_object(dao_param_object, dao_call_uuid);
            } else {
                /*
                Search the child database of the connected client for the given dao with dao name
                */
                const found_dao = this.getDaoMethod(dao_name);

                /*
                We are in the nodejs environment , So just pass the config object with proper input
                */
                if (found_dao) {
                    // Configure the DB_config Object
                    const dao_object = new found_dao({
                        runType: 'normal',
                        serverQuery: this.connectionMYSQL,
                        asyncServerQuery: this.connectionMYSQL,
                        instanceUUID: this.instance_uuid,
                        databaseWrapper: this.database_wrapper,
                        canRunInstantDao: true,
                    });

                    const live_data_manager = new ManageLiveData(
                        mode,
                        dao_call_uuid,
                        dao_name,
                        dao_init_uuid,
                        dao_param_object,
                        dao_object,
                        this.socket,
                        this.delete_modification_dao,
                        this.modification_done,
                        this.execute_instant_dao
                    );
                    this.dao_map.set(dao_init_uuid, live_data_manager);
                } else {
                    // send the not found command downstream
                    const data_to_send = { is_err: true, err: 'Dao not found on the server', dao_name, dao_init_uuid, dao_call_uuid, result: null };
                    this.socket.emit('dao_online_result', data_to_send);
                }
            }
        });
    }

    public kill_all_live_data = () => {
        this.dao_map.forEach((p) => p.kill_live_data());
    };

    /**
     * Dispose the connected connection to the database MYSQL
     * Note that if given instance uuid hold single mysql connection , hence do not disconnect the connection
     */
    public disconnect_mysql_connection = () => {
        // this.connectionMYSQL.dispose_connection();
    };

    private assignGetDaoMethod = () => {
        if (this.childDatabaseName) {
            // There is child database name
            const found_child_database = this.rootDatabaseInstance.getChildDatabase(this.childDatabaseName);
            if (found_child_database) {
                // child database found
                const childDatabaseObject = new found_child_database(...Object.values(this.childDatabaseParamObject));
                this.getDaoMethod = childDatabaseObject.getDao;
            } else {
                throw new Error(`Missing child database named - ${this.childDatabaseName}`);
            }
        } else {
            // root Database , there is no child database
            this.getDaoMethod = this.rootDatabaseInstance.getDao;
        }
    };

    /**
     * Delete the instance of the dao call manager
     * @param dao_init_uuid : dao instance uuid
     */
    public delete_modification_dao = (dao_init_uuid: string) => {
        this.dao_map.delete(dao_init_uuid);
    };

    public modification_done = (included_table_names: string[]) => {
        this.modification_happen(included_table_names);
    };

    /**
     * Refetch all the daos
     * @param included_table_names : Affected table names
     */
    public refetch = (included_table_names: string[]) => {
        this.dao_map.forEach((dao) => {
            dao.refetch(included_table_names);
        });
    };
}

/**
 * When dao is inited it return the extended class of live data
 * This class will manage all such live data
 */
class ManageLiveData {
    private included_table_names: string[] = [];
    private query_type!: string;
    private live_data_subscription_$$: Subscription;

    /**
     *
     * @param dao_name : Name of the dao
     * @param dao_init_uuid : UUID of the dao init
     * @param dao_param_object : Dao param object
     * @param live_data : live data of the dao
     * @param socket : Client socket connection
     * @param delete_me : A callback function that delete this object
     * @param modification_done : A callback function to notify the change in the database
     * @param execute_instant_dao  : A call back function to notify to run the dao instantly on the client
     */
    constructor(
        private mode: 'async' | 'obs',
        private dao_call_uuid: string,
        private dao_name: string,
        private dao_init_uuid: string,
        private dao_param_object: any,
        private live_data: daoType<any>,
        private socket: any,
        private delete_me: (dao_init_uuid: string) => void,
        private modification_done: (included_table_names: string[]) => void,
        private execute_instant_dao: (dao: dao_execute_type) => void
    ) {
        this.live_data.captureQueryType = (query_type) => (this.query_type = query_type);
        this.live_data.captureTablesInvolved = (tables_involved) => (this.included_table_names = tables_involved);

        this.live_data_subscription_$$ = this.live_data.observe(this).subscribe(this.send_message_down, (err) => {
            /**
             * Error occured while running DB Query
             */
            const data_to_send = {
                is_err: true,
                err: JSON.stringify(err),
                dao_name: this.dao_name,
                dao_init_uuid: this.dao_init_uuid,
                dao_call_uuid: this.dao_call_uuid,
                result: null,
                mode: this.mode,
            };

            this.socket.emit('dao_online_result', data_to_send);
        });

        /**
         * Fetch the data from the DB
         * Initial fetch at the time of  object construction
         */
        this.fetch();
    }

    private send_message_down = (data: any) => {
        if (data !== null) {
            if (data.hasOwnProperty('extra_data') && data.hasOwnProperty('data')) {
                console.info('sending message down', this.dao_init_uuid);

                const result = data.data;
                const extra_data = data.extra_data as dao_execute_type[];
                const data_to_send = {
                    is_err: false,
                    err: null,
                    dao_name: this.dao_name,
                    dao_init_uuid: this.dao_init_uuid,
                    dao_call_uuid: this.dao_call_uuid,
                    result: result,
                    mode: this.mode,
                };

                this.socket.emit('dao_online_result', data_to_send);

                if (this.mode === 'obs') {
                    if (this.query_type !== 'SELECT') {
                        /**
                         * Since there is  modification we must notify the other dao to refetch the result
                         * For the update pupose
                         */
                        if (this.modification_done) {
                            console.log('modification happens', this.included_table_names, this.query_type);
                            this.modification_done(this.included_table_names);
                        }

                        if (this.query_type !== 'MIXED') {
                            if (extra_data) {
                                for (const extra_d of extra_data) {
                                    if (this.execute_instant_dao) {
                                        this.execute_instant_dao(extra_d);
                                    }
                                }
                            }
                        }

                        // TODO: we are not deleting the incoming dao , please free the memory once client get disconnected or page dead
                        // this.live_data.kill(this.live_data.uuid);
                        // this.delete_me(this.dao_init_uuid);
                    }
                } else {
                    /** Remove the instance */
                    this.live_data.kill();
                    this.delete_me(this.dao_init_uuid);
                }
            }
        }
    };

    public kill_live_data = () => {
        this.live_data.kill();
        if (this.live_data_subscription_$$) {
            this.live_data_subscription_$$.unsubscribe();
        }
        this.delete_me(this.dao_init_uuid);
    };

    // this method will be called only if the dao type is select
    public update_param_object = (param_object: any, dao_call_uuid: string) => {
        if (param_object && this.query_type === 'SELECT') {
            this.dao_call_uuid = dao_call_uuid;
            this.dao_param_object = param_object;
            this.fetch();
        }
    };

    public fetch = () => {
        (this.live_data.fetch(...Object.values(this.dao_param_object)) as any).obsData();
    };

    public refetch = (table_range: string[]) => {
        if (!table_range) {
            return;
        }

        if (is_two_array_intersect(table_range, this.included_table_names) && this.query_type === 'SELECT') {
            this.fetch();
        }
    };
}
