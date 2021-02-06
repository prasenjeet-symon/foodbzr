/**
 * Fetch the user cart info
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetUserCartFull } from '@foodbzr/shared/types';

export class fetch_user_cart_full_details extends BaseDao<IGetUserCartFull[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        uc.user_row_uuid as user_row_uuid,
        uc.amount as amount,
        uc.date_created as date_created,
        uc.date_updated as date_updated,
        uc.row_uuid as row_uuid,

        msv.price_per_unit as menu_size_variant_price_per_unit,
        msv.name as menu_size_variant_name,
        msv.offer_percentage as menu_size_variant_offer_percentage,
        msv.offer_start_datetime as menu_size_variant_offer_start_datetime,
        msv.offer_end_datetime as menu_size_variant_offer_end_datetime,
        msv.row_uuid as menu_size_variant_row_uuid,

        men.menu_name as menu_menu_name,
        men.offer_percentage as menu_offer_percentage,
        men.offer_start_datetime as menu_offer_start_datetime,
        men.offer_end_datetime as menu_offer_end_datetime,
        men.row_uuid as menu_row_uuid,

        kit.kitchen_name as kitchen_kitchen_name,
        kit.offer_percentage as kitchen_offer_percentage,
        kit.offer_start_datetime as kitchen_offer_start_datetime,
        kit.offer_end_datetime as kitchen_offer_end_datetime,
        kit.row_uuid as kitchen_row_uuid,

        rfc.name as regional_food_category_name,
        rfc.offer_percentage as regional_food_category_offer_percentage,
        rfc.offer_start_datetime as regional_food_category_offer_start_datetime,
        rfc.offer_end_datetime as regional_food_category_offer_end_datetime,
        rfc.row_uuid as regional_food_category_row_uuid,

        fc.name as food_category_name,
        fc.offer_percentage as food_category_offer_percentage,
        fc.offer_start_datetime as food_category_offer_start_datetime,
        fc.offer_end_datetime as food_category_offer_end_datetime,
        fc.row_uuid as food_category_row_uuid

        FROM user_cart as uc
        LEFT OUTER JOIN menu_size_variant as msv
        ON msv.row_uuid = uc.menu_size_variant_row_uuid

        LEFT OUTER JOIN menu as men
        ON men.row_uuid = msv.menu_row_uuid

        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = men.kitchen_row_uuid

        LEFT OUTER JOIN regional_food_category as rfc
        ON rfc.row_uuid = men.regional_food_category_row_uuid

        LEFT OUTER JOIN food_category as fc
        ON fc.row_uuid = men.food_category_row_uuid

        WHERE uc.user_row_uuid = :user_row_uuid:
    ;`)
    fetch(user_row_uuid: string) {
        /** Group the items with key kitchen_row_uuid with kitchen information  */
        return this.baseFetch(this.DBData);
    }
}
