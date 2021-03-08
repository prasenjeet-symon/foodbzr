import { foodbzr_entity, IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { IGetPushAddress } from '@foodbzr/shared/types';

/** insert the push message  */
class insert_push_message_single extends BaseDao<IModificationDaoStatus> {
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

/** fetch the push to check if the device already exit */
class fetch_push_message_for_duplicate_device_check extends BaseDao<IGetPushAddress[]> {
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
        WHERE entity = :entity: AND entity_row_uuid = :entity_row_uuid: AND push_address = :push_address:
    `)
    fetch(entity: foodbzr_entity, entity_row_uuid: string, push_address: string) {
        return this.baseFetch(this.DBData);
    }
}

/** add new push message */
export class insert_push_message extends TBaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(entity: foodbzr_entity, entity_row_uuid: string, push_address: string) {
        await this.openTransaction();

        try {
            /** fetch the prev one */
            const found_one = await new fetch_push_message_for_duplicate_device_check(this.TDaoConfig).fetch(entity, entity_row_uuid, push_address).asyncData(this);
            if (found_one.length !== 0) {
                throw new Error('already inserted');
            }

            /** insert the new one */
            const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

            const inserted_data = await new insert_push_message_single(this.TDaoConfig).fetch(entity, entity_row_uuid, push_address, date_created, uuid()).asyncData(this);
            await this.closeTransaction();
            return this.baseFetch(inserted_data);
        } catch (error) {
            await this.rollback();
            return this.baseFetch({});
        }
    }
}
