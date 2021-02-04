import { detect_query_type, extract_function_param_names, extract_list_of_tables_involved_in_mixed_type, extract_table_list_from_query } from '../utils';

export function Query(query: string, force_online: boolean = false) {
    return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        /** If the query param is empty or null then throw the Error  and stop execution */
        if (!query) {
            throw new Error('query param is required in the Query decorator.');
        }

        /**
         * Replace the new line with single space in the incoming SQL query
         */
        query = query.replace(new RegExp('\\n', 'ig'), ' ');

        /** Extract the "fetch" function param names */
        const param_names = extract_function_param_names(descriptor.value);
        /** Detect the incoming query type - 'SELECT' | 'DELETE' | 'UPDATE' | 'INSERT' */
        const query_type = detect_query_type(query.trim());

        /** If there is no detected query type then possibly query is invalid , just throw the new Error  */
        if (!query_type) {
            throw new Error('Query type is needed in the Query decorator.');
        }

        /**
         * Extract the list of tables involved in the query
         */
        let table_names: string[] = [];
        if (query_type === 'MIXED') {
            /** If the query type is mixed ( there is more than one SQL statement  ) then force this dao to run on the server */
            force_online = true;
            const found_tables = extract_list_of_tables_involved_in_mixed_type(query, 'test_database');
            table_names = found_tables ? found_tables : [];
        } else {
            const table_involved = extract_table_list_from_query(query, 'test_database', query_type as string);
            table_names = table_involved ? table_involved.map((p) => p.table_name) : [];
        }

        const original_function = descriptor.value;

        /** Extend the "fetch" function with new body */
        descriptor.value = function (...args: any[]) {
            /**
             * Extract the param value and associate it with proper param name
             * To construct the param object - { 'param_name' :'param_value'}
             */
            const param_object: any = {};
            param_names.forEach((param_name, index) => {
                param_name = param_name.trim();
                if (args[index]) {
                    param_object[param_name] = args[index];
                } else {
                    param_object[param_name] = undefined;
                }
            });

            /** containing_class is the original class in the "fetch" function is */
            const containing_class = this as any;

            /**
             * Create new promise to return in the "fetch" function
             * Once the result is avail then resolve this promise in the class
             */

            const running_env_config = function (fetch_ref: any) {
                return {
                    asyncData: async function (parent_ref?: any) {
                        const DB_data = await containing_class.async_query(
                            param_object,
                            query,
                            target.constructor.name.trim(),
                            force_online,
                            table_names,
                            query_type,
                            fetch_ref,
                            original_function,
                            args
                        );
                        return DB_data;
                    },
                    obsData: function () {
                        containing_class.obs_query(param_object, query, target.constructor.name.trim(), force_online, table_names, query_type, fetch_ref, original_function, args);
                    },
                };
            };

            return running_env_config(this);
        };

        return descriptor;
    };
}
