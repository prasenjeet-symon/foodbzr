import { foodbzr_entity, IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

/** add new push message */
export class insert_push_message extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO push_message
        (
            entity,
            entity_row_uuid,
            push_address,
            date_created,
            row_uuid
        )
        VALUES
        (
            :entity:,
            :entity_row_uuid:,
            :push_address:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(entity: foodbzr_entity, entity_row_uuid: string, push_address: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
