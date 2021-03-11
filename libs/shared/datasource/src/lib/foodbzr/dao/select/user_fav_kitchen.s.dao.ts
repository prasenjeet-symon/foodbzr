/** fetch all the user_fav_kitchen */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetUserFavKitchen } from '@foodbzr/shared/types';

export class fetch_user_fav_kitchen extends BaseDao<IGetUserFavKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        usr_kit.user_row_uuid as user_row_uuid,
        usr_kit.kitchen_row_uuid as kitchen_row_uuid,
        usr_kit.row_uuid as row_uuid,

        kit.profile_picture as profile_picture,
        kit.kitchen_name as kitchen_name,
        kit.partner_row_uuid as partner_row_uuid,
        kit.street as street,
        kit.city as city,
        kit.pincode as pincode,
        kit.state as state,
        kit.country as country,
        ST_X(kit.coordinate) as latitude, 
        ST_Y(kit.coordinate) as longitude
        
        FROM user_fav_kitchen as usr_kit
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = usr_kit.kitchen_row_uuid

        WHERE usr_kit.user_row_uuid = :user_row_uuid:
    ;`)
    fetch(user_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, address: `${p.street}, ${p.city}, ${p.pincode}, ${p.state}, ${p.country}` };
            })
        );
    }
}

/** is this kitchen fav one */
export class fetch_user_fav_kitchen_is_fav extends BaseDao<{ row_uuid: string }[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT row_uuid FROM user_fav_kitchen WHERE kitchen_row_uuid = :kitchen_row_uuid: AND user_row_uuid = :user_row_uuid:
    ;`)
    fetch(kitchen_row_uuid: string, user_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
