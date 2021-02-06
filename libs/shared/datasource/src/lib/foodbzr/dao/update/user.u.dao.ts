/**
 * Add otp user is trying to login
 */

import { gender, IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

/**
 *  Update the user info
 */

export class update_user extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE user 
        SET
        full_name = :full_name:,
        mobile_number = :mobile_number:,
        profile_picture = :profile_picture:,
        bio = :bio:,
        gender = :gender:,
        birth_date = :birth_date:

        WHERE row_uuid = :user_row_uuid:
    ;`)
    fetch(full_name: string, mobile_number: string, profile_picture: string, bio: string, gender: gender, birth_date: string, user_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
