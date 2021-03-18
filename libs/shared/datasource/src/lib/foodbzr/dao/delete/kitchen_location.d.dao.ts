import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { exec } from 'child_process';

/** deactivate the kitchen location */
export class delete_kitchen_location extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen_location
        SET is_active = :is_active:
        WHERE row_uuid = :kitchen_location_row_uuid:
    ;`)
    fetch(is_active: is_active, kitchen_location_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** remove the partner association */
export class delete_kitchen_location_partner_relation extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen_location
        SET partner_row_uuid = NULL
        WHERE row_uuid = :kitchen_location_row_uuid:
    ;`)
    fetch(kitchen_location_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
