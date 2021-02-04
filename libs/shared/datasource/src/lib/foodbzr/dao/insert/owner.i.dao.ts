import { gender, IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

/**
 * Add new owner
 */
export class insert_owner extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO owner
        (
            mobile_number,
            full_name,
            bio,
            gender,
            profile_picture,
            date_created,
            row_uuid
        )
        VALUES
        (
            :mobile_number:,
            :full_name:,
            :bio:,
            :gender:,
            :profile_picture:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(mobile_number: string, full_name: string, bio: string, gender: gender, profile_picture: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
