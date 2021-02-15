/**
 * Add new picture multiple at at time
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { IDaoConfig, MIBaseDao, MIQuery, Query } from '@sculify/node-room';

export class insert_multi_menu_picture extends MIBaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @MIQuery(`
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
        :insert_values:
    ;`)
    fetch(multi_pics: { menu_row_uuid: string; pic_uri: string; thumbnail_uri: string; size: string; mime_type: string; date_created: string; row_uuid: string }[]) {
        return this.baseFetch(this.DBData);
    }
}
