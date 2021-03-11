import { IGetOrder, IModificationDaoStatus, OrderMenu, pay_status, pay_type, PUSH_MESSAGE_TYPE } from '@foodbzr/shared/types';
import { get_initial_order_lifecycle, send_push_message_to_owner, send_push_message_to_partner, send_push_message_to_user } from '@foodbzr/shared/util';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { delete_user_cart } from '../delete/user_cart.d.dao';
import { fetch_order_single } from '../select/order.s.dao';
import { fetch_user_cart_for_checkout } from '../select/user_cart.s.dao';

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

/** make new order */
export class insert_order_take_order extends TBaseDao<IGetOrder[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(user_row_uuid: string, kitchen_row_uuid: string, pay_type: 'COD', order_address_row_uuid: string) {
        await this.openTransaction();

        try {
            const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            /** access the user carts */
            const user_cart = await new fetch_user_cart_for_checkout(this.TDaoConfig).fetch(user_row_uuid).asyncData(this);
            /** filter the data with given kitchen row uuid */
            if (user_cart.length === 0) {
                return;
            }
            const user_cart_kitchen = user_cart.filter((p) => p.kitchen.kitchen_row_uuid === kitchen_row_uuid);
            if (user_cart_kitchen.length === 0) {
                return;
            }

            const found_user_cart = user_cart_kitchen[0];

            const order_menu: OrderMenu[] = [];

            found_user_cart.orders.forEach((p) => {
                order_menu.push({
                    menu_row_name: p.menu_name,
                    menu_row_uuid: p.menu_row_uuid,
                    menu_size_variant_name: p.menu_variant_name,
                    menu_size_variant_row_uuid: p.menu_variant_row_uuid,
                    amount: p.user_cart_amount,
                    cooking_instruction: p.user_cart_instruction,
                    original_price: p.original_menu_price,
                    after_offer_price: p.final_price,
                    money_saved: p.amount_saved,
                    date_created: date_created,
                    row_uuid: uuid(),
                });
            });

            const empty_life_cycle = get_initial_order_lifecycle();

            /**  insert the order */
            const order_row_uuid: string = uuid();

            const inserted = await new insert_order(this.TDaoConfig)
                .fetch(
                    user_row_uuid,
                    found_user_cart.kitchen.kitchen_partner_row_uuid,
                    found_user_cart.kitchen.kitchen_row_uuid,
                    pay_type,
                    pay_type === 'COD' ? 'pending' : 'paid',
                    found_user_cart.final_calculation.amount_payable,
                    0,
                    found_user_cart.final_calculation.delivery_charge,
                    found_user_cart.final_calculation.total_amount_saved,
                    JSON.stringify(empty_life_cycle),
                    JSON.stringify(order_menu),
                    order_address_row_uuid,
                    date_created,
                    order_row_uuid
                )
                .asyncData(this);

            /** fetch the order details */
            const order_details = await new fetch_order_single(this.TDaoConfig).fetch(order_row_uuid).asyncData(this);
            /** del the user cart */
            for (const cart_item of found_user_cart.orders) {
                await new delete_user_cart(this.TDaoConfig).fetch(cart_item.user_cart_row_uuid).asyncData(this);
            }

            /** send the push message */
            /**
             * Send the push to user
             */
            (() => {
                const heading = `Order received`;
                const body = `Order with order id #${order_row_uuid} received by us. Thankyou for choosing us.`;
                const data = {
                    order_row_uuid: order_row_uuid,
                    type: PUSH_MESSAGE_TYPE.new_order,
                    kitchen_row_uuid: kitchen_row_uuid,
                    user_row_uuid: user_row_uuid,
                };
                const image_uri = 'https://img.freepik.com/free-vector/people-ordering-food-cafe-online_74855-5913.jpg?size=626&ext=jpg';
                send_push_message_to_user(this.TDaoConfig, user_row_uuid, heading, body, image_uri, data);
            })();

            (() => {
                const partner_row_uuid = found_user_cart.kitchen.kitchen_partner_row_uuid;
                const heading = `Order received`;
                const body = `New order with order id #${order_row_uuid} received by us.`;
                const data = {
                    order_row_uuid: order_row_uuid,
                    type: PUSH_MESSAGE_TYPE.new_order,
                    kitchen_row_uuid: kitchen_row_uuid,
                    user_row_uuid: user_row_uuid,
                };
                const image_uri = 'https://img.freepik.com/free-vector/people-ordering-food-cafe-online_74855-5913.jpg?size=626&ext=jpg';
                send_push_message_to_partner(this.TDaoConfig, partner_row_uuid, heading, body, image_uri, data);
            })();

            (() => {
                const owner_row_uuid = found_user_cart.kitchen.owner_row_uuid;
                const heading = `Order received`;
                const body = `New order with order id #${order_row_uuid} received by us.`;
                const data = {
                    order_row_uuid: order_row_uuid,
                    type: PUSH_MESSAGE_TYPE.new_order,
                    kitchen_row_uuid: kitchen_row_uuid,
                    user_row_uuid: user_row_uuid,
                };
                const image_uri = 'https://img.freepik.com/free-vector/people-ordering-food-cafe-online_74855-5913.jpg?size=626&ext=jpg';
                send_push_message_to_owner(this.TDaoConfig, owner_row_uuid, heading, body, image_uri, data);
            })();

            await this.closeTransaction();
            return this.baseFetch(order_details);
        } catch (error) {
            await this.rollback();
        }
    }
}
