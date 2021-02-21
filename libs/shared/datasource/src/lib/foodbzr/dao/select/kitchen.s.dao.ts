/**
 * Get the single kitchen info with given row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetKitchen, is_active, IGetKitchenSearchResult, IGetKitchenSearchResultMenu } from '@foodbzr/shared/types';

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

/** filter the list by POINT(lat, lng) */

/** get the kitchen in range */
export class fetch_kitchen_in_range extends BaseDao<IGetKitchen[]> {
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
    fetch(latitude: number, longitude: number) {
        return this.baseFetch(this.DBData);
    }
}

/** search the kitchens */
export class fetch_kitchen_search extends BaseDao<IGetKitchenSearchResult[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        row_uuid,
        partner_row_uuid,
        kitchen_name,
        profile_picture,
        street,
        pincode,
        city,
        state,
        country

        FROM kitchen 
        WHERE kitchen_name LIKE :search_term: AND is_active = 'yes'
   ;`)
    fetch(search_term: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, address: `${p.street} ${p.city} ${p.pincode} ${p.state} ${p.country}` };
            })
        );
    }
}

/** get all the kitchen with supported menus */
export class fetch_kitchen_supported_menus extends BaseDao<IGetKitchenSearchResultMenu[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        men.menu_name as menu_name,
        kit.partner_row_uuid as partner_row_uuid,
        kit.kitchen_name as kitchen_name,
        kit.profile_picture as profile_picture,
        kit.opening_time as opening_time,
        kit.closing_time as closing_time,
        kit.open_week_list as open_week_list,
        kit.street as street,
        kit.city as city,
        kit.pincode as pincode,
        kit.state as state,
        kit.country as country,
        kit.offer_percentage as offer_percentage,
        kit.offer_start_datetime as offer_start_datetime,
        kit.offer_end_datetime as offer_end_datetime,
        kit.is_active as is_active,
        kit.row_uuid as row_uuid

        FROM kitchen as kit
        LEFT OUTER JOIN menu as men
        ON men.kitchen_row_uuid = kit.row_uuid
        WHERE men.menu_name LIKE :search_term: AND kit.is_active = 'yes'
    ;`)
    fetch(search_term: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, address: `${p.street} ${p.city} ${p.pincode} ${p.state} ${p.country}` };
            })
        );
    }
}
