/**
 * Add new kitchen for the partner
 * partner table is parent of this table
 * This table has a foregin key callled as partner_row_uuid
 */

import { IModificationDaoStatus, kitchen_type } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_kitchen extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO kitchen
        (
            owner_row_uuid,
            kitchen_type,
            kitchen_user_id,
            kitchen_password,
            kitchen_name,
            profile_picture,
            bio,
            opening_time,
            closing_time,
            open_week_list,
            date_created,
            row_uuid
        )
        VALUES
        (
            :owner_row_uuid:,
            :kitchen_type:,
            :kitchen_user_id:,
            :kitchen_password:,
            :kitchen_name:,
            :profile_picture:,
            :bio:,
            :opening_time:,
            :closing_time:,
            :open_week_list:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(
        owner_row_uuid: string,
        kitchen_type: kitchen_type,
        kitchen_user_id: string,
        kitchen_password: string,
        kitchen_name: string,
        profile_picture: string,
        bio: string,
        opening_time: string,
        closing_time: string,
        open_week_list: string,
        date_created: string,
        row_uuid: string
    ) {
        return this.baseFetch(this.DBData);
    }
}
