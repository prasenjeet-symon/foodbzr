/**
 * Get all the regional_food_category of the partner
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetRegionalFoodCategory } from '@foodbzr/shared/types';

export class fetch_regional_food_category_of_partner extends BaseDao<IGetRegionalFoodCategory[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        name,
        is_active,
        profile_picture,
        partner_row_uuid,
        offer_percentage,
        offer_start_datetime,
        offer_end_datetime,
        date_created,
        date_updated,
        row_uuid

        FROM regional_food_category
        WHERE partner_row_uuid = :partner_row_uuid:
    ;`)
    fetch(partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
