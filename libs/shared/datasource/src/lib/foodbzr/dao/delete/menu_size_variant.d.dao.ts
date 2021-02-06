/**
 * Delete the menu_size_variant
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_menu_size_variant extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu_size_variant
        SET is_active = :is_active:
        WHERE row_uuid = :menu_size_variant_row_uuid:
    ;`)
    fetch(menu_size_variant_row_uuid: string, is_active: is_active) {
        return this.baseFetch(this.DBData);
    }
}
