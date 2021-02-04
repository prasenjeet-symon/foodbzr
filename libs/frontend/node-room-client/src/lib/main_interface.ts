import { LiveData } from '@sculify/live-data';

export type generalTrimOption = '{' | '[' | '(';
export type dao_status = 'offline' | 'online';
export type query_type =
  | 'SELECT'
  | 'UPDATE'
  | 'DELETE'
  | 'INSERT'
  | 'CREATE'
  | 'MIXED'
  | undefined;

export type daoClassType = { new (arg: IDaoConfig): daoType<any> };

export type executedDaoType = {
  row_id: number;
  dao_name: string;
  dao_inputs: any;
  query_type: query_type;
  target_table: string;
  row_uuid: string;
  date_created: string;
};
export interface sync_pull_result {
  offline_table_name: string;
  result:
    | {
        main_table_data: any;
        update_table_data: any;
        delete_table_data: any;
      }
    | undefined;
}

export interface update_table_data {
  row_id: number;
  updated_to: string;
  main_row_uuid: string;
  row_uuid: string;
  date_created: string;
}
export interface delete_table_data {
  row_id: number;
  main_row_uuid: string;
  row_uuid: string;
  date_created: string;
}
export interface update_table_data_local extends update_table_data {
  synced: 'yes' | 'no';
}
export interface delete_table_data_local extends delete_table_data {
  synced: 'yes' | 'no';
}

export interface daoType<T> extends LiveData<T> {
  fetch(...args: any[]): void;
  getTableInvolved(): string[];
  getQueryType(): string;
}

export interface IDaoConfig {
  serverQuery?: any;
  clientQuery?: any;
  runType?: 'cold' | 'normal';
  captureQueryString?: (queryString: string) => void;
}
export const daoConfig = {
  serverQuery: '',
  clientQuery: '',
  runType: 'normal',
  captureQueryString: '',
};

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
  getDao(dao_name: string): daoClassType | null;

  /**
   * get the child database of this database which is acting as a parent database
   * Note that child database is always unique in the given database
   * @param database_name : Child database name
   */
  getChildDatabase(
    database_name: string
  ): { new (...args: any[]): rootDatabase } | null;
}

export interface IDaoManager {
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
  runDao(
    dao_init_uuid: string,
    force_online: boolean,
    live_data: LiveData<any>,
    query: string,
    dao_param_object: any,
    dao_name: string,
    query_type: query_type,
    tables_involved: string[]
  ): Promise<void>;
  modification_happens(table_range: string[]): void;
  remove_me(dao_init_uuid: string): void;
  update_daos_default_running_env(env: dao_status): void;
}

export interface ClientQueryRunner {
  getInstance(): ClientQueryRunner;
}
