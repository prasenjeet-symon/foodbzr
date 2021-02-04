import { view_config } from '../main-interface';
import { is_there_space_in_string } from '../utils';

export function View(config: view_config) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T): T {
    // check if the view name is correct or not
    // view name should not contain space
    if (is_there_space_in_string(config.view_name)) {
      throw new Error("view name can't contain space");
    }

    // generate the view creation SQL query
    const view_creation_query = ` CREATE VIEW ${config.view_name} AS ${config.query} ;`;

    return class extends constructor {
      public view_name: string = config.view_name;
      private viewCreationQuery: string = view_creation_query;

      generateViewQuery = () => {
        return this.viewCreationQuery;
      };
    };
  };
}
