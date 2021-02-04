import { MYSQLConnectionConfig } from '../../main-interface';
import * as mysql from 'mysql';

/**
 * Create the database connection and manage it
 * This class can be called only once
 */

export class DatabaseConnection {
    private connection: mysql.Connection;

    constructor() {}

    public dispose_connection() {
        if (this.connection) {
            this.connection.end();
        }
    }

    public create_mysql_connection = (MYSQLConfig: MYSQLConnectionConfig, multiple_query = false, database_name?: string) => {
        if (database_name) {
            /** Database name is provided */
            this.connection = mysql.createConnection({
                host: MYSQLConfig.host,
                port: MYSQLConfig.port,
                password: MYSQLConfig.password,
                user: MYSQLConfig.user,
                database: database_name,
                multipleStatements: multiple_query ? true : false,
            });

            this.connection.connect();
            return this.connection;
        } else {
            // database name is not provided
            this.connection = mysql.createConnection({
                host: MYSQLConfig.host,
                port: MYSQLConfig.port,
                password: MYSQLConfig.password,
                user: MYSQLConfig.user,
                multipleStatements: multiple_query ? true : false,
            });
            this.connection.connect();
            return this.connection;
        }
    };
}
