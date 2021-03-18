/** add new  user_fav_kitchen */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_user_fav_kitchen extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO user_fav_kitchen
        (
            user_row_uuid,
            kitchen_location_row_uuid,
            date_created,
            row_uuid
        )
        VALUES
        (
            :user_row_uuid:,
            :kitchen_location_row_uuid:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(user_row_uuid: string, kitchen_location_row_uuid: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
