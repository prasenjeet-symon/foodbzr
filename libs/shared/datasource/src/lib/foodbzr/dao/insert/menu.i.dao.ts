/**
 * Add the new menu in the kitchen
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_menu extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO menu
        (
            menu_name,
            profile_picture,
            bio,
            kitchen_row_uuid,
            regional_food_category_row_uuid,
            food_category_row_uuid,
            offer_percentage,
            offer_start_datetime,
            offer_end_datetime,
            date_created,
            row_uuid
        )
        VALUES
        (
            :menu_name:,
            :profile_picture:,
            :bio:,
            :kitchen_row_uuid:,
            :regional_food_category_row_uuid:,
            :food_category_row_uuid:,
            :offer_percentage:,
            :offer_start_datetime:,
            :offer_end_datetime:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(
        menu_name: string,
        profile_picture: string,
        bio: string,
        kitchen_row_uuid: string,
        regional_food_category_row_uuid: string,
        food_category_row_uuid: string,
        offer_percentage: number,
        offer_start_datetime: string,
        offer_end_datetime: string,
        date_created: string,
        row_uuid: string
    ) {
        return this.baseFetch(this.DBData);
    }
}
