import { query_type } from './main-interface';

export const MYSQL_DATATYPE = {
    POINT: (SRID: number = 0) => {
        return `POINT`;
    },

    CHAR: (size: number = 1) => {
        if (size >= 0 && size <= 255 && is_pure_number(size)) {
            return `CHAR(${size})`;
        } else {
            new Error('CHAR DATATYPE size should be [0, 255]');
        }
    },

    VARCHAR: (size: number) => {
        if (size >= 0 && size <= 65535 && is_pure_number(size)) {
            return `VARCHAR(${size})`;
        } else {
            new Error('VARCHAR DATATYPE size should be [0, 65535]');
        }
    },

    TINYTEXT: `TINYTEXT`,

    TEXT: (size?: number) => {
        if (size) {
            if (size >= 0 && size <= 65535 && is_pure_number(size)) {
                return `TEXT(${size})`;
            } else {
                new Error('TEXT DATATYPE size should be [0, 65535]');
            }
        } else {
            return `TEXT`;
        }
    },

    MEDIUMTEXT: `MEDIUMTEXT`,

    LONGTEXT: `LONGTEXT`,

    ENUM: (enum_list: string[]) => {
        if (enum_list.length >= 1 && enum_list.length <= 65535) {
            return `ENUM( ${enum_list.map((p) => `'${p}'`).join(', ')})`;
        } else {
            new Error('ENUM DATATYPE size should be [0, 65535]');
        }
    },

    TINYINT: (signed: boolean = true) => {
        if (signed) {
            return `TINYINT`;
        } else {
            return `TINYINT UNSIGNED`;
        }
    },

    BOOL: `BOOL`,

    BOOLEAN: `BOOLEAN`,

    SMALLINT: (signed: boolean = true) => {
        if (signed) {
            return `SMALLINT`;
        } else {
            return `SMALLINT UNSIGNED`;
        }
    },

    MEDIUMINT: (signed: boolean = true) => {
        if (signed) {
            return `MEDIUMINT`;
        } else {
            return `MEDIUMINT UNSIGNED`;
        }
    },

    INT: (signed: boolean = true) => {
        if (signed) {
            return `INT`;
        } else {
            return `INT UNSIGNED`;
        }
    },

    BIGINT: (signed: boolean = true) => {
        if (signed) {
            return `BIGINT`;
        } else {
            return `BIGINT UNSIGNED`;
        }
    },

    FLOAT: (signed: boolean = true) => {
        if (signed) {
            return `FLOAT`;
        } else {
            return `FLOAT UNSIGNED`;
        }
    },

    DOUBLE: (signed: boolean = true) => {
        if (signed) {
            return `DOUBLE`;
        } else {
            return `DOUBLE UNSIGNED`;
        }
    },

    DATE: 'DATE',
    DATETIME: 'DATETIME',
    TIMESTAMP: 'TIMESTAMP',
    TIME: 'TIME',
    YEAR: 'YEAR',
};

export const is_pure_number = (str: string | number) => {
    if (isNaN(Number(str))) {
        return false;
    } else {
        return true;
    }
};

export const table_config_key = (class_name: string) => {
    return `${class_name.trim()}_table_config`;
};

export const view_config_key = (class_name: string) => {
    return `${class_name.trim()}_view_config`;
};

export const define_property_on_object = (object: Object, property_key: string, value: any) => {
    Object.defineProperty(object, property_key.trim(), {
        value,
        enumerable: true,
        writable: true,
    });
};

export const running_env = () => {
    try {
        if (window && document) {
            return 'web';
        }
    } catch (error) {
        return 'node';
    }
};

export const node_room_config_database = 'node_room_config_database';

export function parse_sql_string(value: any, query_type?: query_type) {
    if (value === null || value === undefined || value === '' || value === 'NULL' || value === 'null') {
        return `NULL`;
    }
    if (!is_pure_number(value)) {
        //pure string

        return `'${value.replace(new RegExp("'", 'ig'), "''")}'`;
    } else {
        return +value;
    }
}

export function instance_manager_table_name(root_database_name: string) {
    return `${root_database_name.toLowerCase().trim()}_instance_manager_table`;
}

export function is_there_space_in_string(str: string) {
    const found_space = str.trim().includes(' ');
    if (found_space) {
        return true;
    } else {
        return false;
    }
}

export function extract_function_param_names(constructor: any) {
    // extract the param names of the constructor
    const function_string = constructor.toString() as string;
    const argument = function_string.substring(function_string.indexOf('(') + 1, function_string.indexOf(')'));
    const params_names = argument.trim().split(',');
    return params_names;
}

