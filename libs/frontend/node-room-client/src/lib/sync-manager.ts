import { ISQLConnection } from '@sculify/indexed-sql';
import { openDB } from 'indexed-pdb';
import { dao_status, executedDaoType, rootDatabase } from './main_interface';
import {
  convert_sql_object_to_normal,
  convert_sql_string_to_string,
  convert_to_sql_insertable_object,
} from './utils';

export class SyncOfflineTables {
  private static instance: SyncOfflineTables;

  private __sync_map: Map<string, Sync> = new Map();
  private current_sync_table: { name: string; index: number } = {
    name: 'sync_not_started',
    index: -1,
  };
  private dao_execution_waiting_list: executedDaoType[] = [];
  private dao_execution_observer_table_name = 'dao_execution_observer';
  private daoRunner: DaoRunner;

  /**
   *
   * @param database_name : client database name
   * @param socket : Socket connection to server
   * @param offline_tables : List of all offline tables name
   * @param clientDatabase : Client database instance
   * @param default_dao_running_status : Default dao running status 'online' or 'offline'
   */
  private constructor(
    private database_name: string,
    private socket: SocketIOClient.Socket,
    private offline_tables: string[],
    private clientDatabase: rootDatabase,
    private default_dao_running_status: dao_status,
    private modification_happens: (tables_involved: string[]) => void
  ) {
    this.listen_for_dao_execution();
  }

  public static initInstance = (
    database_name: string,
    socket: SocketIOClient.Socket,
    offline_tables: string[],
    clientDatabase: rootDatabase,
    default_dao_running_status: dao_status,
    modification_happens: (tables_involved: string[]) => void
  ) => {
    SyncOfflineTables.instance = new SyncOfflineTables(
      database_name,
      socket,
      offline_tables,
      clientDatabase,
      default_dao_running_status,
      modification_happens
    );
    SyncOfflineTables.instance.__sync_map.clear();
    SyncOfflineTables.instance.daoRunner = new DaoRunner(
      SyncOfflineTables.instance.clientDatabase,
      SyncOfflineTables.instance.database_name,
      SyncOfflineTables.instance.dao_execution_observer_table_name,
      SyncOfflineTables.instance.modification_happens
    );
    SyncOfflineTables.instance.offline_tables.forEach((table_name) =>
      SyncOfflineTables.instance.__sync_map.set(
        table_name,
        new Sync(
          SyncOfflineTables.instance.socket,
          table_name,
          SyncOfflineTables.instance.database_name,
          SyncOfflineTables.instance.change_to_next_table,
          SyncOfflineTables.instance.daoRunner,
          SyncOfflineTables.instance.dao_execution_observer_table_name
        )
      )
    );
  };

  public static getInstance = () => {
    return SyncOfflineTables.instance;
  };

  public sync_all_tables = async () => {
    this.current_sync_table = { name: this.offline_tables[0], index: 0 };
    for (const [index, value] of this.__sync_map) {
      await value.sync();
    }
    this.modification_happens(this.offline_tables);
  };

  /**
   *
   * @param table_name : Current table name
   */
  public change_to_next_table = (table_name: string) => {
    const index_of_table = this.offline_tables.findIndex(
      (val) => val === table_name
    );
    if (this.offline_tables[index_of_table + 1]) {
      this.current_sync_table = {
        name: this.offline_tables[index_of_table + 1],
        index: index_of_table + 1,
      };
    } else {
      this.current_sync_table = { name: 'sync_complete', index: -1 };

      // run the dao execution
      for (const dao of this.dao_execution_waiting_list) {
        if (dao.query_type === 'DELETE') {
          this.daoRunner.execute_delete_dao(dao, false);
        } else if (dao.query_type === 'UPDATE') {
          this.daoRunner.execute_update_dao(dao, false);
        }
      }
    }
  };

