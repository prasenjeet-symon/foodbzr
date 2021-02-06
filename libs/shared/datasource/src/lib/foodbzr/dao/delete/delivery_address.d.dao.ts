/**
 * Delete the delivery address , just deactivate the item
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_delivery_address extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE delivery_address
        SET is_active = :is_active:
        WHERE row_uuid = :delivery_address_row_uuid:
    ;`)
    fetch(is_active: is_active, delivery_address_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
