import { DaoManager } from './dao-manager';
import { dao_status, rootDatabase } from './main_interface';
import * as io from 'socket.io-client';
import { SyncOfflineTables } from './sync-manager';
import { v4 as uuid } from 'uuid';
import { ISQLConnection } from '@sculify/indexed-sql';
import { LiveData } from '@sculify/live-data';
import { IDaoConfig } from '@sculify/node-room';

export const daoConfig: IDaoConfig = {
    runType: 'normal',
    clientQuery: null,
    asyncClientQuery: null,
};

export class ClientDatabase {
    private database_name: string;
    private offline_tables: string[] = [];
    private database: rootDatabase;
    private socket: SocketIOClient.Socket;
    private socket_id: string;

    /**
     *
     * @param database : database class which is inited already
     * @param socket_uri : socket connection url to server , full uri
     * @param root_database_name : root database name , which the unique name of the given database you want to interact with --> main class database name
     * @param instance_uuid : instance uuid , which is created when root database is inited on the server--> represent multiple school
     * @param child_database_param_object : child database param object , if any
     */
    constructor(
        database: { getInstance(): any },
        private socket_uri: string,
        private root_database_name: string,
        private instance_uuid: string,
        private default_dao_running_status: dao_status = 'offline'
    ) {
        this.make_connection(); // make the socket connection

        this.database = database.getInstance(); // get the database instance from the database class
        this.database_name = this.database.db_name;
        this.offline_tables = this.database.getAllOfflineTableNames(); // Get all the offline tables that need to be cached on the client sides

        DaoManager.initInstance(this.database_name, this.offline_tables, this.default_dao_running_status, this.socket);
        daoConfig.runType = 'normal';
        daoConfig.clientQuery = DaoManager.getInstance();
        daoConfig.asyncClientQuery = DaoManager.getInstance();
        this.listen_for_response(); // listen for the socket connection response, once the response is complete then start table sync

        SyncOfflineTables.initInstance(this.database_name, this.socket, this.offline_tables, this.database, this.default_dao_running_status, DaoManager.getInstance().modification_happens);
    }

    public initInstance = async () => {
        await this.create_all_offline_tables();
        this.socket.emit(`${this.root_database_name}`, {
            socket_connection_uuid: this.socket_id,
            instance_uuid: this.instance_uuid,
            child_database_name: this.database_name === this.root_database_name ? null : this.database_name,
            child_database_param_object: this.database.constructor_param_object ? this.database.constructor_param_object : {},
        });
    };

    private make_connection = () => {
        this.socket = io(this.socket_uri);
        this.socket_id = uuid();
    };

    private listen_for_response = () => {
        this.socket.on(`${this.root_database_name}_response`, (data: any) => {
            if (!data.err) {
                if (this.default_dao_running_status === 'offline') {
                    SyncOfflineTables.getInstance()
                        .sync_all_tables()
                        .then(() => console.log('All offline tables is synced.'))
                        .catch((err) => console.error(err));
                }
            } else {
                console.error(data.err);
            }
        });

        this.socket.on('dao_online_result', (data: any) => {
            console.log('\n');
            console.log('online dao call result received --->', data);
            if (data && data.hasOwnProperty('mode')) {
                if (data.mode === 'async') {
                    DaoManager.getInstance().online_async_dao_result_received(data);
                } else {
                    DaoManager.getInstance().online_dao_result_received(data);
                }
            }
        });
    };

    private create_all_offline_tables = async () => {
        if (localStorage.getItem('entity_created') === 'yes') {
            // All table is already created
        } else {
            const connection = new ISQLConnection({
                database_name: this.database_name,
                multi_query: true,
            });
            const creation_query = this.database.allOfflineEntityTableCreationQuery();
            const SQLConnection = await connection.open();
            await SQLConnection.query(creation_query);
            await SQLConnection.query(`
            CREATE TABLE dao_execution_observer (
                row_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                table_name TEXT,
                dao_row_id BIGINT UNSIGNED
            );
            `);
            localStorage.setItem('entity_created', 'yes');
        }
    };
}

/**
 * This class is life time of the dao
 * This class will help us receive the angular lifecycle events like onDestroy ,
 * And correspondingly remove the dao call on that component , and unsubscribe the observables
 */

export class DaoLife {
    private calledDaoList: LiveData<any>[] = [];

    constructor() {}

    public push_live_data(live_data: LiveData<any>) {
        this.calledDaoList.push(live_data);
    }

    public softKill() {
        this.calledDaoList.forEach((live_data) => {
            console.log(live_data.uuid, 'softKill');
            (daoConfig.clientQuery as DaoManager).mark_for_delete(live_data.uuid);
        });
    }
}
