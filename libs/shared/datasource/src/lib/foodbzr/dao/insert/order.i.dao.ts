import { IModificationDaoStatus, pay_status, pay_type } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

/**
 * Add new order
 */
export class insert_order extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        INSERT INTO food_order
        (
            user_row_uuid,
            partner_row_uuid,
            kitchen_row_uuid,
            pay_type,
            pay_status,
            amount_paid,
            bzrcoin_used,
            delivery_charge,
            user_saved_amount,
            lifecycle,
            order_menu,
            order_address_row_uuid,
            date_created,
            row_uuid
        )
        VALUES
        (
            :user_row_uuid:,
            :partner_row_uuid:,
            :kitchen_row_uuid:,
            :pay_type:,
            :pay_status:,
            :amount_paid:,
            :bzrcoin_used:,
            :delivery_charge:,
            :user_saved_amount:,
            :lifecycle:,
            :order_menu:,
            :order_address_row_uuid:,
            :date_created:,
            :row_uuid:
        )
    ;`)
    fetch(
        user_row_uuid: string,
        partner_row_uuid: string,
        kitchen_row_uuid: string,
        pay_type: pay_type,
        pay_status: pay_status,
        amount_paid: number,
        bzrcoin_used: number,
        delivery_charge: number,
        user_saved_amount: number,
        lifecycle: string,
        order_menu: string,
        order_address_row_uuid: string,
        date_created: string,
        row_uuid: string
    ) {
        return this.baseFetch(this.DBData);
    }
}
