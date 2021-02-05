/**
 * Delete the menu
 * Deleting the menu means deactivating the menu
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_menu extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu
        SET is_active = :is_active:
        WHERE row_uuid = :menu_row_uuid:
    ;`)
    fetch(is_active: is_active, menu_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
