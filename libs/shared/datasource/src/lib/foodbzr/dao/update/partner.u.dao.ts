/**
 * Update the otp
 * Partner is trying to login
 */

import { gender, IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query, TBaseDao } from '@sculify/node-room';
import { fetch_partner_otp } from '../select/partner.s.dao';

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

class update_partner_mobile extends BaseDao<IModificationDaoStatus> {
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

        SET 
        bio = :bio:

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

        SET 
        full_name = :full_name:

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
