/**
 * Fetch the order lifecycle
 */

import { IFetchOrderLifecycle, IGetOrder } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class fetch_order_lifecycle extends BaseDao<IFetchOrderLifecycle[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT lifecycle
        FROM order
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
 * Fetch the single order details
 */

export class fetch_order_single extends BaseDao<IGetOrder[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT 

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
        order_address_row_uuid,
        date_created,
        date_updated,
        row_uuid

        FROM order
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(order_row_uuid: string) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, lifecycle: JSON.parse(p.lifecycle as any) };
            }) as IGetOrder[]
        );
    }
}
