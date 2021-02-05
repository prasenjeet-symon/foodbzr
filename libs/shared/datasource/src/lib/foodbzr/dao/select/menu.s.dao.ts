/**
 * Get the single menu with menu_row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetMenu } from '@foodbzr/shared/types';

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