export function makeParamObject(param_names: string[], args: any[]) {
    const param_object: any = {};

    param_names.forEach((param_name, index) => {
        param_name = param_name.trim();
        if (args[index]) {
            param_object[param_name] = args[index];
        } else {
            param_object[param_name] = undefined;
        }
    });

    return param_object;
}

export type generalTrimOption = '{' | '[' | '(';

export function remove_char_form_end(start_char: string, end_char: string, arr: string[], cb: (result: string[]) => void) {
    const found_final_index = (start_c: string, end_c: string, str_arr: string[]) => {
        let found_initial_index: number = 0;
        let found_final_indexx = null;

        for (let index = 1; index < str_arr.length; index++) {
            const literal = str_arr[index];
            if (literal === start_c) {
                found_initial_index = found_initial_index + 1;
            }
            if (literal === end_c) {
                if (found_initial_index === 0) {
                    if (index === str_arr.length - 1) {
                        found_final_indexx = index;
                        break;
                    }
                } else {
                    found_initial_index = found_initial_index - 1;
                }
            }
        }

        return found_final_indexx;
    };

    if (arr[0] === start_char) {
        // need to remove this
        const final_index = found_final_index(start_char, end_char, arr);
        // remove the char
        if (final_index !== null) {
            arr.splice(final_index, 1);
            // remove the first char
            arr.splice(0, 1);
            //  call this function again
            remove_char_form_end(start_char, end_char, arr, cb);
        } else {
            cb(arr);
        }
    } else {
        cb(arr);
    }
}

// trim the chracter from the ends of the string
export async function generalTrim(str: string, character: generalTrimOption) {
    const removed_arr = (end_character: string) => {
        return new Promise<string[]>((resolve, reject) => {
            remove_char_form_end(character, end_character, str.trim().split(''), (result) => resolve(result));
        });
    };

    switch (character) {
        case '(':
            // remove all the ()
            return (await removed_arr(')')).join('').trim();

        case '[':
            return (await removed_arr(']')).join('').trim();

        case '{':
            return (await removed_arr('}')).join('').trim();
    }
}

export function is_query_multiple(query: string) {
    const trimed_value = query.trim();
    const splited_value = trimed_value.split(';').filter((p) => p !== '');
    return splited_value.length > 1 ? true : false;
}

export function detect_query_type(query: string) {
    const is_query_multiple_type = is_query_multiple(query);
    if (is_query_multiple_type) {
        // Query is multiple type
        return 'MIXED';
    } else {
        const trimed_value = query.trim();
        const first_element = trimed_value.split(' ')[0].toUpperCase();

        switch (first_element) {
            case 'SELECT':
                return 'SELECT';

            case 'UPDATE':
                return 'UPDATE';

            case 'DELETE':
                return 'DELETE';

            case 'INSERT':
                return 'INSERT';

            case 'CREATE':
                return 'CREATE';
        }
    }
}

export const modify_table_creation_query = (new_column: string, creation_query: string) => {
    const string_literal = make_select_literals(creation_query);
    for (let index = 0; index < string_literal.length; index++) {
        const literal = string_literal[index].toUpperCase();
        if (literal === '(') {
            // find the closing one
            const closing_bracket_index = find_bracket_close_index(string_literal, 'right', index + 1);
            if (closing_bracket_index > -1) {
                // replce the literal with new one
                const new_literals = make_select_literals(new_column);
                string_literal.splice(closing_bracket_index, 0, ...new_literals);
                break;
            } else {
                break;
            }
        }
    }
    return string_literal.join(' ');
};

export function find_bracket_close_index(arr: any[], direction: 'right' | 'left', start_index: number) {
    if (direction === 'right') {
        let found_final_index = -1;
        let found_initial_index = 0;

        for (let index = start_index; index < arr.length; index++) {
            const literal = arr[index];
            if (literal === '(') {
                found_initial_index = found_initial_index + 1;
            } else if (literal === ')') {
                if (found_initial_index === 0) {
                    found_final_index = index;
                    break;
                } else {
                    found_initial_index = found_initial_index - 1;
                }
            }
        }

        return found_final_index;
    } else {
        let found_final_index = -1;
        let found_initial_index = 0;

        for (let index = start_index; index >= 0; index--) {
            const literal = arr[index];
            if (literal === ')') {
                found_initial_index = found_initial_index + 1;
            } else if (literal === '(') {
                if (found_initial_index === 0) {
                    found_final_index = index;
                    break;
                } else {
                    found_initial_index = found_initial_index - 1;
                }
            }
        }

        return found_final_index;
    }
}

