import { daoClassType, database_entity_config, rootDatabase } from '../main-interface';
import { extract_function_param_names, is_there_space_in_string, modify_table_creation_query, parse_sql_string } from '../utils';

export function Database(config: { db_name: string; Tables: database_entity_config[]; Views: database_entity_config[]; childDatabase: any[] }) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T): T {
        const param_names = extract_function_param_names(constructor);

        // we support the database name in which there is no space
        if (is_there_space_in_string(config.db_name)) {
            throw new Error('found space in dataabse name. remove the space and try again');
        }

        return class extends constructor {
            private constructor_param_names = param_names;
            public constructor_param_object: any;
            public db_name: string = config.db_name.trim();

            constructor(...agrs: any[]) {
                super(agrs);
                this.constructor_param_object = this.make_args_object(agrs);
                // apply constructor values to all table, views fetcher
                this.assign_param_values_to_cache_fetcher();
            }

            /**
             * Will make the param object that holds constructor's  parameter name  with it's corresponding value
             * If there is no value related to any param then that will be undefined
             * @param args : Args of the constructor
             */
            private make_args_object = (args: any[]) => {
                const param_object: any = {};
                this.constructor_param_names.forEach((param_name, index) => {
                    param_name = param_name.trim();
                    if (args[index]) {
                        param_object[param_name] = args[index];
                    } else {
                        param_object[param_name] = undefined;
                    }
                });
                return param_object;
            };

            /**
             * After init of this database use the constructor param values to init the fetcher condition
             */
            private assign_param_values_to_cache_fetcher = () => {
                config.Tables.forEach((table_entity) => {
                    this.constructor_param_object = this.constructor_param_object ? this.constructor_param_object : {};
                    Object.keys(this.constructor_param_object).forEach((param_name) => {
                        if (table_entity.cache_fetch_condition) {
                            table_entity.cache_fetch_condition = table_entity.cache_fetch_condition.replace(
                                new RegExp(`:${param_name.trim()}`, 'ig'),
                                parse_sql_string(this.constructor_param_object[param_name]) as string
                            );
                        }
                    });
                });

                config.Views.forEach((table_entity) => {
                    this.constructor_param_object = this.constructor_param_object ? this.constructor_param_object : {};
                    Object.keys(this.constructor_param_object).forEach((param_name) => {
                        if (table_entity.cache_fetch_condition) {
                            table_entity.cache_fetch_condition = table_entity.cache_fetch_condition.replace(
                                new RegExp(`:${param_name.trim()}`, 'ig'),
                                parse_sql_string(this.constructor_param_object[param_name]) as string
                            );
                        }
                    });
                });
            };

            /**
             * Get all tables classes, private + public
             */
            public get_all_tables = () => {
                return config.Tables.map((p) => p.entity);
            };

            /**
             * Get all views classes, private + public
             */
            public get_all_views = () => {
                return config.Views.map((p) => p.entity);
            };

            /**
             * Will return table creation query, private + public
             *
             */
            public allTableCreationQuery = () => {
                return config.Tables.map((table_class) => {
                    const table_creation_command = new table_class.entity().generateTableQuery();
                    return table_creation_command;
                }).join(' ');
            };

            /**
             * Will return view creation query, private + public
             * Should be used on the server side because views are not supported on the client side
             * To use the same  view on the client side use the table version of the view
             */
            public allViewCreationQuery = () => {
                return config.Views.map((view_class) => {
                    const view_creation_command = new view_class.entity().generateViewQuery();
                    return view_creation_command;
                }).join(' ');
            };

            /**
             * Will return all the public tables
             * Public tables can be created on the server side
             */
            public getAllOfflineTables = () => {
                return config.Tables.filter((table_class) => !new table_class.entity().is_private_table());
            };

            /**
             * Will return all private tables
             * Private tables should be created on the server side only
             * Private tables holds the sensative information , So never use private table on the client side
             */
            public getAllPrivateTables = () => {
                return config.Tables.filter((table_class) => new table_class.entity().is_private_table());
            };

            /**
             * Will return all public views
             */
            public getAllOfflineViews = () => {
                return config.Views.filter((view_class) => !new view_class.entity().is_private_table());
            };

            /**
             * Will return all private views
             */
            public getAllPrivateViews = () => {
                return config.Views.filter((view_class) => new view_class.entity().is_private_table());
            };

            /**
             * Will return all public tables and views together
             */
            public getAllOfflineEntity = () => {
                return [...this.getAllOfflineTables(), ...this.getAllOfflineViews()];
            };

            /**
             * Will return all private tables and views together
             */
            public getAllPrivateEntity = () => {
                return [...this.getAllPrivateTables(), ...this.getAllPrivateViews()];
            };

            /**
             * Get all private and public entity ( tables + views) together
             */
            public getAllEntity = () => {
                return [...this.getAllOfflineEntity(), ...this.getAllPrivateEntity()];
            };

            /**
             * Will return SQL creation command to create the public tables on the client side
             * This include all the tables and views which is public in nature
             * Since client side do not support the views that's why this will return the tables creation query instead of view creation query
             * Which map the view structure to table structure on the client side
             */
            public allOfflineEntityTableCreationQuery = () => {
                return this.getAllOfflineEntity()
                    .map((offline_entity) => {
                        let creation_command = new offline_entity.entity().generateTableQuery() as string;
                        // add one more column called as synced enum('yes', 'no') default 'no'
                        creation_command = modify_table_creation_query(`, synced enum('yes', 'no') default 'no'`, creation_command);
                        return creation_command;
                    })
                    .join(' ');
            };

            /**
             * Will return all private tables and views creation query
             * Instead of views creation query this will return the tables creation query which is maped version of the views
             * Should not be used on the client side as well as server side because server support view creation query
             **/
            public allPrivateEntityTableCreationQuery = () => {
                return this.getAllPrivateEntity()
                    .map((private_entity) => {
                        const creation_command = new private_entity.entity().generateTableQuery();
                        return creation_command;
                    })
                    .join(' ');
            };

            /**
             * Will return SQL creation query to create private and public tables and views
             * Use this on the server side to create the tables and views
             * Server can hold private and public tables and views
             * Use this on the server side to setup the database's tables and views
             */
            public allEntityCreationQuery = () => {
                return ` ${this.allTableCreationQuery()} ${this.allViewCreationQuery()}`;
            };

            /**
             * Get names of the private and public tables and views
             */
            public getAllTableNames = () => {
                const table_names: string[] = [];

                config.Tables.forEach((entity) => {
                    const table_name = new entity.entity().table_name;
                    table_names.push(table_name);
                });

                config.Views.forEach((entity) => {
                    const table_name = new entity.entity().table_name;
                    table_names.push(table_name);
                });

                return table_names;
            };

            /**
             * Get names of the public tables and views
             */
            public getAllOfflineTableNames = () => {
                return this.getAllOfflineEntity().map((entity) => {
                    return new entity.entity().table_name;
                });
            };

            /**
             * Get fetch condition to use in the SQL command
             * This fetch condition restrict the rows that can be fetched on the client side
             * This help us to reduce the extra or unnecessay data to be stored on the client side
             * This fetch condition apply condition on the row to be used by the client side
             * @param table_name : table name to get the fetch condition from
             */
            public getCacheFetchCondition = (table_name: string) => {
                const found_entity = this.getAllEntity().find((val) => new val.entity().table_name === table_name);
                if (found_entity) {
                    return found_entity.cache_fetch_condition;
                } else {
                    return null;
                }
            };

            /**
             * Will return dao class
             * Note that dao name id unique in the given database
             * @param dao_name: Name of the dao to fetch
             */
            public getDao = (dao_name: string): daoClassType | undefined => {
                const found_dao = (this as any)[dao_name];
                if (found_dao) {
                    return found_dao;
                } else {
                    return undefined;
                }
            };

            /**
             * get the child database of this database which is acting as a parent database
             * Note that child database is always unique in the given database
             * @param database_name : Child database name
             */
            getChildDatabase = (database_name: string): { new (...args: any[]): rootDatabase } | null => {
                let found_child: any = null;
                config.childDatabase.forEach((child) => {
                    if (child.name === database_name) {
                        found_child = child;
                    }
                });

                return found_child ? found_child : null;
            };

            public getUDLogTablesCreationQuery = () => {
                return this.getAllTableNames()
                    .map((table_name) => {
                        return `
                    CREATE TABLE IF NOT EXISTS ${table_name}_UD_LOG 
                    (   
                        row_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                        dao_name TEXT,
                        dao_inputs TEXT,
                        query_type ENUM('UPDATE', 'DELETE'),
                        target_table TEXT, 
                        row_uuid TEXT,
                        date_created DATETIME
                    );
                    `;
                    })
                    .join(' ');
            };
        };
    };
}
