/**
 * Update the menu review
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_menu_review extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu_review
        SET
        review = :review:,
        positive_points = positive_points + :positive_points:,
        negative_points = negative_points + :negative_points:

        WHERE row_uuid = :menu_review_row_uuid:

    ;`)
    fetch(review: string, positive_points: number, negative_points: number, menu_review_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