  private listen_for_dao_execution = () => {
    this.socket.on('execute_dao_now', (dao: executedDaoType) => {
      if (dao) {
        if (
          this.default_dao_running_status === 'online' ||
          !this.clientDatabase
            .getAllOfflineTableNames()
            .includes(dao.target_table)
        ) {
          // Not suitable for dao execution, table is private or dao running status is online
        } else {
          if (dao.query_type === 'DELETE' || dao.query_type === 'UPDATE') {
            if (this.current_sync_table.name === 'sync_complete') {
              // sync is complete
              if (this.dao_execution_waiting_list.length !== 0) {
                this.dao_execution_waiting_list.push(dao);
              } else {
                // execute the dao DELETE, UPDATE
                if (dao.query_type === 'DELETE') {
                  this.daoRunner.execute_delete_dao(dao);
                } else if (dao.query_type === 'UPDATE') {
                  this.daoRunner.execute_update_dao(dao);
                }
              }
            } else if (
              this.current_sync_table.name !== 'sync_not_started' &&
              this.current_sync_table.name !== dao.target_table &&
              this.offline_tables.includes(dao.target_table) &&
              this.offline_tables.indexOf(dao.target_table) <
                this.current_sync_table.index
            ) {
              // sync is in progress
              this.dao_execution_waiting_list.push(dao);
            } else {
              // Sync is not started yet
              // Will not accept any DELETE OR UPDATE Dao
            }
          } else if (dao.query_type === 'INSERT') {
            // Dao want to create new data
            // it will succed or fail , if failed then no worry
            // if the sync is in progress then do not worry just run the daoRunner
            this.daoRunner.execute_insert_dao(dao);
          }
        }
      }
    });
  };
}

class DaoRunner {
  constructor(
    private clientDatabase: rootDatabase,
    private database_name: string,
    private dao_execution_observer_table_name: string,
    private modification_happens: (table_involved: string[]) => void
  ) {}

  private getDaoQueryString = (dao_name: string, dao_inputs: any) => {
    return new Promise<string>((resolve, reject) => {
      const daoClass = this.clientDatabase.getDao(dao_name);
      if (daoClass) {
        const daoInstance = new daoClass({
          runType: 'cold',
          captureQueryString: (query) => resolve(query),
        });
        daoInstance.fetch(...Object.values(dao_inputs));
      } else {
        reject('not found');
      }
    });
  };

  public execute_update_dao = async (
    dao: executedDaoType,
    emit_change = true
  ) => {
    if (dao.query_type === 'UPDATE') {
      const database = new ISQLConnection({
        database_name: this.database_name,
        multi_query: false,
      });
      const connection = await database.open();
      const SQLUpdateStatement = await this.getDaoQueryString(
        dao.dao_name,
        dao.dao_inputs
      );
      const update_data = await connection.parse_update_statement(
        SQLUpdateStatement.replace(';', '')
      );
      // Note that update_data can be empty but it is ok
      const db_local = await openDB(this.database_name);
      const tnx = db_local.transaction(
        [dao.target_table, this.dao_execution_observer_table_name],
        'readwrite'
      );
      const target_table_store = tnx.objectStore(dao.target_table);
      const dao_observer_table_store = tnx.objectStore(
        this.dao_execution_observer_table_name
      );
      if ((await target_table_store.count()) !== 0) {
        for (const update_row of update_data) {
          target_table_store.put(update_row);
        }
      }

      let found_observer_row = false;

      if ((await dao_observer_table_store.count()) !== 0) {
        await dao_observer_table_store
          .openCursor()
          .then(function obs(cursor): any {
            if (!cursor) {
              return;
            }
            const row = cursor.value;
            if (
              convert_sql_object_to_normal(cursor.value).table_name ===
              dao.target_table
            ) {
              found_observer_row = true;
              // update
              row.dao_row_id = dao.row_id;
              return cursor.update(row).then(() => {
                return;
              });
            } else {
              return cursor.continue().then(obs);
            }
          });
      }

      if (!found_observer_row) {
        await dao_observer_table_store.put({
          table_name: `'${dao.target_table}'`,
          dao_row_id: dao.row_id,
        });
      }

      await tnx.is_complete();
      db_local.close();
      if (emit_change) {
        this.modification_happens([dao.target_table]);
      }
    }
  };

