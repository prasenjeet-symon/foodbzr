import { Connection } from 'mysql';
import { DatabaseConnection } from '../../database/database-wrapper/database_connection';
import { UUIDManager } from '../../database/database-wrapper/uuid_manager';
import { MYSQLConnectionConfig, query_type } from '../../main-interface';
import { parse_sql_string } from '../../utils';

/**
 * Query the database and return the result in promise
 */
export class QueryServerDatabase {
    private DBConnection: DatabaseConnection;
    public connection: Connection;

    constructor(private MYSQLConfig: MYSQLConnectionConfig, private database_name: string) {
        this.DBConnection = new DatabaseConnection();
        this.connection = this.DBConnection.create_mysql_connection(this.MYSQLConfig, true, this.database_name);
    }

    public create_new_connection() {
        const QueryServerDatabaseNewIns = new QueryServerDatabase(this.MYSQLConfig, this.database_name);
        return QueryServerDatabaseNewIns;
    }

    public dispose_connection = () => {
        this.DBConnection.dispose_connection();
    };

    /**
     * If the Query type is SELECT then target table has no use
     * @param SQLQuery : SQL query to run run the MYSQL server
     * @param dao_name : Dao name
     * @param dao_inputs : Dao input object
     * @param query_type : SQL Query type
     * @param target_table : target table name involved in the query
     */
    public query = async (SQLQuery: string, dao_name: string, dao_inputs: any, query_type: query_type, target_table: string) => {
        // possible values is INSERT, UPDATE , SELECT, DELETE
        switch (query_type) {
            case 'SELECT':
                return this.handle_select_query(SQLQuery);

            case 'DELETE':
                return this.handle_delete_query(SQLQuery, dao_name, dao_inputs, query_type, target_table);

            case 'UPDATE':
                return this.handle_update_query(SQLQuery, dao_name, dao_inputs, query_type, target_table);

            case 'INSERT':
                return this.handle_insert_query(SQLQuery, dao_name, dao_inputs, query_type, target_table);

            case 'MIXED':
                return this.handle_mixed_query(SQLQuery);
        }
    };

    public do_multiple_query = (query_string: string) => {
        return new Promise<any[]>((resolve, reject) => {
            this.connection.query(query_string, (error: any, result: any) => {
                if (error) {
                    reject(error);
                    console.error(error, 'MYSQL Query Error');
                } else {
                    resolve(result as any[]);
                }
            });
        });
    };

    private handle_mixed_query = async (query: string) => {
        const result = await this.do_multiple_query(query);
        return { data: result, extra_data: null };
    };

    private handle_select_query = async (query: string) => {
        const result = await this.do_multiple_query(query);
        return { data: result, extra_data: null };
    };

    private handle_insert_query = async (query: string, dao_name: string, dao_inputs: any, query_type: query_type, target_table: string) => {
        const result = await this.do_multiple_query(query);
        return {
            data: result,
            extra_data: [
                {
                    dao_name,
                    dao_inputs,
                    query_type,
                    target_table,
                    row_uuid: null,
                },
            ],
        };
    };

    private handle_delete_query = async (query: string, dao_name: string, dao_inputs: any, query_type: query_type, target_table: string) => {
        const row_uuid = UUIDManager.getInstance().uuid();

        const SQL_query = `
        START TRANSACTION;

        ${query}

        INSERT INTO ${target_table}_UD_LOG
        (   
            dao_name,
            dao_inputs,
            query_type, 
            target_table, 
            row_uuid,
            date_created
        )
        VALUES
        (
            ${parse_sql_string(dao_name)},
            ${parse_sql_string(JSON.stringify(dao_inputs))},
            ${parse_sql_string(query_type)},
            ${parse_sql_string(target_table)},
            ${parse_sql_string(row_uuid)},
            NOW()
        );

        COMMIT;

        `;

        const result = await this.do_multiple_query(SQL_query);

        const row_id = result[2].insertId;
        return {
            data: result[1],
            extra_data: [
                {
                    row_id,
                    dao_name,
                    dao_inputs,
                    query_type,
                    target_table,
                    row_uuid,
                },
            ],
        };
    };

    private handle_update_query = async (query: string, dao_name: string, dao_inputs: any, query_type: query_type, target_table: string) => {
        const row_uuid = UUIDManager.getInstance().uuid();

        const SQL_query = `
        START TRANSACTION;

        ${query}

        INSERT INTO ${target_table}_UD_LOG
        (   dao_name,
            dao_inputs,
            query_type, 
            target_table, 
            row_uuid,
            date_created
        )
        VALUES
        (
            ${parse_sql_string(dao_name)},
            ${parse_sql_string(JSON.stringify(dao_inputs))},
            ${parse_sql_string(query_type)},
            ${parse_sql_string(target_table)},
            ${parse_sql_string(row_uuid)},
            NOW()
        );

        COMMIT;

        `;

        const result = await this.do_multiple_query(SQL_query);
        const row_id = result[2].insertId;
        return {
            data: result[1],
            extra_data: [
                {
                    row_id,
                    dao_name,
                    dao_inputs,
                    query_type,
                    target_table,
                    row_uuid,
                },
            ],
        };
    };
}
