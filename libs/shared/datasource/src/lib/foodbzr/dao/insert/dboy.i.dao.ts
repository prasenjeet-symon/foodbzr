/**
 *  Add new dboy
 */
import { gender, IGetDBoy, IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

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

/**  fetch the dboy with mobile number */
class fetch_dboy_with_mobile extends BaseDao<IGetDBoy[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        kitchen_row_uuid,
        full_name,
        mobile_number,
        profile_picture,
        gender,
        bio,
        is_active,
        is_mobile_verified,
        last_otp,
        birth_date,
        is_verified,
        date_created,
        date_updated,
        row_uuid

        FROM dboy
        WHERE mobile_number = :mobile_number:
    ;`)
    fetch(mobile_number: string) {
        return this.baseFetch(this.DBData);
    }
}

/** insert the dboy from the partner side  */
class insert_dboy_with_mobile extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO dboy
        (
            full_name,
            kitchen_row_uuid,
            mobile_number,
            date_created,
            row_uuid
        )
        VALUES
        (
            :full_name:,
            :kitchen_row_uuid:,
            :mobile_number:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(full_name: string, kitchen_row_uuid: string, mobile_number: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** insert the dboy from partner */

export class insert_dboy_from_partner extends TBaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string, kitchen_row_uuid: string, full_name: string) {
        await this.openTransaction();

        try {
            /** is there already the dboy with given mobile number */
            const found_dboy = await new fetch_dboy_with_mobile(this.TDaoConfig).fetch(mobile_number).asyncData(this);
            if (found_dboy.length !== 0) {
                throw new Error('user_exit');
            }

            const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const ins = await new insert_dboy_with_mobile(this.TDaoConfig).fetch(full_name, kitchen_row_uuid, mobile_number, date_created, uuid()).asyncData(this);

            await this.closeTransaction();
            return this.baseFetch(ins);
        } catch (error) {
            await this.rollback();
            return this.baseFetch({});
        }
    }
}