  public execute_delete_dao = async (
    dao: executedDaoType,
    emit_change = true
  ) => {
    if (dao.query_type === 'DELETE') {
      const database = new ISQLConnection({
        database_name: this.database_name,
        multi_query: false,
      });
      const connection = await database.open();
      const SQLDeleteStatement = await this.getDaoQueryString(
        dao.dao_name,
        dao.dao_inputs
      );
      const delete_where_statement = await connection.parse_delete_statement(
        SQLDeleteStatement.replace(';', '')
      );
      const db_local = await openDB(this.database_name);
      const tnx = db_local.transaction(
        [dao.target_table, this.dao_execution_observer_table_name],
        'readwrite'
      );
      const target_table_store = tnx.objectStore(dao.target_table);
      const dao_observer_table_store = tnx.objectStore(
        this.dao_execution_observer_table_name
      );

      if ((await target_table_store.count()) !== 0) {
        await target_table_store
          .openCursor()
          .then(function delete_item(cursor): any {
            if (!cursor) {
              return;
            }

            if (delete_where_statement) {
              const row_object = cursor.value;
              return connection
                .check_data_with_where(row_object, delete_where_statement)
                .then((data): any => {
                  if (data) {
                    return cursor.delete().then(() => {
                      return cursor.continue().then(delete_item);
                    });
                  } else {
                    // just move to next item
                    return cursor.continue().then(delete_item);
                  }
                });
            } else {
              // delete all row
              // just delete every row
              return cursor.delete().then(() => {
                return cursor.continue().then(delete_item);
              });
            }
          });
      }

      let found_observer_row = false;

      if ((await dao_observer_table_store.count()) !== 0) {
        await dao_observer_table_store
          .openCursor()
          .then(function obs(cursor): any {
            if (!cursor) {
              return;
            }
            const row = cursor.value;
            if (
              convert_sql_object_to_normal(cursor.value).table_name ===
              dao.target_table
            ) {
              found_observer_row = true;
              // update
              row.dao_row_id = dao.row_id;
              return cursor.update(row).then(() => {
                return;
              });
            } else {
              return cursor.continue().then(obs);
            }
          });
      }

      if (!found_observer_row) {
        await dao_observer_table_store.put({
          table_name: `'${dao.target_table}'`,
          dao_row_id: dao.row_id,
        });
      }

      await tnx.is_complete();
      db_local.close();
      if (emit_change) {
        this.modification_happens([dao.target_table]);
      }
    }
  };

  public execute_insert_dao = async (
    dao: executedDaoType,
    emit_change = true
  ) => {
    if (dao.query_type === 'INSERT') {
      const connection = await new ISQLConnection({
        database_name: this.database_name,
        multi_query: false,
      }).open();
      const SQLInsertQuery = await this.getDaoQueryString(
        dao.dao_name,
        dao.dao_inputs
      );
      let parsed_insert = await connection.parse_insert_statement(
        SQLInsertQuery.replace(';', '')
      );
      const fetch_condition = this.clientDatabase.getCacheFetchCondition(
        dao.target_table
      );

      // FIlter that is already created on this client
      const db_already = await openDB(this.database_name);
      const tnx_already = db_already.transaction(dao.target_table, 'readwrite');
      const object_store_target_table = tnx_already.objectStore(
        dao.target_table
      );

      if ((await object_store_target_table.count()) !== 0) {
        // Loop through all the row and check if the row_uuid match in the list
        await object_store_target_table
          .openCursor()
          .then(function check_already_exit(cursor): any {
            if (!cursor) {
              return;
            }
            const row_data = cursor.value;
            if (
              parsed_insert.some((val) => val.row_uuid === row_data.row_uuid)
            ) {
              // found the match
              // just update the synced property to 'yes'
              row_data.synced = "'yes'";
              return cursor.update(row_data).then(() => {
                parsed_insert = parsed_insert.filter(
                  (p) => p.row_uuid !== row_data.row_uuid
                );
                return cursor.continue().then(check_already_exit);
              });
            } else {
              return cursor.continue().then(check_already_exit);
            }
          });
      }

      let filtered_rows: any[] = [];
      if (fetch_condition) {
        for (const row_data of parsed_insert) {
          const passed_row = await connection.check_data_with_where(
            row_data,
            fetch_condition
          );
          if (passed_row) {
            filtered_rows.push({ ...row_data, synced: "'yes'" });
          }
        }
      } else {
        // no fetch condition just add all items
        filtered_rows = parsed_insert.map((p) => {
          return { ...p, synced: "'yes'" };
        });
      }

      await object_store_target_table.addAll(filtered_rows);
      await tnx_already.is_complete();
      db_already.close();
      if (filtered_rows.length !== 0 && emit_change) {
        this.modification_happens([dao.target_table]);
      }
    } else {
    }
  };
}

class Sync {
  private resolve_sync: any;
  private reject_sync: any;

  constructor(
    private socket: SocketIOClient.Socket,
    private table_name: string,
    private database_name: string,
    private change_table: (table_name: string) => void,
    private daoRuner: DaoRunner,
    private dao_execution_observer_table_name: string
  ) {
    this.socket.on('sync_table_complete', (data: any) => {
      this.change_table(this.table_name);
      const new_rows = data.new_rows;
      const unsynced_rows_uuid: string[] = data.unsynced_rows_uuid;
      const main_table_name = data.main_table_name;
      const daos = data.daos as executedDaoType[];

      if (main_table_name === this.table_name) {
        this.mark_unsynced_table_row_synced_and_add_new_rows(
          new_rows,
          unsynced_rows_uuid,
          daos
        )
          .then(() => {
            if (this.resolve_sync) {
              this.resolve_sync(true);
              this.resolve_sync = null;
            }
          })
          .catch((err) => {
            if (this.reject_sync) {
              this.reject_sync(err);
              this.reject_sync = null;
            }
          });
      }
    });
  }

