/**
 * Add the new otp to the owner
 * Owner is trying to login
 * This OTP will never delete once used then get deleted
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_owner_otp extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE owner
        SET last_otp = :otp:
        WHERE row_uuid = :owner_row_uuid:
     ;`)
    fetch(last_otp: string, otp: string) {
        return this.baseFetch(this.DBData);
    }
}
