/**
 * Deleting the partner means deactivating the partner
 * Just update the is_active value with 'no'
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_partner extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner
        SET is_active = :is_active:
        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(is_active: is_active, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