export function replace_sql_string_with_marker(str: string) {
    const marker: string[] = [];
    const final_string_arr: string[] = [];

    let copy_initial_index = 0;
    let initial_single_quote_index = -1;
    const splited_string = str.split('');

    for (let i = 0; i < splited_string.length; i++) {
        const char = splited_string[i];
        if (char === "'" && initial_single_quote_index > -1) {
            if (splited_string[i + 1]) {
                const next_char = splited_string[i + 1];
                if (next_char === "'") {
                    // continue
                    i = i + 1;
                    continue;
                } else {
                    // there is a  string
                    const found_string = splited_string.slice(initial_single_quote_index, i + 1).join('');
                    marker.push(found_string);
                    const marker_name = `MS_${marker.length - 1}`;
                    const prev_string = splited_string.slice(copy_initial_index, initial_single_quote_index);
                    final_string_arr.push(...prev_string, ...[' ', marker_name, ' ']);
                    copy_initial_index = i + 1;
                    initial_single_quote_index = -1;
                }
            } else {
                // there is a  string
                const found_string = splited_string.slice(initial_single_quote_index, i + 1).join('');
                marker.push(found_string);
                const marker_name = `MS_${marker.length - 1}`;
                const prev_string = splited_string.slice(copy_initial_index, initial_single_quote_index);
                final_string_arr.push(...prev_string, ...[' ', marker_name, ' ']);
                copy_initial_index = i + 1;
                initial_single_quote_index = -1;
            }
        } else if (char === "'" && initial_single_quote_index === -1) {
            initial_single_quote_index = i;
        } else {
            if (i === splited_string.length - 1) {
                // last index
                // just copy the string to final_string_arr
                final_string_arr.push(...splited_string.slice(copy_initial_index));
            }
        }
    }
    return {
        marker: marker.map((p) => p.replace("''", "'")),
        final_string_arr: final_string_arr,
        final_string: final_string_arr.join('').trim(),
    };
}

