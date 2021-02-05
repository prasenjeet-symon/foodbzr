/**
 * Deactivate the regional_food_category
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_regional_food_category extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE regional_food_category
        SET is_active = :is_active:
        WHERE row_uuid = :regional_food_category_row_uuid:
    ;`)
    fetch(is_active: is_active, regional_food_category_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
