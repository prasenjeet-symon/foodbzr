import { DaoManager } from '@sculify/node-room-client';
import { LiveData } from '@sculify/live-data';
import { QueryServerDatabase } from './dao/online-daos/query_database';
import { DatabaseWrapper } from './database/database-wrapper/database-wrapper';

export interface IDao<T> {
    fetch(...args: any[]): { asyncData: Promise<T>; obsData: () => void };
}

export interface daoType<T> extends LiveData<T> {
    fetch(...args: any[]): void;
    captureQueryType: (query_type: string) => void;
    captureTablesInvolved: (tables_involved: string[]) => void;
}

export type daoClassType = { new (arg: IDaoConfig): daoType<any> };

export interface inited_instances {
    instance_id: number;
    instance_name: string;
    instance_uuid: string;
    label: string;
    date_created: string;
}

export interface IDatabaseWrapper {
    get_instance(label: string): inited_instances | null;
    init(label: string): void;
}

export interface MYSQLConnectionConfig {
    host: string;
    port: number;
    password: string;
    user: string;
}

export interface instance_manager_table {
    instance_id: number;
    instance_uuid: string;
    instance_name: string;
    inputs: string;
    label: string;
    date_created: string;
}

export interface init_waiting_list {
    label: string;
    resolve: any;
    reject: any;
}

export interface rootDatabase {
    /** Name of the database */
    db_name: string;
    constructor_param_object: any;

    /** Get all tables classes, private + public */
    get_all_tables(): any[];

    /** Get all views classes, private + public */
    get_all_views(): any[];

    /** Will return table creation query, private + public */
    allTableCreationQuery(): string;

    /**
     * Will return view creation query, private + public
     * Should be used on the server side because views are not supported on the client side
     * To use the same  view on the client side use the table version of the view
     */
    allViewCreationQuery(): string;

    /**
     * Will return all the public tables
     * Public tables can be created on the server side
     */
    getAllOfflineTables(): any[];

    /**
     * Will return all private tables
     * Private tables should be created on the server side only
     * Private tables holds the sensative information , So never use private table on the client side
     */
    getAllPrivateTables(): any[];

    /**
     * Will return all public views
     */
    getAllOfflineViews(): any[];

    /**
     * Will return all private views
     */
    getAllPrivateViews(): any[];

    /**
     * Will return all public tables and views together
     */
    getAllOfflineEntity(): any[];

    /**
     * Will return all private tables and views together
     */
    getAllPrivateEntity(): any[];

    /**
     * Will return SQL creation command to create the public tables on the client side
     * This include all the tables and views which is public in nature
     * Since client side do not support the views that's why this will return the tables creation query instead of view creation query
     * Which map the view structure to table structure on the client side
     */
    allOfflineEntityTableCreationQuery(): string;

    /**
     * Will return all private tables and views creation query
     * Instead of views creation query this will return the tables creation query which is maped version of the views
     * Should not be used on the client side as well as server side because server support view creation query
     **/
    allPrivateEntityTableCreationQuery(): string;

    /**
     * Will return SQL creation query to create private and public tables and views
     * Use this on the server side to create the tables and views
     * Server can hold private and public tables and views
     * Use this on the server side to setup the database's tables and views
     */
    allEntityCreationQuery(): string;

    /**
     * Get names of the private and public tables and views
     */
    getAllTableNames(): string[];

    /**
     * Get names of the public tables and views
     */
    getAllOfflineTableNames(): any[];

    /**
     * Get fetch condition to use in the SQL command
     * This fetch condition restrict the rows that can be fetched on the client side
     * This help us to reduce the extra or unnecessay data to be stored on the client side
     * This fetch condition apply condition on the row to be used by the client side
     * @param table_name : table name to get the fetch condition from
     */
    getCacheFetchCondition(table_name: string): string | null;

    /**
     * Will return dao class
     * Note that dao name id unique in the given database
     * @param dao_name: Name of the dao to fetch
     */
    getDao(dao_name: string): daoClassType;

    /**
     * get the child database of this database which is acting as a parent database
     * Note that child database is always unique in the given database
     * @param database_name : Child database name
     */
    getChildDatabase(database_name: string): { new (...args: any[]): rootDatabase } | null;

    getUDLogTablesCreationQuery(): string;
}

export type dao_status = 'offline' | 'online';

export interface database_entity_config {
    entity: any;
    cache_fetch_condition?: string;
}

export interface dao_metadata {
    dao_name: string;
    query_type: query_type;
    tables_involved: string[];
    sql_query_string: string;
    fetch_param_object: any;
}

export interface IDaoConfig {
    canRunInstantDao?: boolean;
    runType: 'cold' | 'normal';

    serverQuery?: QueryServerDatabase;
    asyncServerQuery?: QueryServerDatabase;

    clientQuery?: DaoManager;
    asyncClientQuery?: DaoManager;

    // If the dao running mode is asyn then we use this property
    instanceUUID?: string;
    databaseWrapper?: DatabaseWrapper;
    canNotify?: boolean

    captureQueryString?: (queryString: string) => void;
    captureMetadata?: (data: dao_metadata) => void;
}

export const daoConfig = {
    serverQuery: null,
    clientQuery: null,
    runType: 'normal',
    captureQueryString: null,
};

export type table_config = {
    primaryKey: string;
    tableName: string;
    isSensitive?: boolean;
};
export type column_config = {
    dataType: any;
    columnName?: string;
    isNotNull?: boolean;
    defaultValue?: any;
};

export interface TableConfig {
    tableName: string;
    primaryKey: string;
    ColumnInfo: column_config[];
}

export type view_config = { view_name: string; query: string };
export type query_type = 'SELECT' | 'UPDATE' | 'DELETE' | 'INSERT' | 'CREATE' | 'MIXED' | 'TRANSACTION';
export type dao_execute_type = {
    row_id: any;
    dao_name: string;
    dao_inputs: any;
    query_type: query_type;
    target_table: string;
    row_uuid: string;
};

export type daoSignature = { new (arg: IDaoConfig): { fetch: (...args: any[]) => void } };
