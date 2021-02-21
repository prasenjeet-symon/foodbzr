/**
 * Get the single menu with menu_row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetMenu, IGetMenuForCart, IGetMenuSearchResult, IGetMenuTrending } from '@foodbzr/shared/types';
import { find_unique_items, can_apply_offer } from '@foodbzr/shared/util';
import * as moment from 'moment';

export class fetch_menu_single extends BaseDao<IGetMenu[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        men.menu_name as menu_name,
        men.is_active as is_active,
        men.profile_picture as profile_picture,
        men.bio as bio,
        men.kitchen_row_uuid as kitchen_row_uuid,
        men.regional_food_category_row_uuid as regional_food_category_row_uuid,
        rfc.name as regional_food_category_name,
        men.food_category_row_uuid as food_category_row_uuid,
        fc.name as food_category_name,
        men.offer_percentage as offer_percentage,
        men.offer_start_datetime as offer_start_datetime,
        men.offer_end_datetime as offer_end_datetime,
        men.date_created as date_created, 
        men.date_updated as date_updated,
        men.row_uuid as row_uuid

        FROM menu as men
        LEFT OUTER JOIN regional_food_category as rfc
        ON rfc.row_uuid = men.regional_food_category_row_uuid
        LEFT OUTER JOIN food_category as fc
        ON fc.row_uuid = men.food_category_row_uuid

        WHERE men.row_uuid = :menu_row_uuid:
    ;`)
    fetch(menu_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Get all the menu of the kitchen
 */

