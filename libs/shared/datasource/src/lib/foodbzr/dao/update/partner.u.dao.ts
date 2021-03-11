/**
 * Update the otp
 * Partner is trying to login
 */

import { gender, IGetPartner, IModificationDaoStatus, is_active } from '@foodbzr/shared/types';
import { generate_otp, sendSMS } from '@foodbzr/shared/util';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { fetch_owner_all } from '../select/owner.s.dao';
import { fetch_partner_otp, fetch_partner_single } from '../select/partner.s.dao';

export class update_partner_otp extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner
        SET last_otp = :otp:
        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(partner_row_uuid: string, otp: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Update the partner information
 */

export class update_partner extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner

        SET 
        profile_picture = :profile_picture:,
        gender = :gender:,
        full_name = :full_name:,
        bio = :bio:

        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(profile_picture: string, gender: gender, full_name: string, bio: string, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

export class update_partner_mobile extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner
        SET mobile_number = :mobile_number:
        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(mobile_number: string, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Update the mobile number
 * This is transaction dao
 * First verify the otp , if the otp is correct then
 * Make the otp null and change the Mobile number
 *
 */

export class update_partner_mobile_number extends TBaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    async fetch(partner_row_uuid: string, received_otp: string, final_mobile_number: string) {
        await this.openTransaction();

        try {
            /** Read the otp from the partner table */
            const partner_otp = await new fetch_partner_otp(this.TDaoConfig).fetch(partner_row_uuid).asyncData();

            if (partner_otp.length === 0) {
                throw new Error('no partner found');
            }

            const otp = +partner_otp[0].last_otp;
            if (otp === +received_otp) {
                /** Otp do matched */
                /** Change the mobile number */
                await new update_partner_mobile(this.TDaoConfig).fetch(final_mobile_number, partner_row_uuid).asyncData();
            }

            await this.closeTransaction();
            return this.baseFetch({});
        } catch (error) {
            await this.rollback();
        }
    }
}

/** update bio */
export class update_partner_bio extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner
        SET bio = :bio:
        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(bio: string, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update name */
export class update_partner_name extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner
        SET full_name = :full_name:
        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(full_name: string, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update gender */
export class update_partner_gender extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner

        SET 
        gender = :gender:

        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(gender: gender, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update partner verification status */
export class update_partner_verification_status extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner

        SET 
        is_verified = :is_verified:

        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(is_verified: is_active, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** update the partner commission */
export class update_partner_commision extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner

        SET 
        commission = :commission:

        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(commission: number, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** auth */
/**
 *
 *
 *
 */
/** search the partner with given mobile number */
class fetch_partner_with_mobile_number extends BaseDao<IGetPartner[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        owner_row_uuid,
        is_active,
        profile_picture,
        gender,
        full_name,
        mobile_number,
        bio,
        date_created,
        row_uuid

        FROM partner
        WHERE mobile_number = :mobile_number:
    ;`)
    fetch(mobile_number: string) {
        return this.baseFetch(this.DBData);
    }
}

/** create new partner with given mobile number */
class insert_partner_with_mobile extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO partner
        (
            mobile_number,
            date_created,
            row_uuid,
            owner_row_uuid,
            last_otp
        )
        VALUES
        (
            :mobile_number:
            :date_created:
            :row_uuid:
            :owner_row_uuid:,
            :last_otp:
        )
    ;`)
    fetch(mobile_number: string, date_created: string, row_uuid: string, owner_row_uuid: string, last_otp: string) {
        return this.baseFetch(this.DBData);
    }
}

interface IGetPartnerAuth {
    is_err: boolean;
    error: string;
    partner_row_uuid: string;
    owner_row_uuid: string;
}

export class update_partner_auth extends TBaseDao<IGetPartnerAuth> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string) {
        await this.openTransaction();

        try {
            mobile_number = mobile_number.toString().trim();
            /** try to find the partner with given mobile number */
            const date_created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const found_partner = await new fetch_partner_with_mobile_number(this.TDaoConfig).fetch(mobile_number).asyncData(this);

            if (found_partner.length === 0) {
                /** fetch the owner */
                const all_owner = await new fetch_owner_all(this.TDaoConfig).fetch().asyncData(this);
                if (all_owner.length === 0) {
                    throw new Error('owner_not_found');
                }

                const owner_data = all_owner[0];
                /** create the new partner with given mobile number */
                const partner_row_uuid = uuid();
                const otp_gen = generate_otp(5);

                if (mobile_number.toString().length === 10) {
                    sendSMS(mobile_number.trim(), `OTP for the foodbzr login is ${otp_gen}`);
                }

                await new insert_partner_with_mobile(this.TDaoConfig).fetch(mobile_number, date_created, partner_row_uuid, owner_data.row_uuid, otp_gen).asyncData(this);

                /** return the data */
                await this.closeTransaction();
                return this.baseFetch({
                    is_err: false,
                    error: null,
                    partner_row_uuid: partner_row_uuid,
                    owner_row_uuid: owner_data.row_uuid,
                });
            }

            const partner_data = found_partner[0];
            /** found the partner */
            /** update the otp */
            const otp_gen = generate_otp(5);

            if (mobile_number.toString().length === 10) {
                sendSMS(mobile_number.trim(), `OTP for the foodbzr login is ${otp_gen}`);
            }

            await new update_partner_otp(this.TDaoConfig).fetch(partner_data.row_uuid, otp_gen).asyncData(this);

            /** return the data */

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                partner_row_uuid: partner_data.row_uuid,
                owner_row_uuid: partner_data.owner_row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                partner_row_uuid: null,
                owner_row_uuid: null,
            });
        }
    }
}

/** verify the opt */

interface IGetPartnerVerifyOTP {
    is_err: boolean;
    error: string;
    partner_row_uuid: string;
    owner_row_uuid: string;
}

export class update_partner_verify_otp extends TBaseDao<IGetPartnerVerifyOTP> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(mobile_number: string, partner_row_uuid: string, client_otp: string) {
        await this.openTransaction();

        try {
            mobile_number = mobile_number.toString().trim();
            const found_partner = await new fetch_partner_single(this.TDaoConfig).fetch(partner_row_uuid).asyncData(this);
            if (found_partner.length === 0) {
                throw new Error('user_not_found');
            }

            const partner_data = found_partner[0];

            console.log(partner_row_uuid, client_otp, partner_data.last_otp);

            if (+client_otp !== +partner_data.last_otp) {
                throw new Error('wrong_otp');
            }

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                partner_row_uuid: partner_data.row_uuid,
                owner_row_uuid: partner_data.owner_row_uuid,
            });
        } catch (error) {
            console.log(error, 'hey');
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                partner_row_uuid: null,
                owner_row_uuid: null,
            });
        }
    }
}

