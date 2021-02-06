/**
 * Delete the user
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_user extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE user 
        SET is_active = :is_active:
        WHERE row_uuid = :user_row_uuid:
    ;`)
    fetch(is_active: is_active, user_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
