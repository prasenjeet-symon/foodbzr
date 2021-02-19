/**
 * Fetch the food_order lifecycle
 */

import { delivery_status, IFetchOrderLifecycle, IGetOrder, IGetOrderOnWay } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class fetch_order_lifecycle extends BaseDao<IFetchOrderLifecycle[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT lifecycle
        FROM food_order
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(order_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, lifecycle: JSON.parse(p.lifecycle as any) };
            }) as IFetchOrderLifecycle[]
        );
    }
}

/**
 * Fetch the single food_order details
 */

export class fetch_order_single extends BaseDao<IGetOrder[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 
        row_id,
        user_row_uuid,
        partner_row_uuid,
        kitchen_row_uuid,
        dboy_row_uuid,
        delivery_status,
        pay_type,
        pay_status,
        otp,
        amount_paid,
        bzrcoin_used,
        delivery_charge,
        user_saved_amount,
        lifecycle,
        order_menu,
        order_address_row_uuid,
        date_created,
        date_updated,
        row_uuid

        FROM food_order
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(order_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, order_menu: JSON.parse(p.order_menu as any), lifecycle: JSON.parse(p.lifecycle as any) };
            }) as IGetOrder[]
        );
    }
}

/** fetch the order all */
export class fetch_order_all extends BaseDao<IGetOrder[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 
        row_id,
        user_row_uuid,
        partner_row_uuid,
        kitchen_row_uuid,
        dboy_row_uuid,
        delivery_status,
        pay_type,
        pay_status,
        otp,
        amount_paid,
        bzrcoin_used,
        delivery_charge,
        user_saved_amount,
        lifecycle,
        order_menu,
        order_address_row_uuid,
        date_created,
        date_updated,
        row_uuid

        FROM food_order
    ;`)
    fetch() {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, order_menu: JSON.parse(p.order_menu as any), lifecycle: JSON.parse(p.lifecycle as any) };
            }) as IGetOrder[]
        );
    }
}

/**
 * Get the pending orders
 */

export class fetch_order_status extends BaseDao<IGetOrder[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 
        fo.row_id,
        fo.user_row_uuid,
        fo.partner_row_uuid,
        fo.kitchen_row_uuid,
        fo.dboy_row_uuid,
        fo.delivery_status,
        fo.pay_type,
        fo.pay_status,
        fo.otp,
        fo.amount_paid,
        fo.bzrcoin_used,
        fo.delivery_charge,
        fo.user_saved_amount,
        fo.lifecycle,
        fo.order_menu,
        fo.order_address_row_uuid,
        fo.date_created,
        fo.date_updated,
        fo.row_uuid,
        db.profile_picture,
        db.full_name,
        db.mobile_number,
        da.latitude,
        da.longitude

        FROM food_order as fo
        LEFT OUTER JOIN dboy as db
        ON db.row_uuid = fo.dboy_row_uuid
        LEFT OUTER JOIN delivery_address as da
        ON da.row_uuid = fo.order_address_row_uuid
        WHERE fo.delivery_status = :delivery_status: AND fo.partner_row_uuid = :partner_row_uuid:
    ;`)
    fetch(delivery_status: delivery_status, partner_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, order_menu: JSON.parse(p.order_menu as any), lifecycle: JSON.parse(p.lifecycle as any) };
            }) as IGetOrder[]
        );
    }
}

/** get all the pending orders of the dboy */
export class fetch_order_pending_dboy extends BaseDao<IGetOrder[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        row_id,
        user_row_uuid,
        partner_row_uuid,
        kitchen_row_uuid,
        dboy_row_uuid,
        delivery_status,
        pay_type,
        pay_status,
        otp,
        amount_paid,
        bzrcoin_used,
        delivery_charge,
        user_saved_amount,
        lifecycle,
        order_menu,
        order_address_row_uuid,
        date_created,
        date_updated,
        row_uuid

        FROM food_order 
        WHERE delivery_status = 'cooking' AND dboy_row_uuid = :dboy_row_uuid:
    ;`)
    fetch(dboy_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, order_menu: JSON.parse(p.order_menu as any), lifecycle: JSON.parse(p.lifecycle as any) };
            }) as IGetOrder[]
        );
    }
}

/** get all the picked up orders of the dboy */
export class fetch_order_on_way_dboy extends BaseDao<IGetOrderOnWay[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT
        us.full_name as user_full_name,
        us.mobile_number as user_mobile_number,
        us.profile_picture as user_profile_picture,

        fo.row_id as row_id,
        fo.user_row_uuid as user_row_uuid,
        fo.partner_row_uuid as partner_row_uuid,
        fo.kitchen_row_uuid as kitchen_row_uuid,
        fo.dboy_row_uuid as dboy_row_uuid,
        fo.delivery_status as delivery_status,
        fo.pay_type as pay_type,
        fo.pay_status as pay_status,
        fo.otp as otp,
        fo.amount_paid as amount_paid,
        fo.bzrcoin_used as bzrcoin_used,
        fo.delivery_charge as delivery_charge,
        fo.user_saved_amount as user_saved_amount,
        fo.lifecycle as lifecycle,
        fo.order_menu as order_menu,
        fo.order_address_row_uuid as order_address_row_uuid,
        fo.date_created as date_created,
        fo.date_updated as date_updated,
        fo.row_uuid as row_uuid,
        db.profile_picture as dboy_profile_picture,
        db.full_name as dboy_full_name,
        db.mobile_number as dboy_mobile_number,
        da.latitude as latitude,
        da.longitude as longitude, 
        da.street as street,
        da.pincode as pincode,
        da.state as state,
        da.country as country

        FROM food_order as fo
        LEFT OUTER JOIN user as us
        ON us.row_uuid = fo.user_row_uuid
        LEFT OUTER JOIN dboy as db
        ON db.row_uuid = fo.dboy_row_uuid
        LEFT OUTER JOIN delivery_address as da
        ON da.row_uuid = fo.order_address_row_uuid
        WHERE fo.delivery_status = 'on_way' AND fo.dboy_row_uuid = :dboy_row_uuid:
    ;`)
    fetch(dboy_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, order_menu: JSON.parse(p.order_menu as any), lifecycle: JSON.parse(p.lifecycle as any) };
            }) as IGetOrderOnWay[]
        );
    }
}
