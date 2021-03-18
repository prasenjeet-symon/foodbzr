/**
 * Get the single kitchen info with given row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetKitchen, is_active, IGetKitchenSearchResult, IGetKitchenSearchResultMenu, kitchen_type } from '@foodbzr/shared/types';
import { find_unique_items } from '@foodbzr/shared/util';

export class fetch_kitchen_single extends BaseDao<IGetKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        owner_row_uuid,
        is_active,
        can_edit_partner,
        kitchen_type,

        kitchen_user_id,
        kitchen_password,

        kitchen_name,
        profile_picture,
        bio,

        opening_time,
        closing_time,
        open_week_list,

        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
    
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

        kit.owner_row_uuid as owner_row_uuid,
        kit.is_active as is_active,
        kit.can_edit_partner as can_edit_partner,
        kit.kitchen_type as kitchen_type,
        kit.kitchen_user_id as kitchen_user_id,
        kit.kitchen_password as kitchen_password,
        kit.kitchen_name as kitchen_name,
        kit.profile_picture as profile_picture,
        kit.bio as bio, 
        kit.opening_time as opening_time,
        kit.closing_time as closing_time,
        kit.open_week_list as open_week_list,
        kit.offer_percentage as offer_percentage,
        kit.offer_start_datetime as offer_start_datetime,
        kit.offer_end_datetime as offer_end_datetime,
        kit.date_created as date_created,
        kit.date_updated as date_updated,
        kit.row_uuid as row_uuid

        FROM kitchen as kit
        LEFT OUTER JOIN kitchen_location as kitl
        ON kitl.kitchen_row_uuid = kit.row_uuid

        WHERE kitl.partner_row_uuid = :partner_row_uuid: AND kitl.is_active = :is_active: AND kit.is_active = :is_active:
    ;`)
    fetch(partner_row_uuid: string, is_active: is_active) {
        const unique_kitchens = find_unique_items(this.DBData, 'row_uuid');

        return this.baseFetch(
            unique_kitchens.map((p) => {
                return { ...p, open_week_list: JSON.parse(p.open_week_list as any) as string[] };
            })
        );
    }
}

/** fech the kitchens of owner */
export class fetch_kitchens_of_owner extends BaseDao<IGetKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        owner_row_uuid,
        is_active,
        can_edit_partner,
        kitchen_type,

        kitchen_user_id,
        kitchen_password,

        kitchen_name,
        profile_picture,
        bio,

        opening_time,
        closing_time,
        open_week_list,

        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
    
        date_created,
        date_updated,
        row_uuid

        FROM kitchen
        WHERE owner_row_uuid = :owner_row_uuid: AND is_active = :is_active:
    ;`)
    fetch(owner_row_uuid: string, is_active: is_active) {
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
        owner_row_uuid,
        is_active,
        can_edit_partner,
        kitchen_type,

        kitchen_user_id,
        kitchen_password,

        kitchen_name,
        profile_picture,
        bio,

        opening_time,
        closing_time,
        open_week_list,

        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
    
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
        owner_row_uuid,
        is_active,
        can_edit_partner,
        kitchen_type,

        kitchen_user_id,
        kitchen_password,

        kitchen_name,
        profile_picture,
        bio,

        opening_time,
        closing_time,
        open_week_list,

        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
    
        date_created,
        date_updated,
        row_uuid

        FROM kitchen
    ;`)
    fetch(latitude: number, longitude: number) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, open_week_list: JSON.parse(p.open_week_list as any) as number[] };
            })
        );
    }
}

/** search the kitchens */
export class fetch_kitchen_search extends BaseDao<IGetKitchenSearchResult[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        owner_row_uuid,
        is_active,
        can_edit_partner,
        kitchen_type,

        kitchen_user_id,
        kitchen_password,

        kitchen_name,
        profile_picture,
        bio,

        opening_time,
        closing_time,
        open_week_list,

        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
    
        date_created,
        date_updated,
        row_uuid

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

/**
 * Get the kitchen for the new partner,
 * To select the kitchens from list
 * Already selected one should be rehected
 */

export class fetch_kitchen_for_new_partner extends BaseDao<IGetKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        partner_row_uuid,
        owner_row_uuid,
        is_active,
        kitchen_user_id,
        kitchen_password,
        kitchen_name,
        profile_picture,
        radius,
        ST_X(coordinate) as latitude,
        ST_Y(coordinate) as longitude,
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
        WHERE partner_row_uuid IS NULL
    ;`)
    fetch() {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, open_week_list: JSON.parse(p.open_week_list as any) as string[] };
            })
        );
    }
}

/** get all the ghost brands */
export class fetch_kitchen_ghost_brands extends BaseDao<IGetKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        owner_row_uuid,
        is_active,
        can_edit_partner,
        kitchen_type,

        kitchen_user_id,
        kitchen_password,

        kitchen_name,
        profile_picture,
        bio,

        opening_time,
        closing_time,
        open_week_list,

        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,

        date_created,
        date_updated,
        row_uuid

        FROM kitchen
        WHERE is_active = :is_active: AND kitchen_type = 'ghost_kitchen'
    ;`)
    fetch(is_active: is_active) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, open_week_list: JSON.parse(p.open_week_list as any) };
            })
        );
    }
}
