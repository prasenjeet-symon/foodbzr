/**
 * Delete the menu review
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_menu_review extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu_review
        SET is_active = :is_active:
        WHERE row_uuid = :menu_review_row_uuid:
    ;`)
    fetch(is_active: is_active, menu_review_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
