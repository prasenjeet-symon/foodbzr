/**
 *  Fetch Single user
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetUser } from '@foodbzr/shared/types';

export class fetch_user_single extends BaseDao<IGetUser[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        owner_row_uuid,
        full_name,
        mobile_number,
        profile_picture,
        bio,
        is_active,
        gender,
        birth_date,
        last_otp,
        is_mobile_verified,
        date_created,
        date_updated,
        row_uuid

        FROM user
        WHERE row_uuid = :user_row_uuid:
    ;`)
    fetch(user_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** fetch all users */

export class fetch_user_all extends BaseDao<IGetUser[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        owner_row_uuid,
        full_name,
        mobile_number,
        profile_picture,
        bio,
        is_active,
        gender,
        birth_date,
        last_otp,
        is_mobile_verified,
        date_created,
        date_updated,
        row_uuid

        FROM user
    ;`)
    fetch() {
        return this.baseFetch(this.DBData);
    }
}