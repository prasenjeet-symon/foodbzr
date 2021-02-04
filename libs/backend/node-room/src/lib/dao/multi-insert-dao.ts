import { LiveData } from '@sculify/live-data';
import { dao_execute_type, IDaoConfig, query_type } from '../main-interface';
import { detect_query_type, extract_function_param_names, extract_list_of_tables_involved_in_mixed_type, extract_table_list_from_query, parse_sql_string, running_env } from '../utils';
import { extract_insertion_data_column_info, make_select_literals } from '@sculify/indexed-sql';

export function modifyQueryString(query: string, arg_first_value: any[]) {
    const columns_names = extract_insertion_data_column_info(make_select_literals(query));

    if (columns_names.length !== 0) {
        const fetch_param_values: any[] = arg_first_value;
        const final_insert_values: any[][] = [];

        fetch_param_values.forEach((fpv) => {
            const checked_object: any[] = [];
            columns_names.forEach((cn) => {
                if (fpv.hasOwnProperty(cn)) {
                    checked_object.push(fpv[cn]);
                } else {
                    throw new Error('invalid fetch param');
                }
            });
            final_insert_values.push(checked_object.map((p) => parse_sql_string(p)));
        });

        const replace_value = final_insert_values.map((p) => `(${p.join(', ')})`).join(', ');
        query = query.replace(new RegExp(`:insert_values:`, 'ig'), replace_value);
    } else {
        throw new Error('invalid insert statement');
    }

    return query;
}

export class MIBaseDao<T> extends LiveData<T> {
    private force_online: boolean; // Weather to run the dao on the server or on the client machine , if the value is true then it will run on the server
    private query_string: string; // Provided unmodified SQL Query
    private table_involved: string[] = []; // List of all the tables involved in the SQL Query
    private dao_name: string; // Name of this dao
    private sql_query_string!: string; // Modified SQL Query
    private fetch_param_object: any; // "fetch" function param object
    private child_dao_query_types: string[] = [];

    public captureQueryType: (query_type: query_type) => void;
    public captureTablesInvolved: (tables_involved: string[]) => void;

    /** Intial unmodified data */
    public DBData: T;
    /** Final Modified data */
    public ModifiedData: any;

    constructor(private daoConfig: IDaoConfig) {
        super();
    }

    /** Child dao will call this to emit the tables involved in them */
    public emitTablesInvolved(tables: string[]) {
        this.table_involved = [...this.table_involved, ...tables];
        /** Emit info to the observer class */
        if (this.captureTablesInvolved) {
            this.captureTablesInvolved(this.table_involved);
        }
    }

    /** Child dao will call this to emit it's query type */
    public emitQueryType(query_type: query_type) {
        this.child_dao_query_types = [...this.child_dao_query_types, query_type];
        const is_select_type_only = this.child_dao_query_types.filter((p) => p === 'SELECT').length === this.child_dao_query_types.length ? true : false;
        if (this.captureQueryType) {
            if (is_select_type_only) {
                this.captureQueryType('SELECT');
            } else {
                this.captureQueryType('MIXED');
            }
        }
    }

    baseFetch<R>(data: R): { asyncData: (parent_ref?: any) => Promise<R>; obsData: () => void } {
        this.ModifiedData = data;
        return;
    }

    private attachParamValues(original_query_string: string, param_object: any) {
        let modified_query = original_query_string;

        Object.keys(param_object).forEach((param, i) => {
            if (typeof param_object[param] === 'object') {
                modified_query = modified_query.replace(new RegExp(`:${param.trim()}:`, 'ig'), param_object[param].map((p: any) => parse_sql_string(p)).join(', ') as string);
            } else {
                modified_query = modified_query.replace(new RegExp(`:${param.trim()}:`, 'ig'), parse_sql_string(param_object[param]) as string);
            }
        });

        return modified_query;
    }

    protected async_query = async (
        param_object: any,
        original_query_string: string,
        dao_name: string,
        force_online: boolean,
        table_involved: string[],
        query_type: query_type,
        original_function_ref: any,
        original_function: any,
        original_function_args: any[]
    ) => {
        const modified_query = modifyQueryString(original_query_string, param_object);

        /** Determine the env ( 'web' | 'node' )
         * Run the dao in corresponding env
         * And return the result
         */
        if (running_env() === 'node' && this.daoConfig.asyncServerQuery) {
            /**
             *
             * Run the query on the server side
             *
             */
            const data = await this.daoConfig.asyncServerQuery.query(modified_query, dao_name, param_object, query_type, table_involved[0]);
            const extra_data: dao_execute_type[] = data.extra_data;
            const database_data = data.data;

            if (!(query_type === 'MIXED' || query_type === 'SELECT')) {
                // Execute the instant dao
                // Notify the instance connected
                if (this.daoConfig.databaseWrapper && this.daoConfig.instanceUUID) {
                    this.daoConfig.databaseWrapper.notifyInstance(this.daoConfig.instanceUUID, table_involved);
                    if (this.daoConfig.canRunInstantDao) {
                        this.daoConfig.databaseWrapper.runInstantDao(this.daoConfig.instanceUUID, extra_data);
                    }
                }
            }

            this.DBData = database_data;
            /** Call the original functon */
            await original_function.apply(original_function_ref, original_function_args);

            /** return the modified data */
            return this.ModifiedData;
        } else if (running_env() === 'web' && this.daoConfig.asyncClientQuery) {
            /**
             * Run the dao on the client (web-browser) side.
             */
            console.log('\n');
            console.info(`Running the dao ----> '${this.dao_name}' in the async mode only`);
            /**
             *
             *
             */

            const data = await this.daoConfig.asyncClientQuery.runAsyncDao(this.uuid, force_online, modified_query, param_object, dao_name, query_type, table_involved);
            /** If there is need to refetch the data then notify */
            /** Refetch started */
            if (data.from === 'server') {
                return data.data;
            } else {
                this.DBData = data;
                await original_function.apply(original_function_ref, original_function_args);
                return this.ModifiedData;
            }
        } else {
            /** No running env is detected */
        }
    };

