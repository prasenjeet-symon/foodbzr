/**
 *  Update the dboy info
 */

import { gender, IModificationDaoStatus } from '@foodbzr/shared/types';
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
