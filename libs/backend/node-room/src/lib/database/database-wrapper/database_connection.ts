import { MYSQLConnectionConfig } from '../../main-interface';
import { MYSQLManager } from './uuid_manager';

/**
 * Create the database connection and manage it
 * This class can be called only once
 */

export class DatabaseConnection {
    private connection: any;
    private mysql: any;

    constructor() {
        this.mysql = MYSQLManager.getInstance().mysql;
    }

    public dispose_connection() {
        if (this.connection) {
            this.connection.end();
        }
    }

    public create_mysql_connection = (MYSQLConfig: MYSQLConnectionConfig, multiple_query = false, database_name?: string) => {
        if (database_name) {
            /** Database name is provided */
            this.connection = this.mysql.createConnection({
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
            this.connection = this.mysql.createConnection({
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
