/**
 * Add new partner for the owner
 * This table is connected to the owner table with foreign key owner_row_uuid
 */

import { gender, IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_partner extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO partner
        (
            owner_row_uuid,
            profile_picture,
            gender,
            full_name,
            mobile_number,
            bio,
            date_created,
            row_uuid
        )
        VALUES
        (
            :owner_row_uuid:,
            :profile_picture:,
            :gender:,
            :full_name:,
            :mobile_number:,
            :bio:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(owner_row_uuid: string, profile_picture: string, gender: gender, full_name: string, mobile_number: string, bio: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
