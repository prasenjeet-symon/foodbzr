import { QueryServerDatabase } from '../../dao/online-daos/query_database';
import { dao_execute_type, MYSQLConnectionConfig } from '../../main-interface';
import { InstanceClient } from './instance-client';

export class InstanceClientManager {
    public DB_connection: QueryServerDatabase;
    /**
     * List all connected browser with the same instance_uuid (which represent a single school)
     */
    private clients: Map<string | undefined, InstanceClient> = new Map();

    constructor(mysql_config: MYSQLConnectionConfig, database_name: string) {
        this.DB_connection = new QueryServerDatabase(mysql_config, database_name);
    }

    /**
     * Add new client to the given instance
     * @param client : Client to connect to instance
     */
    addClient = (client: InstanceClient) => {
        this.clients.set(client.client_uuid, client);
        console.log(this.clients.size, 'clients size after addition')
    };

    /**
     * Remove the client of the instance
     * @param client_uuid : Uniue UUID of the connected client on the instance
     */
    public removeClient = (client_uuid: string) => {
        this.clients.delete(client_uuid);
        console.log(this.clients.size, 'clients size after delete')
    };

    /**
     * If there is change in the tables then call this method to notify all the connected browser about this
     *
     *
     * @param table_range : In which tables modifications happens
     */
    public modificationHappen = (table_range: string[]) => {
        this.clients.forEach((client) => {
            client.refetch(table_range);
        });
    };

    /**
     * Instantly run the given dao on the connected browsers
     * @param dao Dao to run on the connected browser
     */
    public executeInstantDao = (dao: dao_execute_type) => {
        this.clients.forEach((client) => {
            client.onlineDaoExecuteInstantDao(dao);
        });
    };
}