export class fetch_menus_of_kitchen extends BaseDao<IGetMenu[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        men.menu_name as menu_name,
        men.is_active as is_active,
        men.profile_picture as profile_picture,
        men.bio as bio,
        men.kitchen_row_uuid as kitchen_row_uuid,
        men.regional_food_category_row_uuid as regional_food_category_row_uuid,
        rfc.name as regional_food_category_name,
        men.food_category_row_uuid as food_category_row_uuid,
        fc.name as food_category_name,
        men.offer_percentage as offer_percentage,
        men.offer_start_datetime as offer_start_datetime,
        men.offer_end_datetime as offer_end_datetime,
        men.date_created as date_created, 
        men.date_updated as date_updated,
        men.row_uuid as row_uuid

        FROM menu as men
        LEFT OUTER JOIN regional_food_category as rfc
        ON rfc.row_uuid = men.regional_food_category_row_uuid
        LEFT OUTER JOIN food_category as fc
        ON fc.row_uuid = men.food_category_row_uuid

        WHERE men.kitchen_row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

export class fetch_menu_of_regional_food_cat extends BaseDao<IGetMenuForCart[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        rfc.name as regional_food_category_name,
        rfc.is_active as regional_food_category_is_active,
        rfc.offer_percentage as regional_food_category_offer_percentage,
        rfc.offer_start_datetime as regional_food_category_offer_start_datetime,
        rfc.offer_end_datetime as regional_food_category_offer_end_datetime,

        fc.name as food_category_name,
        fc.is_active as food_category_is_active,
        fc.offer_percentage as food_category_offer_percentage,
        fc.offer_start_datetime as food_category_offer_start_datetime,
        fc.offer_end_datetime as food_category_offer_end_datetime,

        kit.is_active as kitchen_is_active,
        kit.offer_percentage as kitchen_offer_percentage,
        kit.offer_start_datetime as kitchen_offer_start_datetime,
        kit.offer_end_datetime as kitchen_offer_end_datetime, 

        men.menu_name as menu_menu_name,
        men.is_active as menu_is_active,
        men.profile_picture as menu_profile_picture,
        men.bio as menu_bio,
        men.kitchen_row_uuid as kitchen_row_uuid,
        men.regional_food_category_row_uuid as regional_food_category_row_uuid,
        men.food_category_row_uuid as food_category_row_uuid,
        men.offer_percentage as menu_offer_percentage,
        men.offer_start_datetime as menu_offer_start_datetime,
        men.offer_end_datetime as menu_offer_end_datetime,
        men.date_created as menu_date_created, 
        men.date_updated as menu_date_updated,
        men.row_uuid as menu_row_uuid,

        msv.price_per_unit as menu_variant_price_per_unit,
        msv.is_active as menu_variant_is_active,
        msv.offer_percentage as menu_variant_offer_percentage,
        msv.offer_start_datetime as menu_variant_offer_start_datetime,
        msv.offer_end_datetime as menu_variant_offer_end_datetime,
        msv.row_uuid  as menu_variant_row_uuid

        FROM menu as men
        LEFT OUTER JOIN regional_food_category as rfc
        ON rfc.row_uuid = men.regional_food_category_row_uuid
        LEFT OUTER JOIN food_category as fc
        ON fc.row_uuid = men.food_category_row_uuid
        LEFT OUTER JOIN menu_size_variant as msv
        ON msv.menu_row_uuid = men.row_uuid
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = men.kitchen_row_uuid

        WHERE men.kitchen_row_uuid = :kitchen_row_uuid: AND men.regional_food_category_row_uuid = :regional_food_category_row_uuid:
    ;`)
    fetch(kitchen_row_uuid: string, regional_food_category_row_uuid: string) {
        const current_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const sorted_with_price = this.DBData.filter((p) => p.menu_is_active === 'yes' && p.menu_variant_row_uuid !== null && p.menu_variant_is_active === 'yes').sort(
            (a, b) => +a.menu_variant_price_per_unit - +b.menu_variant_price_per_unit
        );
        const unique_menus = find_unique_items(sorted_with_price, 'menu_row_uuid');

        /** extract the proper offer and calculate the final price */
        const final_arr = unique_menus.map((p) => {
            /** find the offers */
            let offer_percentage: number = 0;

            if (+p.menu_variant_offer_percentage > 0 && can_apply_offer(p.menu_variant_offer_start_datetime, current_date, p.menu_variant_offer_end_datetime) && p.menu_variant_is_active === 'yes') {
                offer_percentage = +p.menu_variant_offer_percentage;
            } else if (+p.menu_offer_percentage > 0 && can_apply_offer(p.menu_offer_start_datetime, current_date, p.menu_offer_end_datetime) && p.menu_is_active === 'yes') {
                offer_percentage = +p.menu_offer_percentage;
            } else if (+p.kitchen_offer_percentage > 0 && can_apply_offer(p.kitchen_offer_start_datetime, current_date, p.kitchen_offer_end_datetime) && p.kitchen_is_active === 'yes') {
                offer_percentage = +p.kitchen_offer_percentage;
            } else if (
                +p.regional_food_category_offer_percentage > 0 &&
                can_apply_offer(p.regional_food_category_offer_start_datetime, current_date, p.regional_food_category_offer_end_datetime) &&
                p.regional_food_category_is_active === 'yes'
            ) {
                offer_percentage = +p.regional_food_category_offer_percentage;
            } else if (
                +p.food_category_offer_percentage > 0 &&
                can_apply_offer(p.food_category_offer_start_datetime, current_date, p.food_category_offer_end_datetime) &&
                p.food_category_is_active === 'yes'
            ) {
                offer_percentage = +p.food_category_offer_percentage;
            }

            const final_price = +p.menu_variant_price_per_unit - (+p.menu_variant_price_per_unit * offer_percentage) / 100;
            return { ...p, final_offer_percentage: offer_percentage, final_price: +final_price.toFixed(2) };
        });

        return this.baseFetch(final_arr);
    }
}

/** search the menus */

export class fetch_menu_search extends BaseDao<IGetMenuSearchResult[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        men.profile_picture as profile_picture,
        men.menu_name as name

        FROM menu as men
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = men.kitchen_row_uuid

        WHERE men.menu_name LIKE :search_term: AND men.is_active = 'yes'

    ;`)
    fetch(search_term: string) {
        return this.baseFetch(this.DBData);
    }
}

/** find the trending menu */
export class fetch_menu_trending extends BaseDao<IGetMenuTrending[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        men.menu_name as menu_name,
        men.profile_picture as menu_profile_picture,
        men.row_uuid as menu_row_uuid,
        kit.row_uuid as kitchen_row_uuid

        FROM menu as men
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = men.kitchen_row_uuid
        WHERE men.is_active = 'yes'
        LIMIT 12
    ;`)
    fetch(latitude: number, longitude: number) {
        return this.baseFetch(this.DBData);
    }
}
