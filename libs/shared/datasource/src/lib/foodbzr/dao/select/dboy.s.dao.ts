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

        kit.kitchen_name as kitchen_name,
        pat.full_name as partner_full_name,
        pat.row_uuid as partner_row_uuid,
        kit.row_uuid as kitchen_row_uuid,

        dboy.full_name as full_name,
        dboy.mobile_number as mobile_number,
        dboy.profile_picture as profile_picture,
        dboy.gender as gender,
        dboy.is_active as is_active,
        dboy.is_mobile_verified as is_mobile_verified,
        dboy.last_otp as last_otp,
        dboy.birth_date as birth_date,
        dboy.is_verified as is_verified,
        dboy.date_created as date_created,
        dboy.date_updated as date_updated,
        dboy.row_uuid as row_uuid

        FROM dboy as dboy
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = dboy.kitchen_row_uuid
        LEFT OUTER JOIN partner as pat
        ON pat.row_uuid = kit.partner_row_uuid

        WHERE dboy.row_uuid = :dboy_row_uuid:
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
