/**
 * Delete the food category
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_food_category extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE food_category
        SET is_active = :is_active:
        WHERE row_uuid = :food_category_row_uuid:
    ;`)
    fetch(is_active: is_active, food_category_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
