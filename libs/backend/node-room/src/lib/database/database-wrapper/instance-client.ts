import { v4 as uuid } from 'uuid';
import { ExecuteDaoOnline } from '../../dao/online-daos/execute_dao_online';
import { dao_execute_type } from '../../main-interface';
import { OfflineSync } from '../sync/sync';

export class InstanceClient {
    public client_uuid: string;
    private sync: OfflineSync;
    private onlineDao: ExecuteDaoOnline;

    constructor(private socket: any, private removeMe: (client_uuid: string) => void, private modification_happen: (table_range: string[]) => void) {
        this.client_uuid = uuid();
        this.socket.on('disconnect', () => {
            console.log(`client connection disconnected with id - ${this.socket.id}`);
            this.onlineDao.kill_all_live_data();
            this.onlineDao.disconnect_mysql_connection();
            this.removeMe(this.client_uuid);
        });
    }

    public onlineDaoModification = (table_range: string[]) => {
        // Use this in the sync if you want
        this.modification_happen(table_range);
    };

    public add_client_area = (sync: OfflineSync, onlineDao: ExecuteDaoOnline) => {
        if (sync && onlineDao) {
            this.sync = sync;
            this.onlineDao = onlineDao;
        }
    };

    // Manager will call this if there is modification in the instance database
    public refetch = (included_table_names: string[]) => {
        // choose which element to fetch the data
        this.onlineDao.refetch(included_table_names);
    };

    /**Execute the dao instantly on the connected browser.*/
    public onlineDaoExecuteInstantDao = (dao: dao_execute_type) => {
        this.socket.emit('execute_dao_now', dao);
    };
}
