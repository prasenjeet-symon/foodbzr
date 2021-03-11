/**
 * Fetch all the saved address of the user
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetDeliveryAddress } from '@foodbzr/shared/types';

export class fetch_delivery_address_of_user extends BaseDao<IGetDeliveryAddress[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        user_row_uuid,
        is_active,
        street,
        pincode,
        city,
        state,
        country,
        ST_X(coordinate) as latitude,
        ST_Y(coordinate) as longitude,
        date_created,
        date_updated,
        row_uuid

        FROM delivery_address
        WHERE user_row_uuid = :user_row_uuid:
    ;`)
    fetch(user_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
