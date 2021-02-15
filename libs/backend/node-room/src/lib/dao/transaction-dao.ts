import { LiveData } from '@sculify/live-data';
import { IDaoConfig, query_type } from '../main-interface';
import { extract_function_param_names, running_env } from '../utils';
import { QueryServerDatabase } from './online-daos/query_database';

export class TBaseDao<T> extends LiveData<T> {
    public captureTablesInvolved: (table_involved: string[]) => void;
    public captureQueryType: (query_type: query_type) => void;
    public TDaoConfig: IDaoConfig;

    private newServerQuery: QueryServerDatabase;
    public DBData: T;
    public ModifiedData: any;
    private tablesInvolved: string[] = [];
    private child_dao_query_types: string[] = [];
    //---------------------------------------------------------------------->

    //---------------------------------------------------------------------->
    constructor(private daoConfig: IDaoConfig) {
        super();
    }
    //---------------------------------------------------------------------->

    public emitTablesInvolved(tables: string[]) {
        this.tablesInvolved = [...this.tablesInvolved, ...tables];
        /** Emit info to the observer class */
        this.captureTablesInvolved(this.tablesInvolved);
    }

    public emitQueryType(query_type: query_type) {
        this.child_dao_query_types = [...this.child_dao_query_types, query_type];
        const is_select_type_only = this.child_dao_query_types.filter((p) => p === 'SELECT').length === this.child_dao_query_types.length ? true : false;
        if (is_select_type_only) {
            this.captureQueryType('SELECT');
        } else {
            this.captureQueryType('TRANSACTION');
        }
    }

    public baseFetch<R>(data: R): { asyncData: (parent_ref?: any) => Promise<R>; obsData: () => void } {
        this.ModifiedData = data;
        return;
    }

    //TODO: pending task make this run on web plus server , see the normal dao
    protected async asyncDao(original_function: any, original_function_ref: any, original_function_args: any[], parent_ref: any) {
        console.time('time taken for the transaction');
        await original_function.apply(original_function_ref, original_function_args);
        console.timeEnd('time taken for the transaction');
        return this.ModifiedData;
    }

    protected async obsDao(original_function: any, original_function_ref: any, original_function_args: any[], param_object: any, dao_name: string) {
        this.child_dao_query_types = [];
        this.tablesInvolved = [];

        if (running_env() === 'web') {
            this.daoConfig.clientQuery.runDao(this.uuid, true, this, '', param_object, dao_name, original_function_ref, original_function, original_function_args);
        } else {
            await original_function.apply(original_function_ref, original_function_args);
            this.push({ data: this.ModifiedData, extra_data: [] } as any, this.uuid);
        }
    }

    public async openTransaction() {
        /** Create new connection to DB */
        this.newServerQuery = this.daoConfig.serverQuery.create_new_connection();
        /** Start the transaction on the connection */
        await this.newServerQuery.do_multiple_query('START TRANSACTION;');
        /** Modifiy the daoConfig Object for the transaction */
        this.TDaoConfig = { ...this.daoConfig, serverQuery: this.newServerQuery, asyncServerQuery: this.newServerQuery, canNotify: false, canRunInstantDao: false };
    }

    /**Close the opened Transaction */
    public async closeTransaction() {
        await this.newServerQuery.do_multiple_query('COMMIT;');
        /** Close the db connection */
        this.newServerQuery.dispose_connection();
    }

    /** If there is any Error in the Transaction Dao body then rollback the changes on the databases */
    public async rollback() {
        await this.newServerQuery.do_multiple_query('ROLLBACK;');
        this.newServerQuery.dispose_connection();
    }
}

/** Transaction Decorators */
export function TQuery() {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const original_function = descriptor.value;
        /** Extract the "fetch" function param names */
        const param_names = extract_function_param_names(descriptor.value);

        descriptor.value = function (...args: any[]) {
            /**
             * Extract the param value and associate it with proper param name
             * To construct the param object - { 'param_name' :'param_value'}
             */
            const param_object: any = {};
            param_names.forEach((param_name, index) => {
                param_name = param_name.trim();
                if (args[index]) {
                    param_object[param_name] = args[index];
                } else {
                    param_object[param_name] = undefined;
                }
            });

            /** this is the reference to the base class */
            const containing_class = this as any; // Base class ref

            const running_env_config = function (fetch_ref: any) {
                return {
                    asyncData: async function (parent_ref?: any) {
                        const data = await containing_class.asyncDao(original_function, fetch_ref, args, parent_ref);
                        return data;
                    },
                    obsData: () => {
                        containing_class.obsDao(original_function, fetch_ref, args, param_object, target.constructor.name.trim());
                    },
                };
            };

            return running_env_config(this);
        };

        return descriptor;
    };
}
