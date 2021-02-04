import { column_config, TableConfig } from '../main-interface';
import { define_property_on_object, table_config_key } from '../utils';

export function Column(config: column_config) {
  return function (target: Object, propertyKey: string | symbol): void {
    //check if the columnName is provided or not
    // if not provided then assign the propertyKey to columnName in the config object
    config.columnName = config.columnName
      ? config.columnName
      : (propertyKey as string);
    // check if the columnName and dataType is provided or not
    // because both these property of the config object is required property
    if (!(config.columnName && config.dataType)) {
      throw `columnName && dataType is required value in the config property of the Column decorator`;
    }

    const class_name = target.constructor.name.trim();
    const class_prototype = target.constructor.prototype;
    const table_name = class_name;
    const TABLE_CONFIG_KEY = table_config_key(class_name);

    // find if the table config already exit
    let prev_table_config = class_prototype[TABLE_CONFIG_KEY] as TableConfig;

    if (prev_table_config) {
      // there is prev table config
      prev_table_config.ColumnInfo = [
        ...prev_table_config.ColumnInfo,
        {
          columnName: config.columnName,
          dataType: config.dataType,
          isNotNull: config.isNotNull ? config.isNotNull : false,
          defaultValue: config.defaultValue,
        },
      ];
      define_property_on_object(
        class_prototype,
        TABLE_CONFIG_KEY,
        prev_table_config
      );
    } else {
      prev_table_config = {
        tableName: table_name,
        primaryKey: '',
        ColumnInfo: [
          {
            columnName: config.columnName,
            dataType: config.dataType,
            isNotNull: config.isNotNull ? config.isNotNull : false,
            defaultValue: config.defaultValue,
          },
        ],
      };

      define_property_on_object(
        class_prototype,
        TABLE_CONFIG_KEY,
        prev_table_config
      );
    }
  };
}
