/**
 * Fetch the food_order lifecycle
 */

import { delivery_status, IFetchOrderLifecycle, IGetOrder, IGetOrderOnWay, IGetOrderUser, IGetOrderStatus } from '@foodbzr/shared/types';
import { find_unique_items } from '@foodbzr/shared/util';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import * as moment from 'moment';

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
    
    kit.profile_picture as kitchen_profile_picture,
    kit.kitchen_name as kitchen_name,
    kit.owner_row_uuid as owner_row_uuid,
    
    fo.row_id,
    fo.user_row_uuid,
    fo.partner_row_uuid,
    fo.kitchen_location_row_uuid,
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

    ST_X(da.coordinate) as latitude, 
    ST_Y(da.coordinate) as longitude
    

    FROM food_order as fo
    LEFT OUTER JOIN dboy as db
    ON db.row_uuid = fo.dboy_row_uuid

    LEFT OUTER JOIN kitchen_location as kitl
    ON kitl.row_uuid = fo.kitchen_location_row_uuid

    LEFT OUTER JOIN kitchen as kit
    ON kit.row_uuid = kitl.kitchen_row_uuid

    LEFT OUTER JOIN delivery_address as da
    ON da.row_uuid = fo.order_address_row_uuid

    WHERE fo.row_uuid = :order_row_uuid:
    ;`)
    fetch(order_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, amount_paid: +p.amount_paid.toFixed(2), order_menu: JSON.parse(p.order_menu as any), lifecycle: JSON.parse(p.lifecycle as any) };
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
    
    kit.profile_picture as kitchen_profile_picture,
    kit.kitchen_name as kitchen_name,
    kit.owner_row_uuid as owner_row_uuid,
    
    fo.row_id,
    fo.user_row_uuid,
    fo.partner_row_uuid,
    fo.kitchen_location_row_uuid,
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
    
    ST_X(da.coordinate) as latitude, 
    ST_Y(da.coordinate) as longitude
    

    FROM food_order as fo
    LEFT OUTER JOIN dboy as db
    ON db.row_uuid = fo.dboy_row_uuid

    LEFT OUTER JOIN kitchen_location as kitl
    ON kitl.row_uuid = fo.kitchen_location_row_uuid

    LEFT OUTER JOIN kitchen as kit
    ON kit.row_uuid = kitl.kitchen_row_uuid

    LEFT OUTER JOIN delivery_address as da
    ON da.row_uuid = fo.order_address_row_uuid
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

export class fetch_order_status extends BaseDao<IGetOrderStatus[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        usr.full_name as user_full_name, 
        usr.mobile_number as user_mobile_number,
        usr.profile_picture as user_profile_picture,
        usr.gender as user_gender,

        kit.kitchen_name as kitchen_name,
        kit.profile_picture as kitchen_profile_picture,
        kit.street as kitchen_street,
        kit.pincode as kitchen_pincode,
        kit.city as kitchen_city,
        kit.state as kitchen_state,
        kit.country as kitchen_country,

        fo.row_id as food_order_row_id,
        fo.user_row_uuid as user_row_uuid, 
        fo.partner_row_uuid as partner_row_uuid,
        fo.kitchen_row_uuid as kitchen_row_uuid,
        fo.dboy_row_uuid as dboy_row_uuid,
        fo.order_address_row_uuid as order_address_row_uuid,

        fo.delivery_status as food_order_delivery_status,
        fo.pay_type as food_order_pay_type,
        fo.pay_status as food_order_pay_status,
        fo.otp as food_order_otp,
        fo.amount_paid as food_order_amount_paid, 
        fo.bzrcoin_used as food_order_bzrcoin_used,
        fo.delivery_charge as food_order_delivery_charge,
        fo.user_saved_amount as food_order_user_saved_amount,
        fo.lifecycle as food_order_lifecycle,
        fo.order_menu as food_order_order_menu,
        
        fo.date_created as food_order_date_created,
        fo.date_updated as food_order_date_updated,
        fo.row_uuid as food_order_row_uuid, 

        db.profile_picture as dboy_profile_picture,
        db.full_name as dboy_full_name,
        db.mobile_number as dboy_mobile_number,

        da.street as delivery_address_street,
        da.pincode as delivery_address_pincode,
        da.city as delivery_address_city,
        da.state as delivery_address_state,
        da.country as delivery_address_country,
        ST_X(da.coordinate) as delivery_address_latitude,
        ST_Y(da.coordinate) as delivery_address_longitude

        FROM food_order as fo
        LEFT OUTER JOIN dboy as db
        ON db.row_uuid = fo.dboy_row_uuid
        LEFT OUTER JOIN delivery_address as da
        ON da.row_uuid = fo.order_address_row_uuid
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = fo.kitchen_row_uuid
        LEFT OUTER JOIN user as usr
        ON usr.row_uuid = fo.user_row_uuid
        WHERE fo.delivery_status  = :delivery_status: AND fo.partner_row_uuid IN ( :partner_row_uuids: )
    ;`)
    fetch(delivery_status: delivery_status, partner_row_uuids: string[]) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return {
                    ...p,
                    food_order_order_menu: JSON.parse(p.food_order_order_menu as any),
                    food_order_lifecycle: JSON.parse(p.food_order_lifecycle as any),
                    kitchen_address: ` ${p.kitchen_street}, ${p.kitchen_city}, ${p.kitchen_pincode}, ${p.kitchen_state}, ${p.kitchen_country} `,
                    delivery_address: `${p.delivery_address_street}, ${p.delivery_address_city}, ${p.delivery_address_pincode}, ${p.delivery_address_state}, ${p.delivery_address_country}`,
                };
            }) as IGetOrderStatus[]
        );
    }
}

