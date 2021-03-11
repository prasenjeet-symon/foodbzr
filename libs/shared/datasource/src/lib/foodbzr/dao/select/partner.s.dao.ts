/**
 * Fetch the partner with row_uuid
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetPartner, is_active } from '@foodbzr/shared/types';
import { media_server_url } from '@foodbzr/shared/util';

export class fetch_partner_single extends BaseDao<IGetPartner[]> {
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
        last_otp,
        date_created,
        row_uuid,
        can_add_kitchen

        FROM partner
        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(partner_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, profile_picture: p.profile_picture.includes('http') ? p.profile_picture : `${media_server_url}${p.profile_picture}` };
            })
        );
    }
}

/**
 * Get all partner of the given owner with owner_row_uuid
 * With filter active_status
 */

export class fetch_partners_of_owner extends BaseDao<IGetPartner[]> {
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
        row_uuid,
        can_add_kitchen

        FROM partner
        WHERE owner_row_uuid = :owner_row_uuid: AND is_active = :is_active:
    ;`)
    fetch(owner_row_uuid: string, is_active: is_active) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Fetch the partner otp
 * With partner row_uuid
 */

export class fetch_partner_otp extends BaseDao<{ last_otp: string }[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        last_otp

        FROM partner
        WHERE row_uuid = :partner_row_uuid:
    ;`)
    fetch(partner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 *  Fetch all partners of all owners
 */

export class fetch_partner_all extends BaseDao<IGetPartner[]> {
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
        row_uuid,
        can_add_kitchen

        FROM partner
    ;`)
    fetch() {
        return this.baseFetch(this.DBData);
    }
}

/** fetch the partner for the owner screen */

export class fetch_partner_for_owner extends BaseDao<IGetPartner[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        row_id,
        commission,
        owner_row_uuid,
        last_otp,
        is_active,
        is_verified,
        profile_picture,
        gender,
        full_name,
        mobile_number,
        bio,
        date_created,
        row_uuid,
        can_add_kitchen

        FROM partner
        WHERE owner_row_uuid = :owner_row_uuid:
    `)
    fetch(owner_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
