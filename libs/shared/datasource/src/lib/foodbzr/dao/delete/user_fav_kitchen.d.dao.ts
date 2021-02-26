/** delete the user fav kitchen actual delete */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_user_fav_kitchen extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        DELETE FROM user_fav_kitchen
        WHERE row_uuid = :user_fav_kitchen_row_uuid:
    ;`)
    fetch(user_fav_kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
