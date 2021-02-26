/**
 * Add new picture multiple at at time
 */
import { IModificationDaoStatus, IGetImageBBResponse } from '@foodbzr/shared/types';
import { IDaoConfig, MIBaseDao, MIQuery, TBaseDao, TQuery } from '@sculify/node-room';
import { UploadToImageBB } from '@foodbzr/shared/util';

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
            delete_uri,
            size,
            mime_type,
            date_created,
            row_uuid
        )
        VALUES
        (
            :menu_row_uuid:,
            :pic_uri:,
            :thumbnail_uri:,
            :delete_uri:,
            :size:,
            :mime_type:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(menu_row_uuid: string, pic_uri: string, thumbnail_uri: string, delete_uri: string, size: string, mime_type: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** upload the image  */

export class uplaod_image_to_cloud extends TBaseDao<IGetImageBBResponse> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(imageBase64: string) {
        try {
            if (!imageBase64) {
                return;
            }

            const uploadMedia = new UploadToImageBB(imageBase64, '719b4ce0c4a785e9b945678d1be45273');
            const data = await uploadMedia.uploadMedia();
            return this.baseFetch(data);
        } catch (error) {
            return this.baseFetch(null);
        }
    }
}
