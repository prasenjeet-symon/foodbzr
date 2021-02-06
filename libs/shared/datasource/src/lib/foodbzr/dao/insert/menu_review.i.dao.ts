/**
 * Add new review for the menu
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_menu_review extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO menu_review
        (
            menu_row_uuid,
            user_row_uuid,
            review,
            date_created,
            row_uuid
        )
        VALUES
        (
            :menu_row_uuid:,
            :user_row_uuid:,
            :review:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(menu_row_uuid: string, user_row_uuid: string, review: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
