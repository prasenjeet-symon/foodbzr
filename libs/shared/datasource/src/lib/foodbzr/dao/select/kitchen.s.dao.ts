/**
 * Get the single kitchen info with given row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetKitchen, is_active } from '@foodbzr/shared/types';

export class fetch_kitchen_single extends BaseDao<IGetKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        partner_row_uuid,
        is_active,
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
        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
        street,
        pincode,
        city,
        state,
        country,
        date_created,
        date_updated,
        row_uuid

        FROM kitchen
        WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, open_week_list: JSON.parse(p.open_week_list as any) as string[] };
            })
        );
    }
}

/**
 * Get all the kitchens of partners with given partner row_uuid
 */

export class fetch_kitchens_of_partner extends BaseDao<IGetKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        partner_row_uuid,
        is_active,
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
        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
        street,
        pincode,
        city,
        state,
        country,
        date_created,
        date_updated,
        row_uuid

        FROM kitchen
        WHERE partner_row_uuid = :partner_row_uuid: AND is_active = :is_active:
    ;`)
    fetch(partner_row_uuid: string, is_active: is_active) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, open_week_list: JSON.parse(p.open_week_list as any) as string[] };
            })
        );
    }
}

/**
 * Retrive the kitchen password
 */

export class fetch_kitchen_password extends BaseDao<{ kitchen_password: string }[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT kitchen_password FROM kitchen WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Fetch all the kitchens of the every owners
 */

export class fetch_kitchen_all extends BaseDao<IGetKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        partner_row_uuid,
        is_active,
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
        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
        street,
        pincode,
        city,
        state,
        country,
        date_created,
        date_updated,
        row_uuid

        FROM kitchen
    ;`)
    fetch() {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, open_week_list: JSON.parse(p.open_week_list as any) as number[] };
            })
        );
    }
}
