import { LiveData } from '@sculify/live-data';
import { dao_status } from './main_interface';
import { is_left_array_subset_of_right_arr, is_two_array_intersect } from './utils';
import { ISQLConnection, ISQLQuery } from '@sculify/indexed-sql';
import { convert_object_to_sql_object } from '@foodbzr/shared/util';
import { v4 as uuid } from 'uuid';
import { query_type } from '@sculify/node-room';

export class DaoManager {
    private static instance: DaoManager;
    private dao_calls_map: Map<string, ManageDaoCall> = new Map();
    private async_dao_call_map: Map<string, { resolve: any; reject: any }> = new Map();
    private local_sql_connection: ISQLQuery;

    /**
     *
     * @param database_name : Client database name
     * @param offline_tables : Names of all offline tables
     * @param default_dao_running_status : Default dao running status - 'offline' , 'online'
     * @param socket : Socket connection to server
     */
    private constructor(private database_name: string, private offline_tables: string[], private default_dao_running_status: dao_status, private socket: SocketIOClient.Socket) {
        /** Create the local SQL connection */
        new ISQLConnection({
            multi_query: false,
            database_name: this.database_name,
        })
            .open()
            .then((conn) => {
                this.local_sql_connection = conn;
            });
    }

    public static initInstance = (database_name: string, offline_tables: string[], default_dao_running_status: dao_status, socket: SocketIOClient.Socket) => {
        if (!DaoManager.instance) {
            DaoManager.instance = new DaoManager(database_name, offline_tables, default_dao_running_status, socket);
        }
    };

    public static getInstance = () => {
        if (DaoManager.instance) {
            return DaoManager.instance;
        } else {
            throw new Error('First Create the instance of the class --> DaoManager');
        }
    };

    /**
     *
     * @param dao_init_uuid : live data uuid
     * @param force_online : weather to run this dao on the server or on the client
     * @param query SQL query to run on the MYSQL DB
     * @param dao_param_object : dao fetch function param object
     * @param dao_name : name of the running dao
     * @param query_type : type of the SQL query
     * @param tables_involved : list of all the tables involved in the SQL Query
     */
    public async runAsyncDao(dao_init_uuid: string, force_online: boolean, query: string, dao_param_object: any, dao_name: string, query_type: query_type, tables_involved: string[]) {
        /** Detect the running env */
        const detectAsyncDaoRunningEnv = () => {
            let env: dao_status;

            if (force_online) {
                env = 'online';
            } else if (this.default_dao_running_status === 'online') {
                env = 'online';
            } else if (!is_left_array_subset_of_right_arr(tables_involved, this.offline_tables)) {
                env = 'online';
            } else {
                env = 'offline';
            }

            return env;
        };

        const dao_running_env = detectAsyncDaoRunningEnv();
        if (dao_running_env === 'online' || query_type === 'DELETE' || query_type === 'UPDATE' || query_type === 'MIXED' || query_type === 'TRANSACTION') {
            /** Run the dao online */
            return new Promise<any>((resolve, reject) => {
                this.async_dao_call_map.set(dao_init_uuid, { resolve, reject });
                this.socket.emit('dao_online', {
                    dao_name: dao_name,
                    dao_init_uuid: dao_init_uuid,
                    dao_param_object: convert_object_to_sql_object(dao_param_object),
                    dao_call_uuid: dao_init_uuid,
                    mode: 'async',
                });
            });
        } else {
            /** Run the dao offline */
            const LDB_data = await this.local_sql_connection.query(query);
            if (query_type === 'INSERT') {
                this.modification_happens(tables_involved);
            }
            return { data: LDB_data, from: 'local' };
        }
    }

    /**
     * Run this method in the Dao Object to run the dao
     * @param dao_init_uuid : When the dao class is inited , it generate the unique UUID , this is that unique UUID
     * @param force_online : A boolean value indicating weather to run the given dao online on the server or on the local machine
     * @param live_data : The live data object of the Dao
     * @param query : A SQL query string to run on the MYSQL database
     * @param dao_param_object : Dao input object , Which is just a key val pair object
     * @param dao_name : Name of the dao
     * @param query_type : Query type of the Dao
     * @param tables_involved : List of the names of the table involved in the SQL query
     */
    public runDao = (
        dao_init_uuid: string,
        force_online: boolean,
        live_data: LiveData<any>,
        query: string,
        dao_param_object: any,
        dao_name: string,
        original_function_ref: any,
        original_function: any,
        original_function_args: any[]
    ) => {
        /*
        Check if the map already holding the dao execution object
        */
        const found_prev_call = this.dao_calls_map.get(dao_init_uuid);
        if (found_prev_call) {
            console.log('found prev dao', dao_init_uuid, '-->', dao_name);
            found_prev_call.update_dao(query, dao_param_object, original_function_ref, original_function, original_function_args);
        } else {
            console.log('creating new dao call manager ---> ', dao_init_uuid);

            const new_call_object = new ManageDaoCall(
                original_function_ref,
                original_function,
                original_function_args,
                this.local_sql_connection,
                dao_init_uuid,
                dao_name,
                force_online,
                this.offline_tables,
                this.default_dao_running_status,
                query,
                this.socket,
                live_data,
                dao_param_object,
                this.modification_happens,
                this.remove_me
            );

            this.dao_calls_map.set(dao_init_uuid, new_call_object);
        }
    };

