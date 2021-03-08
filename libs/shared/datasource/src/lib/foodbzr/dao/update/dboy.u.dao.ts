/**
 *  Update the dboy info
 */

import { gender, IGetDBoy, IGetDboyAuth, IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { generate_otp, sendSMS } from '@foodbzr/shared/util';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import { fetch_dboy_single } from '../select/dboy.s.dao';

export class update_dboy extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE dboy
        SET

        full_name = :full_name:,
        profile_picture = :profile_picture:,
        gender = :gender:,
        birth_date = :birth_date:,
        bio = :bio:

        WHERE row_uuid = :dboy_row_uuid:
    ;`)
    fetch(full_name: string, profile_picture: string, gender: gender, birth_date: string, bio: string, dboy_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update theverification satatus */
export class update_dboy_verify extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE dboy
        SET

        is_verified = :is_verified:

        WHERE row_uuid = :dboy_row_uuid:
    ;`)
    fetch(dboy_row_uuid: string, is_verified: is_active) {
        return this.baseFetch(this.DBData);
    }
}

/** update the otp of the dboy */
export class update_dboy_otp extends BaseDao<IModificationDaoStatus> {
    @Query(`
        UPDATE dboy
        SET last_otp = :last_otp:
        WHERE row_uuid = :dboy_row_uuid:
    ;`)
    fetch(dboy_row_uuid: string, last_otp: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update dboy mobile */

/** update the otp of the dboy */
export class update_dboy_mobile extends BaseDao<IModificationDaoStatus> {
    @Query(`
        UPDATE dboy
        SET mobile_number = :mobile_number:
        WHERE row_uuid = :dboy_row_uuid:
    ;`)
    fetch(dboy_row_uuid: string, mobile_number: string) {
        return this.baseFetch(this.DBData);
    }
}

/**  fetch all the dboy with given mobile number , should return single dboy */
export class fetch_dboy_with_mobile extends BaseDao<IGetDBoy[]> {
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

/**
 *  Login the dboy
 * Sign up is only allowed by the partner of the owner
 * If you do not found the dboy with given mobile number then return the 'user not found err'
 */
export class auth_dboy extends TBaseDao<IGetDboyAuth> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string) {
        await this.openTransaction();

        try {
            const found_dboy = await new fetch_dboy_with_mobile(this.TDaoConfig).fetch(mobile_number.trim()).asyncData(this);
            if (found_dboy.length === 0) {
                throw new Error('user_not_found');
            }

            const dboy_detail = found_dboy[0];

            const otp_gen = generate_otp(5);
            if (mobile_number.toString().length === 10) {
                sendSMS(mobile_number.trim(), `OTP for the foodbzr login is ${otp_gen}`);
            }

            /** update otp */
            await new update_dboy_otp(this.TDaoConfig).fetch(dboy_detail.row_uuid, otp_gen).asyncData(this);

            /** send the otp and dboy_row_uuid and kitchen_row_uuid and_owner_row_uuid down */
            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                dboy_row_uuid: dboy_detail.row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                dboy_row_uuid: null,
            });
        }
    }
}

interface IGetDBoyVerifyOtp {
    is_err: boolean;
    error: string;
    dboy_row_uuid: string;
    kitchen_row_uuid: string;
}

/** verify the dboy otp */
export class update_dboy_verify_otp extends TBaseDao<IGetDBoyVerifyOtp> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(dboy_row_uuid: string, client_otp: string) {
        await this.openTransaction();

        try {
            /** extract the dboy info */
            const dboy_info = await new fetch_dboy_single(this.TDaoConfig).fetch(dboy_row_uuid).asyncData(this);
            if (dboy_info.length === 0) {
                throw new Error('user_not_found');
            }

            const dboy_data = dboy_info[0];

            /**  compare the client otp to the original otp */
            if (+client_otp !== +dboy_data.last_otp) {
                throw new Error('wrong_otp');
            }

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                dboy_row_uuid: dboy_row_uuid,
                kitchen_row_uuid: dboy_data.kitchen_row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                dboy_row_uuid: null,
                kitchen_row_uuid: null,
            });
        }
    }
}

interface IGetDBoyResendOtp {
    is_err: boolean;
    error: string;
    dboy_row_uuid: string;
}

/** resend the otp */
export class update_dboy_resend_otp extends TBaseDao<IGetDBoyResendOtp> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string, dboy_row_uuid: string) {
        await this.openTransaction();

        try {
            const dboy_info = await new fetch_dboy_single(this.TDaoConfig).fetch(dboy_row_uuid).asyncData(this);

            if (dboy_info.length === 0) {
                throw new Error('user_not_found');
            }

            const dboy_data = dboy_info[0];

            if (dboy_data.mobile_number !== mobile_number) {
                throw new Error('wrong_mobile_number');
            }

            /** update the otp */
            const otp_gen = generate_otp(5);
            if (mobile_number.toString().length === 10) {
                sendSMS(mobile_number.trim(), `OTP for the foodbzr login is ${otp_gen}`);
            }

            /** update otp */
            await new update_dboy_otp(this.TDaoConfig).fetch(dboy_data.row_uuid, otp_gen).asyncData(this);

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                dboy_row_uuid: dboy_data.row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                dboy_row_uuid: null,
            });
        }
    }
}
