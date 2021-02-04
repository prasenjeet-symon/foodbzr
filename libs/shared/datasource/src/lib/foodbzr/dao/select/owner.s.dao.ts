/**
 * Get the owner information by the owner_row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetOwner } from '@foodbzr/shared/types';

export class fetch_owner extends BaseDao<IGetOwner[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        mobile_number,
        full_name,
        bio,
        gender,
        last_otp,
        profile_picture,
        is_active,
        date_created,
        date_updated,
        row_uuid

        FROM owner
        WHERE row_uuid = :owner_row_uuid:
    ;`)
    fetch(owner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
