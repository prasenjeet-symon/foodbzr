/** update the kitchen location */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_kitchen_location_commission extends BaseDao<[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen_location
        SET commission = :commission:
        WHERE row_uuid = :kitchen_location_row_uuid:
    ;`)
    fetch(commission: number, kitchen_location_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

export class update_kitchen_location_address extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen_location
        SET 
        coordinate = ST_GeomFromText('POINT(:latitude: :longitude:)', 4326),
        street  = :street:,
        pincode = :pincode:,
        city  = :city:,
        state = :state:,
        country = :country:
        WHERE row_uuid = :kitchen_location_row_uuid: 
    ;`)
    fetch(latitude: number, longitude: number, street: string, pincode: string, city: string, state: string, country: string, kitchen_location_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

export class update_kitchen_location_radius extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen_location
        SET radius = :radius:
        WHERE row_uuid = :kitchen_location_row_uuid: 

    ;`)
    fetch(radius: number, kitchen_location_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

export class update_kitchen_location_partner extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
    UPDATE kitchen_location
    SET partner_row_uuid = :partner_row_uuid:
    WHERE row_uuid = :kitchen_location_row_uuid:
    ;`)
    fetch(partner_row_uuid: string, kitchen_location_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