    // on each fetch this is called
    protected obs_query = async (
        param_object: any,
        query_string: string,
        dao_name: string,
        force_online: boolean,
        table_involved: string[],
        query_type: query_type,
        original_function_ref: any,
        original_function: any,
        original_function_args: any[]
    ) => {
        this.table_involved = [];
        this.child_dao_query_types = [];

        this.dao_name = dao_name;
        this.force_online = force_online;
        this.query_string = query_string;
        const modified_query_string = modifyQueryString(query_string, param_object);
        this.fetch_param_object = param_object;
        this.sql_query_string = modified_query_string;

        this.emitQueryType(query_type);
        this.emitTablesInvolved(table_involved);

        if (this.daoConfig.runType === 'normal') {
            /**
             * Run the dao normally
             */
            if (running_env() === 'node' && this.daoConfig.serverQuery) {
                /**
                 * We are in the nodejs env
                 * Run the dao on the server side
                 */
                const data = await this.daoConfig.serverQuery.query(this.sql_query_string, this.dao_name, this.fetch_param_object, this.child_dao_query_types[0] as any, this.table_involved[0]);
                const db_data = data.data;
                const extra_data = data.extra_data as dao_execute_type[];

                this.DBData = db_data;

                /** Run the original function  */
                await original_function.apply(original_function_ref, original_function_args);

                /** Emit the final data to live data */
                this.push({ data: this.ModifiedData, extra_data } as any, this.uuid);
                /**
                 *
                 *
                 */
            } else if (running_env() === 'web' && this.daoConfig.clientQuery) {
                /**
                 * We are in the web env
                 * Run the dao on the client (web-browser) side.
                 */
                console.log('\n');
                console.info(`Running the dao ----> '${this.dao_name}'`);
                /**
                 *
                 *
                 */
                this.daoConfig.clientQuery.runDao(
                    this.uuid,
                    this.force_online,
                    this,
                    this.sql_query_string,
                    this.fetch_param_object,
                    this.dao_name,
                    original_function_ref,
                    original_function,
                    original_function_args
                );
            }
            /**
             *
             */
        } else if (this.daoConfig.runType === 'cold') {
            /**
             * Emit the dao meta data
             */
            if (this.daoConfig.captureMetadata) {
                this.daoConfig.captureMetadata({
                    query_type: this.child_dao_query_types[0] as any,
                    tables_involved: this.table_involved,
                    sql_query_string: this.sql_query_string,
                    fetch_param_object: this.fetch_param_object,
                    dao_name: this.dao_name,
                });
            }
            /**
             *
             *
             */
            if (this.daoConfig.captureQueryString) {
                this.daoConfig.captureQueryString(this.sql_query_string);
            }
        }
    };
}

export function MIQuery(query: string, force_online: boolean = false) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        /** If the query param is empty or null then throw the Error  and stop execution */
        if (!query) {
            throw new Error('query param is required in the Query decorator.');
        }

        /**
         * Replace the new line with single space in the incoming SQL query
         */
        query = query.replace(new RegExp('\\n', 'ig'), ' ');

        /** Extract the "fetch" function param names */
        const param_names = extract_function_param_names(descriptor.value);
        /** Detect the incoming query type - 'SELECT' | 'DELETE' | 'UPDATE' | 'INSERT' */
        const query_type = detect_query_type(query.trim());

        /** If there is no detected query type then possibly query is invalid , just throw the new Error  */
        if (!query_type) {
            throw new Error('Query type is needed in the Query decorator.');
        }

        /**
         * Extract the list of tables involved in the query
         */
        let table_names: string[] = [];
        if (query_type === 'MIXED') {
            /** If the query type is mixed ( there is more than one SQL statement  ) then force this dao to run on the server */
            force_online = true;
            const found_tables = extract_list_of_tables_involved_in_mixed_type(query, 'test_database');
            table_names = found_tables ? found_tables : [];
        } else {
            const table_involved = extract_table_list_from_query(query, 'test_database', query_type as string);
            table_names = table_involved ? table_involved.map((p) => p.table_name) : [];
        }

        const original_function = descriptor.value;

        /** Extend the "fetch" function with new body */
        descriptor.value = function (...args: any[]) {
            /**
             * Extract the param value and associate it with proper param name
             * To construct the param object - { 'param_name' :'param_value'}
             */
            const param_object: any = args[0];

            /** containing_class is the original class in the "fetch" function is */
            const containing_class = this as any;

            /**
             * Create new promise to return in the "fetch" function
             * Once the result is avail then resolve this promise in the class
             */

            const running_env_config = function (fetch_ref: any) {
                return {
                    asyncData: async function (parent_ref?: any) {
                        const DB_data = await containing_class.async_query(
                            param_object,
                            query,
                            target.constructor.name.trim(),
                            force_online,
                            table_names,
                            query_type,
                            fetch_ref,
                            original_function,
                            args
                        );
                        return DB_data;
                    },
                    obsData: function () {
                        containing_class.obs_query(param_object, query, target.constructor.name.trim(), force_online, table_names, query_type, fetch_ref, original_function, args);
                    },
                };
            };

            return running_env_config(this);
        };

        return descriptor;
    };
}
