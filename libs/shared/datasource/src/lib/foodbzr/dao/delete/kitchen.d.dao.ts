/**
 * Delete the kitchen
 * Deleting means deactivating the kitchen , setting the is_active_status = 'no'
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_kitchen extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen
        SET is_active = :is_active:
        WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(is_active: is_active, kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
