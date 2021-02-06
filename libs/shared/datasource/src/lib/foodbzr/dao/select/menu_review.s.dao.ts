/**
 * Get the menu reviews of the menu
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetMenuReview } from '@foodbzr/shared/types';

export class fetch_menu_reviews_of_menu extends BaseDao<IGetMenuReview[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        mr.menu_row_uuid as menu_row_uuid,
        mr.user_row_uuid as user_row_uuid,
        mr.review as review,
        mr.is_active as is_active,
        mr.positive_points as positive_points,
        mr.negative_points as negative_points,
        mr.date_created as date_created,
        mr.date_updated as date_updated,
        mr.row_uuid as row_uuid,
        user.full_name as full_name,
        user.profile_picture as profile_picture
 
        FROM menu_review as mr
        LEFT OUTER JOIN user
        ON user.row_uuid = mr.user_row_uuid
        WHERE mr.menu_row_uuid = :menu_row_uuid:
    ;`)
    fetch(menu_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Fetch reviews of the menu with date range
 */
