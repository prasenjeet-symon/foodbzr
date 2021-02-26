/**
 * Add new address for the delivery
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_delivery_address extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO delivery_address
        (
            user_row_uuid,
            street,
            pincode,
            city,
            state,
            country,
            latitude,
            longitude,
            date_created,
            row_uuid
        )
        VALUES
        (
            :user_row_uuid:,
            :street:,
            :pincode:,
            :city:,
            :state:,
            :country:,
            :latitude:,
            :longitude:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(user_row_uuid: string, street: string, pincode: string, city: string, state: string, country: string, latitude: number, longitude: number, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