/** get the food order detail page for the user */
export class fetch_order_status_for_user extends BaseDao<IGetOrderStatus[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        usr.full_name as user_full_name, 
        usr.mobile_number as user_mobile_number,
        usr.profile_picture as user_profile_picture,
        usr.gender as user_gender,

        kit.kitchen_name as kitchen_name,
        kit.profile_picture as kitchen_profile_picture,
        kit.street as kitchen_street,
        kit.pincode as kitchen_pincode,
        kit.city as kitchen_city,
        kit.state as kitchen_state,
        kit.country as kitchen_country,

        fo.row_id as food_order_row_id,
        fo.user_row_uuid as user_row_uuid, 
        fo.partner_row_uuid as partner_row_uuid,
        fo.kitchen_row_uuid as kitchen_row_uuid,
        fo.dboy_row_uuid as dboy_row_uuid,
        fo.order_address_row_uuid as order_address_row_uuid,

        fo.delivery_status as food_order_delivery_status,
        fo.pay_type as food_order_pay_type,
        fo.pay_status as food_order_pay_status,
        fo.otp as food_order_otp,
        fo.amount_paid as food_order_amount_paid, 
        fo.bzrcoin_used as food_order_bzrcoin_used,
        fo.delivery_charge as food_order_delivery_charge,
        fo.user_saved_amount as food_order_user_saved_amount,
        fo.lifecycle as food_order_lifecycle,
        fo.order_menu as food_order_order_menu,
        
        fo.date_created as food_order_date_created,
        fo.date_updated as food_order_date_updated,
        fo.row_uuid as food_order_row_uuid, 

        db.profile_picture as dboy_profile_picture,
        db.full_name as dboy_full_name,
        db.mobile_number as dboy_mobile_number,

        da.street as delivery_address_street,
        da.pincode as delivery_address_pincode,
        da.city as delivery_address_city,
        da.state as delivery_address_state,
        da.country as delivery_address_country,
        ST_X(da.coordinate) as delivery_address_latitude,
        ST_Y(da.coordinate) as delivery_address_longitude
       

        FROM food_order as fo
        LEFT OUTER JOIN dboy as db
        ON db.row_uuid = fo.dboy_row_uuid
        LEFT OUTER JOIN delivery_address as da
        ON da.row_uuid = fo.order_address_row_uuid
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = fo.kitchen_row_uuid
        LEFT OUTER JOIN user as usr
        ON usr.row_uuid = fo.user_row_uuid
        WHERE fo.row_uuid = :order_row_uuid:
    ;`)
    fetch(order_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return {
                    ...p,
                    food_order_order_menu: JSON.parse(p.food_order_order_menu as any),
                    food_order_lifecycle: JSON.parse(p.food_order_lifecycle as any),
                    kitchen_address: ` ${p.kitchen_street}, ${p.kitchen_city}, ${p.kitchen_pincode}, ${p.kitchen_state}, ${p.kitchen_country} `,
                    delivery_address: `${p.delivery_address_street}, ${p.delivery_address_city}, ${p.delivery_address_pincode}, ${p.delivery_address_state}, ${p.delivery_address_country}`,
                };
            }) as IGetOrderStatus[]
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
        ST_X(da.coordinate) as latitude, 
        ST_Y(da.coordinate) as longitude, 
        da.street as street,
        da.city as city,
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
                return {
                    ...p,
                    amount_paid: p.amount_paid ? +p.amount_paid.toFixed(2) : p.amount_paid,
                    user_saved_amount: p.user_saved_amount ? +p.user_saved_amount.toFixed(2) : p.user_saved_amount,
                    order_menu: JSON.parse(p.order_menu as any),
                    lifecycle: JSON.parse(p.lifecycle as any),
                    delivery_address: `${p.street}, ${p.city}, ${p.pincode}, ${p.state}, ${p.country}`,
                };
            }) as IGetOrderOnWay[]
        );
    }
}

/** get the orders of the users */
export class fetch_order_of_user extends BaseDao<IGetOrderUser[]> {
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
        WHERE user_row_uuid = :user_row_uuid:
        AND DATE(date_created) >= :start_date: 
        AND DATE(date_created) <= :end_date:
    ;`)
    fetch(user_row_uuid: string, start_date: string, end_date: string) {
        /** group the order in dates */
        const maped_version = ((this.DBData as unknown) as IGetOrder[]).map((p) => {
            return {
                ...p,
                order_menu: JSON.parse(p.order_menu as any),
                lifecycle: JSON.parse(p.lifecycle as any),
                amount_paid: +p.amount_paid.toFixed(2),
                group_date: moment(new Date(p.date_created)).format('YYYY-MM'),
            };
        });

        const unique_dates = find_unique_items(maped_version, 'group_date');
        const final_data: IGetOrderUser[] = [];

        unique_dates.forEach((p) => {
            const found_items = maped_version.filter((s) => s.group_date === p.group_date);
            final_data.push({
                date: p.group_date,
                data: found_items,
            });
        });

        return this.baseFetch(final_data);
    }
}

