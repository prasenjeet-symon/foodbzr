/**
 * Deleting the owner means deactivating the owner
 * Make the is_active_status = 'no'
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';

export class delete_woner extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE owner
        SET is_active = :is_active:
        WHERE row_uuid = :owner_row_uuid:
    ;`)
    fetch(owner_row_uuid: string, is_active: is_active) {
        return this.baseFetch(this.DBData);
    }
}
