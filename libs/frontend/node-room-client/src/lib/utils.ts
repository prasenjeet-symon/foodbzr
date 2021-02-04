import { generalTrimOption, update_table_data_local } from './main_interface';

export function remove_char_form_end(
  start_char: string,
  end_char: string,
  arr: string[],
  cb: (result: string[]) => void
) {
  const found_final_index = (
    start_c: string,
    end_c: string,
    str_arr: string[]
  ) => {
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
      remove_char_form_end(
        character,
        end_character,
        str.trim().split(''),
        (result) => resolve(result)
      );
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

export async function detect_query_type(query: string) {
  const trimed_value = await generalTrim(query.trim(), '(');
  const first_element = trimed_value.trim().split(' ')[0].toUpperCase();

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

export function make_select_literals(select_cmd: string) {
  return (
    select_cmd
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
      .split(/\s/g)
  );
}

// extract the list of tables involved in query
export function extract_list_of_tables_involved_in_select_delete_query(
  query: string,
  default_database: string
) {
  const query_literals = make_select_literals(query);
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

export function extract_list_of_tables_involved_in_update_query(
  query: string,
  default_database: string
) {
  const query_literals = make_select_literals(query);
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

export function extract_list_of_tables_involved_in_insert_query(
  query: string,
  default_database: string
) {
  // after INTO keyword there is table info
  const query_literals = make_select_literals(query);
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

export function extract_table_list_from_query(
  query: string,
  default_database: string,
  query_type: string
) {
  switch (query_type) {
    case 'SELECT':
      return extract_list_of_tables_involved_in_select_delete_query(
        query,
        default_database
      );

    case 'INSERT':
      return extract_list_of_tables_involved_in_insert_query(
        query,
        default_database
      );

    case 'DELETE':
      return extract_list_of_tables_involved_in_select_delete_query(
        query,
        default_database
      );

    case 'UPDATE':
      return extract_list_of_tables_involved_in_update_query(
        query,
        default_database
      );
  }
}

export function is_two_array_intersect(
  arr_left: (string | number)[],
  arr_right: (string | number)[]
) {
  let is_intersected = false;
  for (let index = 0; index < arr_left.length; index++) {
    if (arr_right.includes(arr_left[index])) {
      is_intersected = true;
      break;
    }
  }
  return is_intersected;
}

export function is_left_array_subset_of_right_arr(
  left_arr: string[],
  right_arr: string[]
) {
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

// manage the update part sync manager

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

export function find_intersection_of_cells(
  old_cell: any[],
  new_cell: any[],
  old_row_date: string,
  new_row_date: string
) {
  const intersection_data: { old_cell: any; new_cell: any }[] = [];
  const new_cells_unmatched: any[] = [];

  new_cell.forEach((new_cell_item) => {
    const new_cell_column_name = Object.keys(new_cell_item)[0];

    const found_same_column_name_in_old_cell = old_cell.findIndex(
      (old_cell_item) => old_cell_item.hasOwnProperty(new_cell_column_name)
    );
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
      if (new_time_stamp >= old_time_stamp) {
        // old should be deleted
        return p.new_cell;
      } else {
        return p.old_cell;
      }
    }),
    delete_old_row:
      +new Date(new_row_date) >= +new Date(old_row_date) ? true : false,
  };
}

export function make_update_string(
  server_side_update_list: update_table_data_local[],
  local_side_update_list: update_table_data_local[]
) {
  let final_data: update_table_data_local[] = [];

  const make_update = (cb: () => void) => {
    if (server_side_update_list.length === 0) {
      cb();
    } else {
      if (final_data.length !== 0) {
        local_side_update_list = final_data;
        final_data = [];
      }
      const server_row = server_side_update_list[0];

      let is_no_row_matched = true;
      local_side_update_list.forEach((local_side_row) => {
        if (local_side_row.main_row_uuid === server_row.main_row_uuid) {
          is_no_row_matched = false;
          // row matched
          const server_side_row_cells = convert_object_key_val_to_cell_array(
            JSON.parse(server_row.updated_to)
          );
          const local_side_row_cells = convert_object_key_val_to_cell_array(
            JSON.parse(local_side_row.updated_to)
          );

          const server_side_row_datetime = server_row.date_created;
          const local_side_row_datetime = local_side_row.date_created;

          const result = find_intersection_of_cells(
            local_side_row_cells,
            server_side_row_cells,
            local_side_row_datetime,
            server_side_row_datetime
          );

          if (result.delete_old_row) {
            // old row looses new row win
            final_data.push({
              updated_to: combine_the_cell_to_key_val_object(
                result.old_cell_unmatched
              ),
              date_created: local_side_row.date_created,
              main_row_uuid: local_side_row.main_row_uuid,
              row_uuid: local_side_row.row_uuid,
              synced: local_side_row.synced,
              row_id: local_side_row.row_id,
            });
            final_data.push({
              updated_to: combine_the_cell_to_key_val_object([
                ...result.new_cell_unmatched,
                ...result.intersection,
              ]),
              date_created: server_row.date_created,
              main_row_uuid: server_row.main_row_uuid,
              row_uuid: server_row.row_uuid,
              synced: server_row.synced,
              row_id: server_row.row_id,
            });
          } else {
            // old row win new one losses
            final_data.push({
              updated_to: combine_the_cell_to_key_val_object([
                ...result.old_cell_unmatched,
                ...result.intersection,
              ]),
              date_created: local_side_row.date_created,
              main_row_uuid: local_side_row.main_row_uuid,
              row_uuid: local_side_row.row_uuid,
              synced: local_side_row.synced,
              row_id: local_side_row.row_id,
            });
            final_data.push({
              updated_to: combine_the_cell_to_key_val_object([
                ...result.new_cell_unmatched,
              ]),
              date_created: server_row.date_created,
              main_row_uuid: server_row.main_row_uuid,
              row_uuid: server_row.row_uuid,
              synced: server_row.synced,
              row_id: server_row.row_id,
            });
          }
        } else {
          final_data.push(local_side_row);
        }
      });
      if (is_no_row_matched) {
        // no row matched to given upper server row
        final_data.push({
          ...server_row,
          updated_to: JSON.parse(server_row.updated_to),
        });
      }
      local_side_update_list.shift();
      make_update(cb);
    }
  };

  return new Promise<update_table_data_local[]>((resolve, reject) => {
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

export function convert_sql_string_to_string(sql_str: string) {
  return sql_str.slice(1, sql_str.length - 1);
}

export function is_pure_sql_string(str: string) {
  str = str.trim();
  if (str.slice(0, 1) === "'" && str.slice(str.length - 1) === "'") {
    return true;
  } else {
    return false;
  }
}
export function is_number(str: string) {
  return !isNaN(Number(str));
}

export function convert_sql_object_to_normal(obj: any) {
  const new_object: any = {};
  Object.keys(obj).forEach((k) => {
    if (is_number(obj[k])) {
      new_object[k] = obj[k];
    } else if (is_pure_sql_string(obj[k])) {
      // yes pure sql string
      // convert to normal string
      new_object[k] = convert_sql_string_to_string(obj[k]);
    } else {
      new_object[k] = obj[k] === 'NULL' ? null : obj[k];
    }
  });
  return new_object;
}

export const convert_to_sql_insertable_object = (data: any) => {
  const final_object: any = {};
  Object.keys(data).forEach((k: any) => {
    const value = data[k];
    // check if the value is pure sql string
    // if pure sql string then it is ok
    // if not then convert to pure sql sttring
    if (typeof value === 'string' && !is_pure_sql_string(value)) {
      final_object[k] = `'${value}'`;
    } else {
      final_object[k] = value;
    }
  });
  return final_object;
};