/**  get the dboy order report --> delivered + canceled */

export class fetch_order_dboy_report extends BaseDao<IGetOrder[]> {
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
        WHERE dboy_row_uuid = :dboy_row_uuid: 
        AND ( delivery_status = 'delivered' OR delivery_status = 'canceled' ) 
        AND DATE(date_created) >= :start_date: AND DATE(date_created) <= :end_date:
    ;`)
    fetch(dboy_row_uuid: string, start_date: string, end_date: string) {
        const maped_version = this.DBData.map((p) => {
            return {
                ...p,
                order_menu: JSON.parse(p.order_menu as any),
                lifecycle: JSON.parse(p.lifecycle as any),
                amount_paid: +p.amount_paid.toFixed(2),
                group_date: moment(new Date(p.date_created)).format('YYYY-MM-DD'),
            };
        });
        return this.baseFetch(maped_version);
    }
}

/** search the order for the partners */

export class fetch_order_search_partner extends BaseDao<IGetOrderStatus[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

        usr.full_name as user_full_name, 
        usr.mobile_number as user_mobile_number,
        usr.profile_picture as user_profile_picture,
        usr.gender as user_gender,

        kit.kitchen_name as kitchen_name,
        kit.profile_picture as kitchen_profile_picture,
        kit.street as kitchen_street,
        kit.pincode as kitchen_pincode,
        kit.city as kitchen_city,
        kit.state as kitchen_state,
        kit.country as kitchen_country,

        fo.row_id as food_order_row_id,
        fo.user_row_uuid as user_row_uuid, 
        fo.partner_row_uuid as partner_row_uuid,
        fo.kitchen_row_uuid as kitchen_row_uuid,
        fo.dboy_row_uuid as dboy_row_uuid,
        fo.order_address_row_uuid as order_address_row_uuid,

        fo.delivery_status as food_order_delivery_status,
        fo.pay_type as food_order_pay_type,
        fo.pay_status as food_order_pay_status,
        fo.otp as food_order_otp,
        fo.amount_paid as food_order_amount_paid, 
        fo.bzrcoin_used as food_order_bzrcoin_used,
        fo.delivery_charge as food_order_delivery_charge,
        fo.user_saved_amount as food_order_user_saved_amount,
        fo.lifecycle as food_order_lifecycle,
        fo.order_menu as food_order_order_menu,
        
        fo.date_created as food_order_date_created,
        fo.date_updated as food_order_date_updated,
        fo.row_uuid as food_order_row_uuid, 

        db.profile_picture as dboy_profile_picture,
        db.full_name as dboy_full_name,
        db.mobile_number as dboy_mobile_number,

        da.street as delivery_address_street,
        da.pincode as delivery_address_pincode,
        da.city as delivery_address_city,
        da.state as delivery_address_state,
        da.country as delivery_address_country,
        ST_X(da.coordinate) as delivery_address_latitude,
        ST_Y(da.coordinate) as delivery_address_longitude


        FROM food_order as fo
        LEFT OUTER JOIN dboy as db
        ON db.row_uuid = fo.dboy_row_uuid
        LEFT OUTER JOIN delivery_address as da
        ON da.row_uuid = fo.order_address_row_uuid
        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = fo.kitchen_row_uuid
        LEFT OUTER JOIN user as usr
        ON usr.row_uuid = fo.user_row_uuid
        WHERE ( fo.delivery_status = 'canceled' OR fo.delivery_status = 'delivered' ) AND fo.partner_row_uuid = :partner_row_uuid: AND fo.row_id = :order_id:
    ;`)
    fetch(partner_row_uuid: string, order_id: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return {
                    ...p,
                    food_order_order_menu: JSON.parse(p.food_order_order_menu as any),
                    food_order_lifecycle: JSON.parse(p.food_order_lifecycle as any),
                    kitchen_address: ` ${p.kitchen_street}, ${p.kitchen_city}, ${p.kitchen_pincode}, ${p.kitchen_state}, ${p.kitchen_country} `,
                    delivery_address: `${p.delivery_address_street}, ${p.delivery_address_city}, ${p.delivery_address_pincode}, ${p.delivery_address_state}, ${p.delivery_address_country}`,
                };
            }) as IGetOrderStatus[]
        );
    }
}

