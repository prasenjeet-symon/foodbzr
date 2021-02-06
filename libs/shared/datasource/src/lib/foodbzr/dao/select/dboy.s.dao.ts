/**
 * Get single d_boy info
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetDBoy } from '@foodbzr/shared/types';

export class fetch_dboy_single extends BaseDao<IGetDBoy[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        kitchen_row_uuid,
        full_name,
        mobile_number,
        profile_picture,
        gender,
        is_active,
        is_mobile_verified,
        last_otp,
        birth_date,
        is_verified,
        date_created,
        date_updated,
        row_uuid

        FROM dboy
        WHERE row_uuid = :dboy_row_uuid:
    ;`)
    fetch(dboy_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 *  Get all the dboy of the kitchen with given kitchen_row_uuid
 */

export class fetch_dboy_of_kitchen extends BaseDao<IGetDBoy[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        kitchen_row_uuid,
        full_name,
        mobile_number,
        profile_picture,
        gender,
        is_active,
        is_mobile_verified,
        last_otp,
        birth_date,
        is_verified,
        date_created,
        date_updated,
        row_uuid

        FROM dboy
        WHERE kitchen_row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