  private mark_unsynced_table_row_synced_and_add_new_rows = async (
    new_rows: any[],
    unsynced_rows_uuid: string[],
    daos: executedDaoType[]
  ) => {
    // apply all the daos
    await this.runAllDao(daos);
    new_rows = new_rows.map((p) => {
      return { ...p, synced: 'yes' };
    });
    const connection_local = await new ISQLConnection({
      database_name: this.database_name,
      multi_query: false,
    }).open();
    new_rows = await connection_local.check_the_data_against_table(
      this.table_name,
      new_rows
    );
    const db = await openDB(this.database_name);
    const tnx = db.transaction(this.table_name, 'readwrite');
    const main_table_store = tnx.objectStore(this.table_name);

    if ((await main_table_store.count()) !== 0) {
      await main_table_store
        .openCursor()
        .then(function update_unsynced(cursor): any {
          if (!cursor) {
            return;
          }
          const table_row = cursor.value;
          if (
            unsynced_rows_uuid.includes(
              convert_sql_string_to_string(table_row.row_uuid)
            )
          ) {
            return cursor.update({ ...table_row, synced: "'yes'" }).then(() => {
              return cursor.continue().then(update_unsynced);
            });
          } else {
            return cursor.continue().then(update_unsynced);
          }
        });
    }

    await main_table_store.addAll(new_rows);

    await tnx.is_complete();
    db.close();
  };

  private retrive_all_synced_and_unsynced_data = async () => {
    const db = await openDB(this.database_name);
    const tnx = db.transaction(this.table_name, 'readonly');
    const main_table_store = tnx.objectStore(this.table_name);
    const unsynced_data: any[] = [];
    const synced_data_uuid: string[] = [];
    // open the cursor to read all the data
    if ((await main_table_store.count()) !== 0) {
      await main_table_store.openCursor().then(function push_data(cursor): any {
        if (!cursor) {
          return;
        }
        const table_row = convert_sql_object_to_normal(cursor.value);

        if (table_row.synced === 'yes') {
          synced_data_uuid.push(table_row.row_uuid);
        } else if (table_row.synced === 'no') {
          delete table_row.synced;
          delete table_row.row_id;
          unsynced_data.push(table_row);
        }
        return cursor.continue().then(push_data);
      });
    }

    await tnx.is_complete();
    db.close();

    return {
      main_table_name: this.table_name,
      unsynced_data,
      synced_data_uuid,
    };
  };

  private retrive_dao_last_index = async (table_name: string) => {
    const db = await openDB(this.database_name);
    const tnx = db.transaction(
      this.dao_execution_observer_table_name,
      'readonly'
    );
    const store = tnx.objectStore(this.dao_execution_observer_table_name);
    let index = 0;

    if ((await store.count()) !== 0) {
      store.openCursor().then(function cb(cursor): any {
        if (!cursor) {
          return;
        }
        const row_data = convert_sql_object_to_normal(cursor.value);
        if (row_data.table_name === table_name) {
          index = +row_data.dao_row_id;
          return;
        } else {
          return cursor.continue().then(cb);
        }
      });
    }

    await tnx.is_complete();
    db.close();
    return index;
  };

  private send_data_to_server = async () => {
    const data = await this.retrive_all_synced_and_unsynced_data();
    // retrive the dao last index
    const lastDaoIndex = await this.retrive_dao_last_index(this.table_name);
    const data_to_emit = { ...data, lastDaoIndex };

    this.socket.emit('sync_table', data_to_emit);
  };

  public sync = async () => {
    if (!(this.resolve_sync && this.reject_sync)) {
      this.send_data_to_server();
      return new Promise<boolean>((resolve, reject) => {
        this.resolve_sync = resolve;
        this.reject_sync = reject;
      });
    } else {
      return true;
    }
  };

  private run_dao = async (dao: executedDaoType) => {
    if (dao.query_type === 'DELETE') {
      await this.daoRuner.execute_delete_dao(dao, false);
    } else if (dao.query_type === 'UPDATE') {
      await this.daoRuner.execute_update_dao(dao, false);
    }
  };

  private runAllDao = async (daos: executedDaoType[]) => {
    for (const dao of daos) {
      await this.run_dao(dao);
    }
  };
}