/** get the order report for the kitchen of the partner */

export class fetch_order_kitchen_report extends BaseDao<IGetOrder[]> {
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
        WHERE kitchen_row_uuid = :kitchen_row_uuid: 
        AND ( delivery_status = 'delivered' OR delivery_status = 'canceled' ) 
        AND DATE(date_created) >= :start_date: AND DATE(date_created) <= :end_date:
    ;`)
    fetch(kitchen_row_uuid: string, start_date: string, end_date: string) {
        const maped_version = this.DBData.map((p) => {
            return {
                ...p,
                order_menu: JSON.parse(p.order_menu as any),
                lifecycle: JSON.parse(p.lifecycle as any),
                amount_paid: +p.amount_paid.toFixed(2),
                group_date: moment(new Date(p.date_created)).format('YYYY-MM-DD'),
            };
        });
        return this.baseFetch(maped_version);
    }
}

/** get the order report for the kitchen of the partner */

export class fetch_order_partner_report extends BaseDao<IGetOrder[]> {
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
        WHERE partner_row_uuid = :partner_row_uuid: 
        AND ( delivery_status = 'delivered' OR delivery_status = 'canceled' ) 
        AND DATE(date_created) >= :start_date: AND DATE(date_created) <= :end_date:
    ;`)
    fetch(partner_row_uuid: string, start_date: string, end_date: string) {
        const maped_version = this.DBData.map((p) => {
            return {
                ...p,
                order_menu: JSON.parse(p.order_menu as any),
                lifecycle: JSON.parse(p.lifecycle as any),
                amount_paid: +p.amount_paid.toFixed(2),
                group_date: moment(new Date(p.date_created)).format('YYYY-MM-DD'),
            };
        });
        return this.baseFetch(maped_version);
    }
}
