import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_kitchen_location extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO kitchen_location
        (
            partner_row_uuid,
            kitchen_row_uuid,
            radius,
            coordinate,
            street,
            pincode,
            city,
            state,
            country,
            date_created,
            row_uuid
        )
        VALUES
        (
            :partner_row_uuid:,
            :kitchen_row_uuid:,
            :radius:,
            ST_GeomFromText('POINT(:latitude: :longitude:)', 4326),
            :street:,
            :pincode:,
            :city:,
            :state:,
            :country:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(
        partner_row_uuid: string,
        kitchen_row_uuid: string,
        radius: number,
        latitude: number,
        longitude: number,
        street: string,
        pincode: number,
        city: string,
        state: string,
        country: string,
        date_created: string,
        row_uuid: string
    ) {
        return this.baseFetch(this.DBData);
    }
}
