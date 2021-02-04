import { LiveData } from '@sculify/live-data';
import { IDaoConfig, query_type } from '../main-interface';
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

    protected async asyncDao(original_function: any, original_function_ref: any, original_function_args: any[]) {
        await original_function.apply(original_function_ref, original_function_args);
        return this.ModifiedData;
    }

    protected async obsDao(original_function: any, original_function_ref: any, original_function_args: any[]) {
        this.child_dao_query_types = ['TRANSACTION'];
        this.tablesInvolved = [];
        await original_function.apply(original_function_ref, original_function_args);
        this.push({ data: this.ModifiedData, extra_data: [] } as any, this.uuid);
    }

    public async openTransaction() {
        /** Create new connection to DB */
        this.newServerQuery = this.daoConfig.serverQuery.create_new_connection();
        /** Start the transaction on the connection */
        await this.newServerQuery.do_multiple_query('START TRANSACTION;');
        /** Modifiy the daoConfig Object for the transaction */
        this.TDaoConfig = { ...this.daoConfig, serverQuery: this.newServerQuery, asyncServerQuery: this.newServerQuery, canRunInstantDao: false };
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

        descriptor.value = function (...args: any[]) {
            const containing_class = this as any; // Base class ref

            const running_env_config = function (fetch_ref: any) {
                return {
                    asyncData: async function (parent_ref?: any) {
                        const data = await containing_class.asyncDao(original_function, fetch_ref, args);
                        return data;
                    },
                    obsData: () => {
                        containing_class.obsDao(original_function, fetch_ref, args);
                    },
                };
            };

            return running_env_config(this);
        };

        return descriptor;
    };
}
