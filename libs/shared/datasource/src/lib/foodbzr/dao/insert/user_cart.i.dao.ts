/**
 *  Add new item to the user cart
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_user_cart extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO user_cart
        (
            user_row_uuid,
            menu_size_variant_row_uuid,
            amount,
            date_created,
            row_uuid
        )
        VALUES
        (
            :user_row_uuid:,
            :menu_size_variant_row_uuid:,
            :amount:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(user_row_uuid: string, menu_size_variant_row_uuid: string, amount: number, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
