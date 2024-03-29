/**
 * Update the menu_size_variant
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_menu_size_variant extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu_size_variant
        SET
        name = :name:,
        price_per_unit = :price_per_unit:,
        min_order_amount = :min_order_amount:,
        bio = :bio:

        WHERE row_uuid = :menu_size_variant_row_uuid:
    ;`)
    fetch(name: string, price_per_unit: number, min_order_amount: number, bio: string, menu_size_variant_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update menu offer information */

export class update_menu_size_variant_offer extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu_size_variant
        SET

        offer_percentage = :offer_percentage:,
        offer_start_datetime = :offer_start_datetime:,
        offer_end_datetime = :offer_end_datetime:

        WHERE row_uuid = :menu_size_variant_row_uuid:
    ;`)
    fetch(offer_percentage: number, offer_start_datetime: string, offer_end_datetime: string, menu_size_variant_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
