/** fetch all the push fcm token of the entity */

import { foodbzr_entity, IGetPushAddress } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class fetch_push_message_fcm_tokens extends BaseDao<IGetPushAddress[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
    SELECT

    entity,
    entity_row_uuid,
    push_address,
    date_created,
    date_updated,
    row_uuid

    FROM push_message
    WHERE entity = :entity: AND entity_row_uuid = :entity_row_uuid:
    ;`)
    fetch(entity: foodbzr_entity, entity_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
