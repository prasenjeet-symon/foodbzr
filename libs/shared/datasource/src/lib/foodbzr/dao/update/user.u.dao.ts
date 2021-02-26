/**
 * Add otp user is trying to login
 */

import { gender, IGetUser, IModificationDaoStatus } from '@foodbzr/shared/types';
import { generate_otp } from '@foodbzr/shared/util';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { fetch_owner_all } from '../select/owner.s.dao';
import { fetch_user_single } from '../select/user.s.dao';

/** update user info */
export class update_user extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE user 
        SET
        full_name = :full_name:,
        mobile_number = :mobile_number:,
        profile_picture = :profile_picture:,
        bio = :bio:,
        gender = :gender:,
        birth_date = :birth_date:

        WHERE row_uuid = :user_row_uuid:
    ;`)
    fetch(full_name: string, mobile_number: string, profile_picture: string, bio: string, gender: gender, birth_date: string, user_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** user auth */
/**
 *
 *
 *
 *
 */

class update_user_otp extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE user
        SET last_otp =  :otp:
        WHERE row_uuid = :user_row_uuid:
    ;`)
    fetch(otp: string, user_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** insert the user with mobile number */
class insert_user_with_mobile extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO user
        (
            owner_row_uuid,
            mobile_number,
            last_otp,
            date_created,
            row_uuid
        )
        VALUES
        (
            :owner_row_uuid:,
            :mobile_number:,
            :last_otp:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(owner_row_uuid: string, mobile_number: string, last_otp: string, date_created: string, row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** fetch the user with mobile number */
class fetch_user_with_mobile_number extends BaseDao<IGetUser[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        owner_row_uuid,
        full_name,
        mobile_number,
        profile_picture,
        bio,
        is_active,
        gender,
        birth_date,
        last_otp,
        is_mobile_verified,
        date_created,
        date_updated,
        row_uuid

        FROM user
        WHERE mobile_number = :mobile_number:
    ;`)
    fetch(mobile_number: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, birth_date: moment(new Date(p.birth_date)).format('YYYY-MM-DD') };
            })
        );
    }
}

/** auth the user with mobile and otp */
interface IGetUserAuth {
    is_err: boolean;
    error: string;
    user_row_uuid: string;
}

export class update_user_auth extends TBaseDao<IGetUserAuth> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string) {
        await this.openTransaction();

        try {
            /** fetch the user with mobile number */
            const found_user = await new fetch_user_with_mobile_number(this.TDaoConfig).fetch(mobile_number).asyncData(this);
            if (found_user.length === 0) {
                /** create the new user */
                const date_created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                const user_row_uuid = uuid();

                /** fetch the owner */
                const found_owner = await new fetch_owner_all(this.TDaoConfig).fetch().asyncData(this);
                if (found_owner.length === 0) {
                    throw new Error('owner_not_found');
                }
                const owner_data = found_owner[0];
                const otp_gen = generate_otp(5);
                await new insert_user_with_mobile(this.TDaoConfig).fetch(owner_data.row_uuid, mobile_number, otp_gen, date_created, user_row_uuid).asyncData(this);

                await this.closeTransaction();
                return this.baseFetch({
                    is_err: false,
                    error: null,
                    user_row_uuid: user_row_uuid,
                });
            }

            /** update the otp  */
            const user_data = found_user[0];

            const gen_otp = generate_otp(5);
            await new update_user_otp(this.TDaoConfig).fetch(gen_otp, user_data.row_uuid).asyncData(this);

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                user_row_uuid: user_data.row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                user_row_uuid: null,
            });
        }
    }
}

/** auth user verify otp */
interface IGetUserAuthVerifyOTP {
    is_err: boolean;
    error: string;
    user_row_uuid: string;
}

export class update_user_verify_otp extends TBaseDao<IGetUserAuthVerifyOTP> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string, client_otp: string, user_row_uuid: string) {
        await this.openTransaction();

        try {
            const found_user = await new fetch_user_single(this.TDaoConfig).fetch(user_row_uuid).asyncData(this);
            if (found_user.length === 0) {
                throw new Error('user_not_found');
            }

            const user_data = found_user[0];

            if (user_data.last_otp !== client_otp) {
                throw new Error('wrong_otp');
            }

            if (user_data.mobile_number !== mobile_number) {
                throw new Error('wrong_mobile_number');
            }

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                user_row_uuid: user_data.row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                user_row_uuid: null,
            });
        }
    }
}

/** resend otp  */
interface IGetUserAuthResendOTP {
    is_err: boolean;
    error: string;
    user_row_uuid: string;
}

export class update_user_resend_otp extends TBaseDao<IGetUserAuthResendOTP> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string, user_row_uuid: string) {
        await this.openTransaction();

        try {
            const found_user = await new fetch_user_single(this.TDaoConfig).fetch(user_row_uuid).asyncData(this);
            if (found_user.length === 0) {
                throw new Error('user_not_found');
            }

            const user_data = found_user[0];

            if (user_data.mobile_number !== mobile_number) {
                throw new Error('wrong_mobile_number');
            }

            /** update the otp */
            const otp_gen = generate_otp(5);
            await new update_user_otp(this.TDaoConfig).fetch(otp_gen, user_data.row_uuid).asyncData(this);

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                user_row_uuid: user_data.row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                user_row_uuid: user_row_uuid,
            });
        }
    }
}
