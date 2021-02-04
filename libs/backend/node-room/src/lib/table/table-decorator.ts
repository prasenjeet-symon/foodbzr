import { TableConfig, table_config } from '../main-interface';
import {
  define_property_on_object,
  parse_sql_string,
  table_config_key,
} from '../utils';

export function Table(config: table_config) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T): T {
    // check if the table name is provided or not
    // if not provided then fallback to class name
    config.tableName = config.tableName
      ? config.tableName
      : constructor.name.trim();
    // check if the primary key and table name is provided or not
    // both these property of the config are required properties
    if (!(config.tableName && config.primaryKey)) {
      throw `tableName and primaryKey are required properties in the Table class `;
    }

    const class_name = constructor.name.trim();
    const class_prototype = constructor.prototype;
    const TABLE_CONFIG_KEY = table_config_key(class_name);

    // find the previous table config if exit
    let prev_table_config = class_prototype[TABLE_CONFIG_KEY] as TableConfig;
    if (prev_table_config) {
      // there is prev table config
      prev_table_config.tableName = config.tableName;
      prev_table_config.primaryKey = config.primaryKey;
      define_property_on_object(
        class_prototype,
        TABLE_CONFIG_KEY,
        prev_table_config
      );
    } else {
      prev_table_config = {
        tableName: config.tableName,
        primaryKey: config.primaryKey,
        ColumnInfo: [],
      };
      define_property_on_object(
        class_prototype,
        TABLE_CONFIG_KEY,
        prev_table_config
      );
    }

    // add query string to property called SQLCreationQuery
    const columns = prev_table_config.ColumnInfo.map((column, i) => {
      if (column.columnName === prev_table_config.primaryKey) {
        return ` ${column.columnName} ${column.dataType} PRIMARY KEY AUTO_INCREMENT`;
      } else {
        return ` ${column.columnName} ${column.dataType} ${
          column.isNotNull ? `NOT NULL` : ``
        } ${
          column.defaultValue
            ? 'DEFAULT ' + parse_sql_string(column.defaultValue)
            : ``
        }`;
      }
    });

    const columns_string = columns.join(', ');
    //TODO: create the table if not exit
    const SQLCreateStatement = ` CREATE TABLE ${prev_table_config.tableName} ( ${columns_string} );`;
    return class extends constructor {
      public table_name: string = prev_table_config.tableName;
      private tableCreationQuery: string = SQLCreateStatement;
      private is_private: boolean = config.isSensitive ? true : false;

      public generateTableQuery = () => {
        return this.tableCreationQuery;
      };

      public is_private_table = () => {
        return this.is_private;
      };
    };
  };
}
