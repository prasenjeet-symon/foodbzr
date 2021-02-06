/**
 * Add new picture multiple at at time
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { IDaoConfig, MIBaseDao, Query } from '@sculify/node-room';

export class insert_multi_menu_picture extends MIBaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO menu_picture
        (
            menu_row_uuid,
            pic_uri,
            thumbnail_uri,
            size,
            mime_type,
            date_created,
            row_uuid
        )
        VALUES
        :values:
    ;`)
    fetch(multi_pics: { menu_row_uuid: string; pic_uri: string; thumbnail_uri: string; size: string; mime_type: string; date_created: string; row_uuid: string }[]) {
        return this.baseFetch(this.DBData);
    }
}
