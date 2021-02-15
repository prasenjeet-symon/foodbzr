/**
 *  Add the menu_size_variant
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_menu_size_variant extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO menu_size_variant
        (
            name,
            profile_picture,
            price_per_unit,
            min_order_amount,
            bio,
            menu_row_uuid,
            date_created,
            row_uuid
        )
        VALUES
        (
            :name:,
            :profile_picture:,
            :price_per_unit:,
            :min_order_amount:,
            :bio:,
            :menu_row_uuid:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(
        name: string,
        profile_picture: string,
        price_per_unit: number,
        min_order_amount: number,
        bio: string,
        menu_row_uuid: string,
        date_created: string,
        row_uuid: string
    ) {
        return this.baseFetch(this.DBData);
    }
}
