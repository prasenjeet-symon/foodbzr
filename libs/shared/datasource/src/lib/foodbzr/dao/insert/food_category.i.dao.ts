/**
 * Add new food category
 *
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_food_category extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO food_category
        (
            name,
            profile_picture,
            partner_row_uuid,
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
            :partner_row_uuid:,
            :offer_percentage:,
            :offer_start_datetime:,
            :offer_end_datetime:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(name: string, profile_picture: string, partner_row_uuid: string, offer_percentage: number, offer_start_datetime: string, offer_end_datetime: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
