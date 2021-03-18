/**
 * Update the kitchen information of single kitchen
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
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
        open_week_list = :open_week_list:

        WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_name: string, opening_time: string, closing_time: string, open_week_list: string, kitchen_row_uuid: string) {
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

/** update the kitchen general information */
export class update_kitchen_general_information extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE kitchen
        SET 
        kitchen_name = :kitchen_name:,
        profile_picture = :profile_picture:,
        bio = :bio:

        WHERE row_uuid = :kitchen_row_uuid:
    ;`)
    fetch(kitchen_name: string, profile_picture: string, bio: string, kitchen_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