    public mark_for_delete(dao_init_uuid: string) {
        const dao_call_manager = this.dao_calls_map.get(dao_init_uuid);
        if (dao_call_manager) {
            dao_call_manager.mark_for_delete = true;
            dao_call_manager.delete_if_done();
        }
    }

    /** For the obs type data received from the server */
    public online_dao_result_received(data: any) {
        if (data && data.hasOwnProperty('dao_init_uuid')) {
            const found_dao_call_manager = this.dao_calls_map.get(data.dao_init_uuid) as ManageDaoCall;
            if (found_dao_call_manager) {
                found_dao_call_manager.dao_online_result_received(data);
            } else {
                console.warn('dao call manager not found ---->', data.dao_init_uuid);
            }
        }
    }

    /** Async version data just received from the server */
    public online_async_dao_result_received(data: any) {
        if (data && data.hasOwnProperty('dao_init_uuid')) {
            const found_dao_call_manager = this.async_dao_call_map.get(data.dao_init_uuid);
            if (data.is_err) {
                found_dao_call_manager.reject(data.er);
            } else {
                found_dao_call_manager.resolve({ data: data.result, from: 'server' });
            }

            this.async_dao_call_map.delete(data.dao_init_uuid);
        }
    }

    /** There is modification happens in the inner working local tables just refetch the data */
    public modification_happens = (table_range: string[]) => {
        this.dao_calls_map.forEach((map) => map.refetch(table_range));
    };

    /** Remove the instances */
    public remove_me = (dao_init_uuid: string) => {
        this.dao_calls_map.delete(dao_init_uuid);
    };

    /** Update the default dao running env for all daos */
    public update_daos_default_running_env = (env: dao_status) => {
        this.default_dao_running_status = env;
        this.dao_calls_map.forEach((map) => map.update_dao_default_running_env(env));
    };
}

class ManageDaoCall {
    private dao_call_records: string[] = [];
    private dao_running_env: dao_status;
    public mark_for_delete: boolean = false;
    private query_type: query_type;
    private tables_involved: string[];

    /**
     *
     *
     * @param local_sql_connection : SQL connection to local database
     * @param dao_init_uuid : Once the dao is inited by the client then it generate the uniue UUID , this is that UUID of the dao
     * @param dao_name : Dao name which is unique in the given database
     * @param force_online : Weather to run the given dao directly on the server or run on the local machine, If true then run the server
     * @param offline_tables : List of all the tables + views name that is public in nature
     * @param default_dao_running_status : Default dao running status , if 'online' then all the dao will run on the server side
     * @param query : SQL query string of the dao
     * @param socket : Socket connection to the server
     * @param live_data : Live Data object of the dao
     * @param dao_param_object : Dao input object which is just a key val object, key = 'param name' value = 'value '
     * @param modification_happen : When the dao changes the database then this callback function will be fired
     * @param remove_me : When the dao type is modification then after successful call this callback will be fired that should remove the this object from the MAP
     */
    constructor(
        private original_function_ref: any,
        private original_function: any,
        private original_function_args: any[],
        private local_sql_connection: ISQLQuery,
        private dao_init_uuid: string,
        private dao_name: string,
        private force_online: boolean,
        private offline_tables: string[],
        private default_dao_running_status: dao_status,
        private query: string,
        private socket: SocketIOClient.Socket,
        private live_data: LiveData<any>,
        private dao_param_object: any,
        private modification_happen: (table_range: string[]) => void,
        private remove_me: (dao_init_uuid: string) => void
    ) {
        /** Attach the callback for the query_type and tables_involved */
        (this.live_data as any).captureTablesInvolved = (table_list: string[]) => {
            this.tables_involved = table_list;
        };

        (this.live_data as any).captureQueryType = (query_type: query_type) => {
            this.query_type = query_type;
        };

        /** Detect the running env */
        this.detect_dao_running_env();

        /** Do the initial fetch */
        const dao_call_uuid = uuid();
        this.dao_call_records.push(dao_call_uuid);
        this.fetch(dao_call_uuid);
    }

    public delete_if_done() {
        if (this.dao_call_records.length === 0 && this.mark_for_delete) {
            if (this.live_data.kill()) {
                this.remove_me(this.dao_init_uuid);
            }
        }
    }

