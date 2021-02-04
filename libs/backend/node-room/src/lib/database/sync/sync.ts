import { Socket } from 'socket.io';
import { MYSQLConnectionConfig, rootDatabase } from '../../main-interface';
import { parse_sql_string } from '../../utils';
import { DatabaseConnection } from '../database-wrapper/database_connection';

export class OfflineSync {
    private clientDatabase: rootDatabase;
    /**
     *
     * @param socket : Client sokcet connection
     * @param mysql_config : MYSQL database connection config
     * @param database_name : Database instance name , root database instance name
     */
    constructor(
        private socket: Socket,
        private mysql_config: MYSQLConnectionConfig,
        private database_name: string,
        private rootDatabaseInstance: rootDatabase,
        private childDatabaseName: string,
        private childDatabaseParamObject: any,
        private single_table_sync_complete: (table_involved: string[]) => void
    ) {
        this.childDatabaseParamObject = this.childDatabaseParamObject ? this.childDatabaseParamObject : {};
        if (childDatabaseName) {
            // there is child database
            const childDB = this.rootDatabaseInstance.getChildDatabase(childDatabaseName);
            if (childDB) {
                const childDBInstance = new childDB(...Object.values(this.childDatabaseParamObject));
                this.clientDatabase = childDBInstance;
            } else {
                throw new Error(`child database not found - ${childDatabaseName}`);
            }
        } else {
            // there is n no child database
            // there is only root database
            this.clientDatabase = this.rootDatabaseInstance;
        }

        this.socket.on('sync_table', (data) => {
            const lastDaoIndex: number = data.lastDaoIndex;
            const main_table_name: string = data.main_table_name;
            const unsynced_data: any[] = data.unsynced_data;
            const synced_data_uuid: string[] = data.synced_data_uuid;
            this.perform_database_operation(main_table_name, unsynced_data, synced_data_uuid, lastDaoIndex);
        });
    }

    private perform_database_operation = async (main_table_name: string, unsynced_data: any[], synced_data_uuid: string[], lastDaoIndex: number) => {
        const fetch_condition = this.clientDatabase.getCacheFetchCondition(main_table_name); // this fetch condition can be 'undefined' or ''
        const log_table = `${main_table_name}_UD_LOG`; // Name of the log table
        synced_data_uuid = synced_data_uuid.map((p) => parse_sql_string(p)) as string[];

        // Extract the new data from the server from the given table name, All the data that is outside the range of synced_data_uuid
        const SQL_extract_new_data_from_server = `
            SELECT * 
            FROM ${main_table_name}
            WHERE
            row_uuid NOT IN ( ${synced_data_uuid.length === 0 ? `''` : synced_data_uuid.join(', ')} ) 
            ${fetch_condition ? `AND ( ${fetch_condition} )` : ``} ;
        `;

        let SQL_insert_new_data_to_server = '';
        if (unsynced_data.length !== 0) {
            //There is data from the local side to insert into given table
            SQL_insert_new_data_to_server = `
            INSERT INTO ${main_table_name}
            ( ${Object.keys(unsynced_data[0]).join(', ')} ) 
            VALUES
            ${unsynced_data
                .map(
                    (val) =>
                        `( ${Object.values(val)
                            .map((p) => parse_sql_string(p))
                            .join(', ')} )`
                )
                .join(', ')};
        `;
        }

        const SQL_read_daos_after_local_index = `
        SELECT * 
        FROM ${log_table}
        WHERE row_id > ${parse_sql_string(lastDaoIndex)};
        `;

        const connection: any = new DatabaseConnection().create_mysql_connection(this.mysql_config, true, this.database_name);
        const start_transaction = await this.do_sequencial_single_query(connection, `START TRANSACTION;`);

        const extracted_new_data = await this.do_sequencial_single_query(connection, SQL_extract_new_data_from_server);
        if (unsynced_data.length !== 0) {
            await this.do_sequencial_single_query(connection, SQL_insert_new_data_to_server);
        }

        let read_daos = (await this.do_sequencial_single_query(connection, SQL_read_daos_after_local_index)) as any[];
        read_daos = read_daos.map((p) => {
            return { ...p, dao_inputs: JSON.parse(p.dao_inputs) };
        });

        const emitted = this.socket.emit('sync_table_complete', {
            new_rows: extracted_new_data,
            unsynced_rows_uuid: unsynced_data.map((p) => p.row_uuid),
            main_table_name: main_table_name,
            daos: read_daos,
        });
        if (emitted) {
            await this.do_sequencial_single_query(connection, 'COMMIT;');
            // Single table sync complete
            this.single_table_sync_complete([main_table_name]);
        } else {
            await this.do_sequencial_single_query(connection, 'ROLLBACK;');
        }
        connection.destroy();
    };

    private do_sequencial_single_query = (connection: any, single_query_statement: string) => {
        return new Promise<any>((resolve, reject) => {
            connection.query(single_query_statement, (error: any, result: any) => {
                error ? reject(error) : resolve(result);
            });
        });
    };
}
