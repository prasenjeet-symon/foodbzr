/**
 * Update the menu of the kitchen
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_menu extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu
        SET 
        menu_name = :menu_name:,
        bio = :bio:

        WHERE row_uuid = :menu_row_uuid:

    ;`)
    fetch(menu_row_uuid: string, menu_name: string, bio: string) {
        return this.baseFetch(this.DBData);
    }
}

export class update_menu_offers extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu
        SET 
        offer_percentage = :offer_percentage:,
        offer_start_datetime = :offer_start_datetime:,
        offer_end_datetime = :offer_end_datetime:

        WHERE row_uuid = :menu_row_uuid:

    ;`)
    fetch(offer_percentage: number, offer_start_datetime: string, offer_end_datetime: string, menu_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

export class update_menu_category extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu
        SET 
        regional_food_category_row_uuid = :regional_food_category_row_uuid:,
        food_category_row_uuid = :food_category_row_uuid:

        WHERE row_uuid = :menu_row_uuid:
    ;`)
    fetch(regional_food_category_row_uuid: string, food_category_row_uuid: string, menu_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
