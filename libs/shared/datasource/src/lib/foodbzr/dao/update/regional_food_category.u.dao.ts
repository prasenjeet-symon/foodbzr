/**
 * update the regional_food_category
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_regional_food_category extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE regional_food_category
        SET 
        name = :name:,
        profile_picture = :profile_picture:,
        offer_percentage = :offer_percentage:,
        offer_start_datetime = :offer_start_datetime:,
        offer_end_datetime = :offer_end_datetime:

        WHERE row_uuid = :regional_food_category_row_uuid:

    ;`)
    fetch(name: string, profile_picture: string, offer_percentage: number, offer_start_datetime: string, offer_end_datetime: string, regional_food_category_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
