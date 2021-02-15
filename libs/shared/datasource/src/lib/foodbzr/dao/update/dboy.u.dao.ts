/**
 *  Update the dboy info
 */

import { gender, IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_dboy extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE dboy
        SET

        full_name = :full_name:,
        profile_picture = :profile_picture:,
        gender = :gender:,
        birth_date = :birth_date:

        WHERE row_uuid = :dboy_row_uuid:
    ;`)
    fetch(full_name: string, profile_picture: string, gender: gender, birth_date: string, dboy_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update theverification satatus */
export class update_dboy_verify extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE dboy
        SET

        is_verified = :is_verified:

        WHERE row_uuid = :dboy_row_uuid:
    ;`)
    fetch(dboy_row_uuid: string, is_verified: is_active) {
        return this.baseFetch(this.DBData);
    }
}
