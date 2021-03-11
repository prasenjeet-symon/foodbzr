/**
 * Add new regional_food_category
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_regional_food_category extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO regional_food_category
        (
            name,
            profile_picture,
            owner_row_uuid,
            offer_percentage,
            offer_start_datetime,
            offer_end_datetime,
            date_created,
            row_uuid
        )
        VALUES
        (
            :name:,
            :profile_picture:,
            :owner_row_uuid:,
            :offer_percentage:,
            :offer_start_datetime:,
            :offer_end_datetime:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(name: string, profile_picture: string, owner_row_uuid: string, offer_percentage: number, offer_start_datetime: string, offer_end_datetime: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