export function make_select_literals(select_cmd: string) {
    const marker_data = replace_sql_string_with_marker(select_cmd);

    let normalized_string_arr = marker_data.final_string
        // logical operators
        .replace(/\|/g, ' | ')

        // comparision operators
        .replace(/=/g, ' = ')
        .replace(/</g, ' < ')
        .replace(/>/g, ' > ')
        .replace(/<=/g, ' <= ')
        .replace(/>=/g, ' >= ')
        .replace(/!=/g, ' != ')

        // arithmatics operators
        .replace(/\+/g, ' + ')
        .replace(/\-/g, ' - ')
        .replace(/\*/g, ' * ')
        .replace(/\//g, ' * ')
        .replace(/\%/g, ' * ')

        // bracket ( group maker)
        .replace(/\(/g, ' ( ')
        .replace(/\)/g, ' ) ')

        // bracket BIG ( group maker)
        .replace(/\[/g, ' [ ')
        .replace(/\]/g, ' ] ')

        // ", "
        .replace(/\,/g, ' , ')
        .replace(/\,/g, ' , ')

        // string maker
        .replace(/\'/g, " ' ")
        .replace(/\'/g, " ' ")

        // string maker double quotes
        .replace(/\"/g, ' " ')
        .replace(/\"/g, ' " ')

        .trim()
        .replace(/\s+/g, ' ')
        .split(/\s/g);

    // add the sql string back
    marker_data.marker.forEach((mrk, i) => {
        const marker_string = `MS_${i}`;
        normalized_string_arr = normalized_string_arr.map((p) => (p === marker_string ? mrk : p));
    });

    return normalized_string_arr;
}

// extract the list of tables involved in query
export function extract_list_of_tables_involved_in_select_delete_query(query: string, default_database: string) {
    const query_literals = make_select_literals(query.trim().replace(';', ''));
    let found_tables = [];

    // if we found the from then after the from there is database.table_name info
    for (let index = 0; index < query_literals.length; index++) {
        const literal = query_literals[index].toUpperCase();
        if (literal === 'FROM') {
            if (query_literals[index + 1]) {
                found_tables.push(query_literals[index + 1]);
            } else {
                throw new Error('missing table name');
            }
        }
    }

    if (found_tables.length !== 0) {
        const data_to_return: { database_name: string; table_name: string }[] = [];

        found_tables.forEach(function (val) {
            const splited_value = val.trim().split('.');

            if (splited_value.length === 2) {
                // there is database name
                const database_name = splited_value[0];
                const table_name = splited_value[1];

                data_to_return.push({ database_name, table_name });
            } else if (splited_value.length === 1) {
                // no database info
                const database_name = default_database;
                const table_name = splited_value[0];
                data_to_return.push({ database_name, table_name });
            }
        });

        if (data_to_return.length !== 0) {
            return data_to_return;
        } else {
            return undefined;
        }
    } else {
        throw new Error('missing table name');
    }
}

export function extract_list_of_tables_involved_in_update_query(query: string, default_database: string) {
    const query_literals = make_select_literals(query.trim().replace(';', ''));
    let found_table_info;

    // after update keyword there is table info
    for (let index = 0; index < query_literals.length; index++) {
        const literal = query_literals[index].toUpperCase();
        if (literal === 'UPDATE') {
            if (query_literals[index + 1]) {
                found_table_info = query_literals[index + 1];
            } else {
                throw new Error('missing table name');
            }
        }
    }

    if (found_table_info) {
        const splited_value = found_table_info.trim().split('.');

        if (splited_value.length === 2) {
            // there is dataabse info
            const database_name = splited_value[0];
            const table_name = splited_value[1];

            return [{ database_name, table_name }];
        } else if (splited_value.length === 1) {
            // there is no database name
            const database_name = default_database;
            const table_name = splited_value[0];

            return [{ database_name, table_name }];
        } else {
            return undefined;
        }
    } else {
        throw new Error('missing table name');
    }
}

export function extract_list_of_tables_involved_in_insert_query(query: string, default_database: string) {
    // after INTO keyword there is table info
    const query_literals = make_select_literals(query.trim().replace(';', ''));
    let found_table_info;

    for (let index = 0; index < query_literals.length; index++) {
        const literal = query_literals[index].toUpperCase();
        if (literal === 'INTO') {
            // after this index there is table info
            if (query_literals[index + 1]) {
                found_table_info = query_literals[index + 1];
            } else {
                throw new Error('missing table name');
            }
        }
    }

    if (found_table_info) {
        const splited_value = found_table_info.trim().split('.');
        if (splited_value.length === 2) {
            // there is database info
            const database_name = splited_value[0];
            const table_name = splited_value[1];
            return [{ database_name, table_name }];
        } else if (splited_value.length === 1) {
            const database_name = default_database;
            const table_name = splited_value[0];
            return [{ database_name, table_name }];
        } else {
            return undefined;
        }
    } else {
        throw new Error('missing table name');
    }
}

export function extract_list_of_tables_involved_in_mixed_type(query: string, default_database: string) {
    const statement_to_neglect = ['START TRANSACTION', 'COMMIT', 'ROLLBACK'];
    const all_table_list: string[] = [];
    const trimed_value = query.trim();
    const all_query = trimed_value
        .split(';')
        .filter((p) => p !== '')
        .map((p) => make_select_literals(p.trim()).join(' '))
        .filter((p) => !statement_to_neglect.includes(p.toUpperCase()))
        .forEach((p) => {
            // find the query type
            const query_type = detect_query_type(p);
            const found_tables = extract_table_list_from_query(p, 'test_database', query_type as string)?.map((p) => p.table_name);
            if (found_tables) {
                all_table_list.push(...found_tables);
            }
        });

    return all_table_list;
}

export function extract_table_list_from_query(query: string, default_database: string, query_type: string) {
    switch (query_type) {
        case 'SELECT':
            return extract_list_of_tables_involved_in_select_delete_query(query, default_database);

        case 'INSERT':
            return extract_list_of_tables_involved_in_insert_query(query, default_database);

        case 'DELETE':
            return extract_list_of_tables_involved_in_select_delete_query(query, default_database);

        case 'UPDATE':
            return extract_list_of_tables_involved_in_update_query(query, default_database);
    }
}

export function is_two_array_intersect(arr_left: (string | number)[], arr_right: (string | number)[]) {
    let is_intersected = false;
    for (let index = 0; index < arr_left.length; index++) {
        if (arr_right.includes(arr_left[index])) {
            is_intersected = true;
            break;
        }
    }
    return is_intersected;
}

export function is_left_array_subset_of_right_arr(left_arr: string[], right_arr: string[]) {
    let is_subset = false;
    for (let index = 0; index < left_arr.length; index++) {
        const is_left_item_in_right = right_arr.includes(left_arr[index]);
        if (is_left_item_in_right) {
            is_subset = true;
            continue;
        } else {
            is_subset = false;
            break;
        }
    }

    return is_subset;
}

const convert_object_key_val_to_cell_array = (obj_key_val: any) => {
    return Object.keys(obj_key_val).map((key) => {
        const cell_object: any = {};
        cell_object[key] = obj_key_val[key];
        return cell_object;
    });
};

export function combine_the_cell_to_key_val_object(cell: any[]) {
    // cell = [ { name: 'Harry' }, { age: 12 }] , example
    // convert this to { name: 'Harry', age: 12 }
    const final_object: any = {};
    cell.forEach((p) => {
        const key = Object.keys(p)[0];
        final_object[key] = p[key];
    });

    return Object.keys(final_object).length === 0 ? null : final_object;
}

export function find_intersection_of_cells(old_cell: any[], new_cell: any[], old_row_date: string, new_row_date: string) {
    const intersection_data: { old_cell: any; new_cell: any }[] = [];
    const new_cells_unmatched: any[] = [];

    new_cell.forEach((new_cell_item) => {
        const new_cell_column_name = Object.keys(new_cell_item)[0];

        const found_same_column_name_in_old_cell = old_cell.findIndex((old_cell_item) => old_cell_item.hasOwnProperty(new_cell_column_name));
        if (found_same_column_name_in_old_cell > -1) {
            intersection_data.push({
                old_cell: old_cell[found_same_column_name_in_old_cell],
                new_cell: new_cell_item,
            });
            // delete the old cell
            old_cell.splice(found_same_column_name_in_old_cell, 1);
        } else {
            new_cells_unmatched.push(new_cell_item);
        }
    });

    return {
        old_cell_unmatched: old_cell,
        new_cell_unmatched: new_cells_unmatched,
        intersection: intersection_data.map((p) => {
            const old_time_stamp = +new Date(old_row_date);
            const new_time_stamp = +new Date(new_row_date);
            if (new_time_stamp > old_time_stamp) {
                // old should be deleted
                return p.new_cell;
            } else {
                return p.old_cell;
            }
        }),
        delete_old_row: +new Date(new_row_date) > +new Date(old_row_date) ? true : false,
    };
}

export interface update_row_structure {
    updated_to: any;
    main_row_uuid: string;
    row_uuid: string;
    date_created: string;
}

export function make_update_string(server_side_update_list: update_row_structure[], local_side_update_list: update_row_structure[]) {
    let final_data: update_row_structure[] = [];

    const make_update = (cb: () => void) => {
        if (local_side_update_list.length === 0) {
            cb();
        } else {
            if (final_data.length !== 0) {
                server_side_update_list = final_data;
                final_data = [];
            }
            const local_row = local_side_update_list[0];
            server_side_update_list.forEach((server_side_row) => {
                if (server_side_row.main_row_uuid === local_row.main_row_uuid) {
                    const server_side_row_cells = convert_object_key_val_to_cell_array(JSON.parse(server_side_row.updated_to));
                    const local_side_row_cells = convert_object_key_val_to_cell_array(JSON.parse(local_row.updated_to));
                    const server_side_row_datetime = server_side_row.date_created;
                    const local_side_row_datetime = local_row.date_created;
                    const result = find_intersection_of_cells(server_side_row_cells, local_side_row_cells, server_side_row_datetime, local_side_row_datetime);
                    const intersection = result.intersection;
                    if (result.delete_old_row) {
                        // old row loose
                        final_data.push({
                            updated_to: combine_the_cell_to_key_val_object(result.old_cell_unmatched),
                            date_created: server_side_row.date_created,
                            main_row_uuid: server_side_row.main_row_uuid,
                            row_uuid: server_side_row.row_uuid,
                        });
                        final_data.push({
                            updated_to: combine_the_cell_to_key_val_object([...result.new_cell_unmatched, ...result.intersection]),
                            date_created: local_row.date_created,
                            main_row_uuid: local_row.main_row_uuid,
                            row_uuid: local_row.row_uuid,
                        });
                    } else {
                        // old row win
                        final_data.push({
                            updated_to: combine_the_cell_to_key_val_object([...result.old_cell_unmatched, ...result.intersection]),
                            date_created: server_side_row.date_created,
                            main_row_uuid: server_side_row.main_row_uuid,
                            row_uuid: server_side_row.row_uuid,
                        });
                        final_data.push({
                            updated_to: combine_the_cell_to_key_val_object(result.new_cell_unmatched),
                            date_created: local_row.date_created,
                            main_row_uuid: local_row.main_row_uuid,
                            row_uuid: local_row.row_uuid,
                        });
                    }
                } else {
                    final_data.push(server_side_row);
                }
            });
            local_side_update_list.shift();
            make_update(cb);
        }
    };

    return new Promise<update_row_structure[]>((resolve, reject) => {
        make_update(() =>
            resolve(
                final_data
                    .filter((p) => p.updated_to !== null)
                    .map((p) => {
                        return { ...p, updated_to: JSON.stringify(p.updated_to) };
                    })
            )
        );
    });
}
