/**
 * Add otp
 * This will be added once the order is confirmed
 */

import { delivery_status, IModificationDaoStatus, order_lifecycle_state, pay_status, PUSH_MESSAGE_TYPE } from '@foodbzr/shared/types';
import { generate_otp, send_push_message_to_dboy, send_push_message_to_owner, send_push_message_to_partner, send_push_message_to_user } from '@foodbzr/shared/util';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import * as moment from 'moment';
import { fetch_order_single } from '../select/order.s.dao';

export class update_order_add_otp extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE food_order
        SET otp = :otp:
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(otp: string, order_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Change the order lifecycle
 */

export class update_order_lifecycle extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE food_order
        SET lifecycle = :lifecycle:
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(lifecycle: string, order_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Update the pay status of the order
 */

export class update_order_pay_status extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE food_order
        SET pay_status = :pay_status:
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(pay_status: pay_status, order_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 *  Update delivery_status
 */

export class update_order_delivery_status extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE food_order
        SET delivery_status = :delivery_status:
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(delivery_status: delivery_status, order_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 *  Assign the dboy to the order
 */

export class update_order_assign_dboy extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE food_order
        SET dboy_row_uuid = :dboy_row_uuid:
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(dboy_row_uuid: string, order_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 * Remove the dboy from the order
 * Because the dboy refused to take the order
 */
export class update_order_remove_dboy extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE food_order
        SET dboy_row_uuid = NULL
        WHERE row_uuid = :order_row_uuid:
    ;`)
    fetch(order_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/**
 *  Update the order lifecycle transaction mode
 */
export class update_t_order_lifecycle extends TBaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @TQuery()
    async fetch(order_lifecycle_type: order_lifecycle_state, order_row_uuid: string) {
        await this.openTransaction();
        /**
         *
         *
         */
        try {
            // console.log('inside the transaction', order_lifecycle_type);

            const date_current = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            /**
             *
             * Fetch the order details
             *
             */
            const order_details = await new fetch_order_single(this.TDaoConfig).fetch(order_row_uuid).asyncData(this);
            if (order_details.length === 0) {
                throw new Error('order not found');
            }

            const order_detail = order_details[0];
            const order_lifecycle_array = order_detail.lifecycle;
            /** helper functions */
            /**
             *
             *
             *
             *
             */
            const order_placed = async () => {
                order_lifecycle_array.forEach((p) => {
                    if (p.name === 'order placed') {
                        p.is_done = true;
                        p.date_created = date_current;
                        p.date_updated = date_current;
                    }
                });

                await new update_order_lifecycle(this.TDaoConfig).fetch(JSON.stringify(order_lifecycle_array), order_row_uuid).asyncData(this);
                /** update the delivery status */
                await new update_order_delivery_status(this.TDaoConfig).fetch('placed', order_row_uuid).asyncData(this);
            };
            /**
             *
             */
            const confirm_order = async () => {
                /** update the order lifecycle with order_confiremed */
                order_lifecycle_array.forEach((p) => {
                    if (p.name === 'order confirmed') {
                        p.is_done = true;
                        p.date_created = date_current;
                        p.date_updated = date_current;
                    }
                });

                await new update_order_lifecycle(this.TDaoConfig).fetch(JSON.stringify(order_lifecycle_array), order_row_uuid).asyncData(this);
                /** generate the otp  for the oder*/
                await new update_order_add_otp(this.TDaoConfig).fetch(generate_otp(5), order_row_uuid).asyncData(this);
                /** update the delivery status */
                await new update_order_delivery_status(this.TDaoConfig).fetch('confirmed', order_row_uuid).asyncData(this);
            };
            /**
             *
             */
            const cooking_order = async () => {
                /** update the order lifecycle with order_confiremed */
                order_lifecycle_array.forEach((p) => {
                    if (p.name === 'cooking') {
                        p.is_done = true;
                        p.date_created = date_current;
                        p.date_updated = date_current;
                    }
                });

                await new update_order_lifecycle(this.TDaoConfig).fetch(JSON.stringify(order_lifecycle_array), order_row_uuid).asyncData(this);
                /** update the delivery status */
                await new update_order_delivery_status(this.TDaoConfig).fetch('cooking', order_row_uuid).asyncData(this);
            };
            /**
             *
             */
            const order_on_way = async () => {
                /** update the order lifecycle with order_confiremed */
                order_lifecycle_array.forEach((p) => {
                    if (p.name === 'order on its way') {
                        p.is_done = true;
                        p.date_created = date_current;
                        p.date_updated = date_current;
                    }
                });

                await new update_order_lifecycle(this.TDaoConfig).fetch(JSON.stringify(order_lifecycle_array), order_row_uuid).asyncData(this);
                /** update the delivery status */
                await new update_order_delivery_status(this.TDaoConfig).fetch('on_way', order_row_uuid).asyncData(this);
            };
            /**
             *
             */
            const order_picked_up = async () => {
                /** update the order lifecycle with order_confiremed */
                order_lifecycle_array.forEach((p) => {
                    if (p.name === 'order pickedup') {
                        p.is_done = true;
                        p.date_created = date_current;
                        p.date_updated = date_current;
                    }
                });

                await new update_order_lifecycle(this.TDaoConfig).fetch(JSON.stringify(order_lifecycle_array), order_row_uuid).asyncData(this);
            };
            /**
             *
             */
            const order_delivered = async () => {
                /** update the order lifecycle with order_confiremed */
                order_lifecycle_array.forEach((p) => {
                    if (p.name === 'order delivered') {
                        p.is_done = true;
                        p.date_created = date_current;
                        p.date_updated = date_current;
                    }
                });

                await new update_order_lifecycle(this.TDaoConfig).fetch(JSON.stringify(order_lifecycle_array), order_row_uuid).asyncData(this);
                /** update the delivery status */
                await new update_order_delivery_status(this.TDaoConfig).fetch('delivered', order_row_uuid).asyncData(this);
                /** update the pay status */
                /** if the pay type is COD then update the pay_status */
                if (order_detail.pay_type === 'COD') {
                    await new update_order_pay_status(this.TDaoConfig).fetch('paid', order_row_uuid).asyncData(this);
                }
            };
            /**
             *
             *
             *
             *
             */
            /** check the type of lifecycle and update the lifecycle array */
            switch (order_lifecycle_type) {
                case 'order pickedup then order on its way':
                    await order_picked_up();
                    await order_on_way();

                    /**
                     * Send the push message
                     */
                    await (async () => {
                        /** send the push message to user */
                        const heading = `Order pickedup`;
                        const body = `Order with order id #${order_row_uuid} pickedup by one of our delivery boy and it will reach to you shortly.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_pickedup,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://image.freepik.com/free-vector/delivery-staff-ride-motorcycles-shopping-concept_1150-34879.jpg ';
                        send_push_message_to_user(this.TDaoConfig, order_detail.user_row_uuid, heading, body, image_uri, data);
                    })();

                    await (async () => {
                        /** send message to partner */
                        const heading = `Order pickedup`;
                        const body = `Order with order id #${order_row_uuid} pickedup by one of your delivery boy and it will reach to user shortly.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_pickedup,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://image.freepik.com/free-vector/delivery-staff-ride-motorcycles-shopping-concept_1150-34879.jpg ';

                        send_push_message_to_partner(this.TDaoConfig, order_detail.partner_row_uuid, heading, body, image_uri, data);
                    })();
                    break;

                case 'order confirmed then cooking':
                    await confirm_order();
                    await cooking_order();

                    await (async () => {
                        /** send the push message to user */
                        const heading = `Order cooking`;
                        const body = `Order with order id #${order_row_uuid} is currently being cooked by one of our best chef.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_cooking,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };

                        const image_uri =
                            'https://img.freepik.com/free-vector/pizzeria-flat-composition-with-chefs-bake-pizza-oven-kitchen-gives-order-courier-vector-illustration_1284-30692.jpg?size=626&ext=jpg';
                        send_push_message_to_user(this.TDaoConfig, order_detail.user_row_uuid, heading, body, image_uri, data);
                    })();
                    break;

                case 'order placed':
                    await order_placed();
                    break;

                case 'order confirmed':
                    await confirm_order();
                    /**
                     * Send the push message
                     */
                    await (async () => {
                        /** send the push message to user */
                        const heading = `Order confirmed`;
                        const body = `Order with order id #${order_row_uuid} confirmed by kitchen.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_confirmed,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        send_push_message_to_user(this.TDaoConfig, order_detail.user_row_uuid, heading, body, '', data);
                    })();

                    break;

                case 'cooking':
                    await cooking_order();

                    await (async () => {
                        const heading = `Order cooking`;
                        const body = `Order with order id #${order_row_uuid} is currently being cooked by one of our best chef.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_cooking,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri =
                            'https://img.freepik.com/free-vector/pizzeria-flat-composition-with-chefs-bake-pizza-oven-kitchen-gives-order-courier-vector-illustration_1284-30692.jpg?size=626&ext=jpg';

                        send_push_message_to_user(this.TDaoConfig, order_detail.user_row_uuid, heading, body, image_uri, data);
                    })();
                    break;

                case 'order pickedup':
                    await order_picked_up();
                    await (async () => {
                        /** send the push message to user */
                        const heading = `Order pickedup`;
                        const body = `Order with order id #${order_row_uuid} pickedup by one of our delivery boy and it will reach to you shortly.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_pickedup,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://image.freepik.com/free-vector/delivery-staff-ride-motorcycles-shopping-concept_1150-34879.jpg ';
                        send_push_message_to_user(this.TDaoConfig, order_detail.user_row_uuid, heading, body, image_uri, data);
                    })();

                    await (async () => {
                        /** send message to partner */
                        const heading = `Order pickedup`;
                        const body = `Order with order id #${order_row_uuid} pickedup by one of your delivery boy and it will reach to user shortly.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_pickedup,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://image.freepik.com/free-vector/delivery-staff-ride-motorcycles-shopping-concept_1150-34879.jpg ';

                        send_push_message_to_partner(this.TDaoConfig, order_detail.partner_row_uuid, heading, body, image_uri, data);
                    })();

                    await (async () => {
                        /** send message to partner */
                        const heading = `Order pickedup`;
                        const body = `Order with order id #${order_row_uuid} pickedup by one of your delivery boy and it will reach to user shortly.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_pickedup,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://image.freepik.com/free-vector/delivery-staff-ride-motorcycles-shopping-concept_1150-34879.jpg ';

                        send_push_message_to_owner(this.TDaoConfig, order_detail.owner_row_uuid, heading, body, image_uri, data);
                    })();

                    break;

                case 'order on its way':
                    await order_on_way();
                    break;

                case 'order delivered':
                    await order_delivered();
                    await (async () => {
                        const heading = `Order delivered`;
                        const body = `Order with order id #${order_row_uuid} delivered by one of our delivery boy. Thanks for choosing us`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_delivered,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://static.vecteezy.com/system/resources/previews/001/969/072/non_2x/delivery-concept-illustration-vector.jpg';
                        send_push_message_to_user(this.TDaoConfig, order_detail.user_row_uuid, heading, body, image_uri, data);
                    })();

                    await (async () => {
                        const heading = `Order delivered`;
                        const body = `Order with order id #${order_row_uuid} delivered by one of your delivery boy named ${order_detail.full_name}`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_delivered,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://static.vecteezy.com/system/resources/previews/001/969/072/non_2x/delivery-concept-illustration-vector.jpg';
                        send_push_message_to_partner(this.TDaoConfig, order_detail.partner_row_uuid, heading, body, image_uri, data);
                    })();

                    await (async () => {
                        const heading = `Order delivered`;
                        const body = `Order with order id #${order_row_uuid} delivered by one of your delivery boy named ${order_detail.full_name}`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_delivered,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://static.vecteezy.com/system/resources/previews/001/969/072/non_2x/delivery-concept-illustration-vector.jpg';
                        send_push_message_to_owner(this.TDaoConfig, order_detail.owner_row_uuid, heading, body, image_uri, data);
                    })();

                    await (async () => {
                        const heading = `Order delivered`;
                        const body = `Order with order id #${order_row_uuid} delivered. Good work ${order_detail.full_name}`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_delivered,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://static.vecteezy.com/system/resources/previews/001/969/072/non_2x/delivery-concept-illustration-vector.jpg';
                        send_push_message_to_dboy(this.TDaoConfig, order_detail.dboy_row_uuid, heading, body, image_uri, data);
                    })();

                    break;

                case 'canceled':
                    await (async () => {
                        await new update_order_delivery_status(this.TDaoConfig).fetch('canceled', order_row_uuid).asyncData(this);
                    })();

                    await (async () => {
                        const heading = `Order canceled`;
                        const body = `Order with order id #${order_row_uuid} canceled. We are committed to improve our service for you.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_canceled,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://image.freepik.com/free-vector/cancelled-events-announcement_23-2148566105.jpg';
                        send_push_message_to_user(this.TDaoConfig, order_detail.user_row_uuid, heading, body, image_uri, data);
                    })();

                    await (async () => {
                        const heading = `Order canceled`;
                        const body = `Order with order id #${order_row_uuid} canceled. Please make sure to improve your services.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_canceled,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://image.freepik.com/free-vector/cancelled-events-announcement_23-2148566105.jpg';
                        send_push_message_to_partner(this.TDaoConfig, order_detail.partner_row_uuid, heading, body, image_uri, data);
                    })();

                    await (async () => {
                        const heading = `Order canceled`;
                        const body = `Order with order id #${order_row_uuid} canceled. Please make sure to improve your services.`;
                        const data = {
                            order_row_uuid: order_row_uuid,
                            type: PUSH_MESSAGE_TYPE.order_canceled,
                            kitchen_row_uuid: order_detail.kitchen_row_uuid,
                            user_row_uuid: order_detail.user_row_uuid,
                        };
                        const image_uri = 'https://image.freepik.com/free-vector/cancelled-events-announcement_23-2148566105.jpg';
                        send_push_message_to_owner(this.TDaoConfig, order_detail.owner_row_uuid, heading, body, image_uri, data);
                    })();

                    break;
            }

            await this.closeTransaction();
            return this.baseFetch([]);
        } catch (error) {
            console.error(error);
            await this.rollback();
        }
    }
}
