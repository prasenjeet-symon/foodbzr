/**
 * Add the new otp to the owner
 * Owner is trying to login
 * This OTP will never delete once used then get deleted
 */

import { IGetOwner, IModificationDaoStatus } from '@foodbzr/shared/types';
import { generate_otp, sendSMS } from '@foodbzr/shared/util';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import { fetch_owner_all } from '../select/owner.s.dao';

export class update_owner_otp extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE owner
        SET last_otp = :otp:
        WHERE row_uuid = :owner_row_uuid:
     ;`)
    fetch(otp: string, owner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update the owner bio */

export class update_owner_bio extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE owner
        SET bio = :bio:
        WHERE row_uuid = :owner_row_uuid:
     ;`)
    fetch(bio: string, owner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update owner name */

export class update_owner_name extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE owner
        SET full_name = :full_name:
        WHERE row_uuid = :owner_row_uuid:
     ;`)
    fetch(full_name: string, owner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update gender */

export class update_owner_gender extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE owner
        SET gender = :gender:
        WHERE row_uuid = :owner_row_uuid:
     ;`)
    fetch(gender: string, owner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

export class update_owner_mobile extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE owner
        SET mobile_number = :mobile_number:
        WHERE row_uuid = :owner_row_uuid:
     ;`)
    fetch(owner_row_uuid: string, mobile_number: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * owner auth
 */
/**
 *
 *
 *
 *
 */

class fetch_owner_with_mobile extends BaseDao<IGetOwner[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        mobile_number,
        full_name,
        bio,
        gender,
        last_otp,
        profile_picture,
        is_active,
        date_created,
        date_updated,
        row_uuid

        FROM owner
        WHERE mobile_number = :mobile_number:
    ;`)
    fetch(mobile_number: string) {
        return this.baseFetch(this.DBData);
    }
}

/** auth the owner */

interface IGetOwnerAuth {
    is_err: boolean;
    error: string;
    owner_row_uuid: string;
}

export class update_owner_auth extends TBaseDao<IGetOwnerAuth> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string) {
        await this.openTransaction();

        try {
            mobile_number = mobile_number.toString().trim();

            const found_owner = await new fetch_owner_with_mobile(this.TDaoConfig).fetch(mobile_number).asyncData(this);

            if (found_owner.length === 0) {
                throw new Error('Owner not found');
            }

            const owner_data = found_owner[0];

            /** update the otp */
            const gen_otp = generate_otp(5);
            if (mobile_number.length === 10) {
                sendSMS(mobile_number, `OTP for the foodbzr login is ${gen_otp}`);
            }

            await new update_owner_otp(this.TDaoConfig).fetch(gen_otp, owner_data.row_uuid).asyncData(this);

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                owner_row_uuid: owner_data.row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                owner_row_uuid: null,
            });
        }
    }
}

/** verify the otp */

interface IGetOwnerVerifyOTP {
    is_err: boolean;
    error: string;
    owner_row_uuid: string;
}

export class update_owner_verify_otp extends TBaseDao<IGetOwnerVerifyOTP> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(owner_row_uuid: string, client_otp: string) {
        await this.openTransaction();

        try {
            const found_owner = await new fetch_owner_all(this.TDaoConfig).fetch().asyncData(this);
            if (found_owner.length === 0) {
                throw new Error('user_not_found');
            }

            const owner_data = found_owner[0];
            if (+client_otp !== +owner_data.last_otp) {
                throw new Error('wrong_otp');
            }

            /** ok otp */
            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                owner_row_uuid: owner_data.row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                owner_row_uuid: null,
            });
        }
    }
}

/**
 * resend the otp
 */

interface IGetOwnerResendOTP {
    is_err: boolean;
    error: string;
    owner_row_uuid: string;
}

export class update_owner_resend_otp extends TBaseDao<IGetOwnerResendOTP> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string, owner_row_uuid: string) {
        await this.openTransaction();


        try {
            mobile_number = mobile_number.toString().trim()
            
            /** fetch the owenr data */
            const found_owner = await new fetch_owner_all(this.TDaoConfig).fetch().asyncData(this);
            if (found_owner.length === 0) {
                throw new Error('user_not_found');
            }

            const owner_data = found_owner[0];

            if (owner_data.mobile_number !== mobile_number) {
                throw new Error('wrong_mobile_number');
            }

            /** update the otp */
            const otp_gen = generate_otp(5);
            if (mobile_number.toString().length === 10) {
                sendSMS(mobile_number.trim(), `OTP for the foodbzr login is ${otp_gen}`);
            }

            await new update_owner_otp(this.TDaoConfig).fetch(otp_gen, owner_row_uuid).asyncData(this);

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                owner_row_uuid: owner_data.row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                owner_row_uuid: null,
            });
        }
    }
}