    public dao_online_result_received(data: any) {
        if (data.is_err) {
            console.error(data);
            this.delete_instance(data.dao_call_uuid);
        } else {
            // Extract the data from the socket data
            const dao_name = data.dao_name;
            const dao_init_uuid = data.dao_init_uuid;
            const result = data.result;
            const mode = data.mode;

            if (dao_name === this.dao_name && dao_init_uuid === this.dao_init_uuid && mode === 'obs') {
                if (result) {
                    this.live_data.push(result, this.dao_init_uuid);
                    this.delete_instance(data.dao_call_uuid);
                } else {
                    this.live_data.pushError(new Error('Online Dao Error'), this.dao_init_uuid);
                    this.delete_instance(data.dao_call_uuid);
                }

                // If the dao is modification dao - IDU, then kill the live data and remove it
                // if (this.query_type !== 'SELECT') {
                //     // this is modification dao
                //     if (this.live_data.kill(this.live_data.uuid)) {
                //         // killed the live data
                //         // remove the live data from the map
                //         this.remove_me(this.dao_init_uuid);
                //     }
                // }
            }
        }
    }

    /** Check if the instance is marked for delete , if yes then delete the instance */
    private delete_instance(dao_call_uuid: string) {
        this.dao_call_records = this.dao_call_records.filter((p) => p !== dao_call_uuid);
        if (this.dao_call_records.length === 0 && this.mark_for_delete) {
            if (this.live_data.kill()) {
                this.remove_me(this.dao_init_uuid);
                console.log('deleted the dao call manager instance');
            }
        }
    }

    /**Detect the dao running env */
    private detect_dao_running_env = () => {
        let env: dao_status = undefined;

        if (this.force_online) {
            env = 'online';
        } else if (this.default_dao_running_status === 'online') {
            env = 'online';
        } else if (!is_left_array_subset_of_right_arr(this.tables_involved, this.offline_tables)) {
            env = 'online';
        } else {
            env = 'offline';
        }
        this.dao_running_env = env;
    };

    /** Send the command to server to execute this dao on the server side */
    private run_dao_online = (dao_call_uuid: string) => {
        this.socket.emit('dao_online', {
            dao_name: this.dao_name,
            dao_init_uuid: this.dao_init_uuid,
            dao_param_object: convert_object_to_sql_object(this.dao_param_object),
            dao_call_uuid,
            mode: 'obs',
        });
    };

    /** Dao's fetch is being called , just update the params of this object with new values and fetch the result */
    public update_dao = (query: string, dao_param_object: any, original_function_ref: any, original_function: any, original_function_args: any[]) => {
        if (this.query_type !== 'SELECT') {
        } else {
            /** Query type is select */
            /** Update with new params */
            this.query = query;
            this.dao_param_object = dao_param_object;
            this.original_function_ref = original_function_ref;
            this.original_function = original_function;
            this.original_function_args = original_function_args;

            const dao_call_uuid = uuid();
            this.dao_call_records.push(dao_call_uuid);
            this.fetch(dao_call_uuid);
        }
    };

    /** When the inner working tables changes then call this method to update the data to current version */
    public refetch = (table_range: string[]) => {
        if (this.dao_running_env === 'offline' && this.query_type.toUpperCase() === 'SELECT') {
            /**
             * Query type is SELECT
             * And running env is also offline
             * We are safe to refetch the data from the local server
             */
            if (is_two_array_intersect(table_range, this.tables_involved)) {
                const dao_call_uuid = uuid();
                this.dao_call_records.push(dao_call_uuid);
                this.fetch(dao_call_uuid);
            }
        }
    };

    private fetch = (dao_call_uuid: string) => {
        if (this.dao_running_env === 'online' || this.query_type === 'DELETE' || this.query_type === 'UPDATE' || this.query_type === 'MIXED' || this.query_type === 'TRANSACTION') {
            /** Run the dao online */
            this.run_dao_online(dao_call_uuid);
        } else {
            if (this.query_type === 'INSERT') {
                /** Run both online and offline , if there is no internet connection then online will fail , don't worry */
                this.run_dao_offline(dao_call_uuid).then(() => {
                    this.modification_happen(this.tables_involved);
                    this.run_dao_online(dao_call_uuid);
                });
            } else {
                /** Run the dao offline */
                /** Query type is SELECT and running env is offline */
                this.run_dao_offline(dao_call_uuid);
            }
        }
    };

    private run_dao_offline = async (dao_call_uuid: string) => {
        try {
            const result = await this.local_sql_connection.query(this.query);
            (this.live_data as any).DBData = result;
            await this.original_function.apply(this.original_function_ref, this.original_function_args);
            this.live_data.push((this.live_data as any).ModifiedData, this.dao_init_uuid);

            this.delete_instance(dao_call_uuid);
        } catch (error) {
            this.delete_instance(dao_call_uuid);
            this.live_data.pushError(error, this.dao_init_uuid);
        }
    };

    public update_dao_default_running_env = (env: dao_status) => {
        this.default_dao_running_status = env;
    };
}
