/**
 * Get all menu_size_variant of the menu with given menu_row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetMenuSizeVariant, IGetMenuVariantForCart } from '@foodbzr/shared/types';
import { find_unique_items, can_apply_offer } from '@foodbzr/shared/util';
import * as moment from 'moment';

export class fetch_menu_size_variant_of_menu extends BaseDao<IGetMenuSizeVariant[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        name,
        profile_picture,
        price_per_unit,
        currency,
        min_order_amount,
        bio,
        menu_row_uuid,
        is_active,
        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
        date_created,
        date_updated,
        row_uuid

        FROM menu_size_variant
        WHERE menu_row_uuid = :menu_row_uuid:
     ;`)
    fetch(menu_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Get single menu_size_variant
 */

export class fetch_menu_size_variant_single extends BaseDao<IGetMenuSizeVariant[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        name,
        profile_picture,
        price_per_unit,
        currency,
        min_order_amount,
        bio,
        menu_row_uuid,
        is_active,
        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
        date_created,
        date_updated,
        row_uuid

        FROM menu_size_variant
        WHERE row_uuid = :menu_size_variant_row_uuid:
     ;`)
    fetch(menu_size_variant_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** fetch the menu size variant for the cart */
export class fetch_menu_size_variant_for_cart extends BaseDao<IGetMenuVariantForCart[]> {
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
        men.row_uuid as menu_row_uuid,

        msv.name as menu_variant_name,
        msv.price_per_unit as menu_variant_price_per_unit,
        msv.is_active as menu_variant_is_active,
        msv.offer_percentage as menu_variant_offer_percentage,
        msv.offer_start_datetime as menu_variant_offer_start_datetime,
        msv.offer_end_datetime as menu_variant_offer_end_datetime,
        msv.min_order_amount as menu_variant_min_order_amount,
        msv.profile_picture as menu_variant_profile_picture,
        msv.row_uuid  as menu_variant_row_uuid

        FROM menu_size_variant as msv
        LEFT OUTER JOIN menu as men
        ON men.row_uuid = msv.menu_row_uuid
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = men.kitchen_row_uuid
        LEFT OUTER JOIN regional_food_category as rfc
        ON rfc.row_uuid = men.regional_food_category_row_uuid
        LEFT OUTER JOIN food_category as fc
        ON fc.row_uuid = men.food_category_row_uuid
        
        WHERE msv.menu_row_uuid = :menu_row_uuid:
    ;`)
    fetch(menu_row_uuid: string) {
        const current_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const filtered_arr = this.DBData.filter((p) => p.menu_variant_row_uuid !== null && p.menu_variant_is_active === 'yes');

        /** extract the proper offer and calculate the final price */
        const final_arr = filtered_arr.map((p) => {
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
            return { ...p, is_selected: false, final_offer_percentage: offer_percentage, final_price: +final_price.toFixed(2) };
        });

        return this.baseFetch(final_arr);
    }
}
