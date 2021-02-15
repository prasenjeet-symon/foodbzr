/**
 * Get all the pictures of the menu with menu_row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetMenuPicture } from '@foodbzr/shared/types';

export class fetch_menu_picture_of_menu extends BaseDao<IGetMenuPicture[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        menu_row_uuid,
        pic_uri,
        thumbnail_uri,
        size,
        mime_type,
        date_created,
        date_updated,
        row_uuid

        FROM menu_picture
        WHERE menu_row_uuid = :menu_row_uuid:
    ;`)
    fetch(menu_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