/** resend the otp */
interface IGetPartnerResendOTP {
    is_err: boolean;
    error: string;
    partner_row_uuid: string;
}

export class update_partner_resend_otp extends TBaseDao<IGetPartnerResendOTP> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(partner_row_uuid: string, mobile_number: string) {
        await this.openTransaction();

        try {
            mobile_number = mobile_number.toString().trim();
            /** fetch the partner details */
            const found_partner = await new fetch_partner_single(this.TDaoConfig).fetch(partner_row_uuid).asyncData(this);
            if (found_partner.length === 0) {
                throw new Error('user_not_found');
            }

            const partner_data = found_partner[0];

            if (partner_data.mobile_number !== mobile_number) {
                throw new Error('wrong_mobile_number');
            }

            /** send the otp and update the DB */
            const otp_gen = generate_otp(5);
            if (mobile_number.toString().length === 10) {
                sendSMS(mobile_number.trim(), `OTP for the foodbzr login is ${otp_gen}`);
            }

            await new update_partner_otp(this.TDaoConfig).fetch(partner_row_uuid, otp_gen).asyncData(this);

            await this.closeTransaction();
            return this.baseFetch({
                is_err: false,
                error: null,
                partner_row_uuid: partner_data.row_uuid,
                owner_row_uuid: partner_data.owner_row_uuid,
            });
        } catch (error) {
            await this.rollback();
            return this.baseFetch({
                is_err: true,
                error: error,
                partner_row_uuid: null,
                owner_row_uuid: null,
            });
        }
    }
}

/** update the partner permission */
export class update_partner_permission extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE partner
        SET
        can_add_kitchen = :can_add_kitchen:
        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(can_add_kitchen: is_active, partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
