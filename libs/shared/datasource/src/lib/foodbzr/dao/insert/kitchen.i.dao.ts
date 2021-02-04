/**
 * Add new kitchen for the partner
 * partner table is parent of this table
 * This table has a foregin key callled as partner_row_uuid
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_kitchen extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO kitchen
        (
            partner_row_uuid,
            kitchen_user_id,
            kitchen_password,
            kitchen_name,
            profile_picture,
            radius,
            latitude,
            longitude,
            opening_time,
            closing_time,
            open_week_list,
            street,
            pincode,
            city,
            state,
            country,
            date_created,
            row_uuid
        )
        VALUES
        (
            :partner_row_uuid:,
            :kitchen_user_id:,
            :kitchen_password:,
            :kitchen_name:,
            :profile_picture:,
            :radius:,
            :latitude:,
            :longitude:,
            :opening_time:,
            :closing_time:,
            :open_week_list:,
            :street:,
            :pincode:,
            :city:,
            :state:,
            :country:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(
        partner_row_uuid: string,
        kitchen_user_id: string,
        kitchen_password: string,
        kitchen_name: string,
        profile_picture: string,
        radius: number,
        latitude: number,
        longitude: number,
        opening_time: string,
        closing_time: string,
        open_week_list: string,
        street: string,
        pincode: string,
        city: string,
        state: string,
        country: string,
        date_created: string,
        row_uui: string
    ) {
        return this.baseFetch(this.DBData);
    }
}
