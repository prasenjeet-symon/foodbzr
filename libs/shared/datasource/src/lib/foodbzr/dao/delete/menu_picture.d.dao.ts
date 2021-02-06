/**
 * Deleting means actual delete  from the database
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_menu_picture extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        DELETE FROM menu_picture
        WHERE row_uuid IN ( :menu_picture_row_uuids: )
    ;`)
    fetch(menu_picture_row_uuids: string[]) {
        return this.baseFetch(this.DBData);
    }
}

// TODO: also delete from the aws bucket
