/**
 * Update the delivery address
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_delivery_address extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE delivery_address
        SET
        street = :street:,
        pincode = :pincode:,
        state = :state:,
        country = :country:,
        latitude = :latitude:,
        longitude = :longitude:

        WHERE row_uuid = :delivery_address_row_uuid:
    ;`)
    fetch(street: string, pincode: string, state: string, country: string, latitude: number, longitude: number, delivery_address_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
