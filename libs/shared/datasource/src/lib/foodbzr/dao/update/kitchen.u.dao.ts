/**
 * Update the kitchen information of single kitchen
 */

import { IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query, TBaseDao } from '@sculify/node-room';
import { fetch_kitchen_password } from '../select/kitchen.s.dao';

export class update_kitchen extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen
        SET
        kitchen_name = :kitchen_name:,
        opening_time  = :opening_time:,
        closing_time = :closing_time:,
        radius = :radius:,
        open_week_list = :open_week_list:

        WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_name: string, opening_time: string, closing_time: string, radius: number, open_week_list: string, kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Update the kitchen offers details
 */

export class update_kitchen_offers extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen
        SET 
        offer_percentage = :offer_percentage:,
        offer_start_datetime = :offer_start_datetime:,
        offer_end_datetime = :offer_end_datetime:

        WHERE row_uuid = :kitchen_row_uuid:
     ;`)
    fetch(offer_percentage: number, offer_start_datetime: string, offer_end_datetime: string, kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

class update_kitchen_password_private extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen
        SET kitchen_password = :kitchen_password:
        WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_password: string, kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update the kitchen login info */
export class update_kitchen_login_detail extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }
    @Query(`
        UPDATE kitchen
        SET 
        kitchen_password = :kitchen_password:,
        kitchen_user_id = :kitchen_user_id:

        WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_password: string, kitchen_user_id: string, kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Update the kitchen password
 * with old password
 */

export class update_kitchen_password extends TBaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    async fetch(kitchen_row_uuid: string, incoming_old_password: string, new_password: string) {
        await this.openTransaction();

        try {
            /** fetch the old kitchen password */
            const old_pass = await new fetch_kitchen_password(this.TDaoConfig).fetch(kitchen_row_uuid).asyncData();

            if (old_pass.length === 0) {
                throw new Error('no kitchen found with given row_uuid');
            }
            const old_password = old_pass[0].kitchen_password;

            /** Compare with incoming old_password */
            if (incoming_old_password === old_password) {
                /** Password did match */
                /** Change the password */
                await new update_kitchen_password_private(this.TDaoConfig).fetch(new_password, kitchen_row_uuid).asyncData();
            }

            await this.closeTransaction();
            return this.baseFetch([]);
        } catch (error) {
            await this.rollback();
        }
    }
}

/** update the kitchen address */
export class update_kitchen_address extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen
        SET 
        street = :street:,
        pincode = :pincode:,
        city = :city:,
        state = :state:,
        country = :country:,
        coordinate = ST_GeomFromText('POINT(:latitude: :longitude:)', 4326)

        WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(street: string, pincode: string, city: string, state: string, country: string, latitude: number, longitude: number, kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update the kitchen partner ref */
export class update_kitchen_partner_ref extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen
        SET
        partner_row_uuid = :partner_row_uuid:,
        can_edit_partner = :can_edit_partner:

        WHERE row_uuid IN ( :kitchen_row_uuid: )
    ;`)
    fetch(partner_row_uuid: string, can_edit_partner: is_active, kitchen_row_uuid: string[]) {
        return this.baseFetch(this.DBData);
    }
}
