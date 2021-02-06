/**
 *  Add new dboy
 */

import { gender, IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class insert_dboy extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO dboy
        (
            kitchen_row_uuid,
            full_name,
            mobile_number,
            profile_picture,
            gender,
            birth_date,
            date_created,
            row_uuid
        )
        VALUES
        (
            :kitchen_row_uuid:,
            :full_name:,
            :mobile_number:,
            :profile_picture:,
            :gender:,
            :birth_date:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(kitchen_row_uuid: string, full_name: string, mobile_number: string, profile_picture: string, gender: gender, birth_date: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
