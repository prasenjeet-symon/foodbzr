/**
 * Delete th d-boy
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_dboy extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE dboy
        SET is_active = :is_active:
        WHERE row_uuid = :dboy_row_uuid:
    ;`)
    fetch(is_active: is_active, dboy_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
