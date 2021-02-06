/**
 * Get all menu_size_variant of the menu with given menu_row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetMenuSizeVariant } from '@foodbzr/shared/types';

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
