/**
 * Add otp
 * This will be added once the order is confirmed
 */

import { delivery_status, IModificationDaoStatus, order_lifecycle_state, pay_status } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query, TBaseDao, TQuery } from '@sculify/node-room';
import { fetch_order_lifecycle, fetch_order_single } from '../select/order.s.dao';
import * as moment from 'moment';
import { generate_otp } from '@foodbzr/shared/util';

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
        try {
            const date_current = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            /**
             * Fetch the order details
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
             *
             *
             *
             */
            /** check the type of lifecycle and update the lifecycle array */
            switch (order_lifecycle_type) {
                case 'order pickedup then order on its way':
                    await order_picked_up();
                    await order_on_way();
                    break;

                case 'order confirmed then cooking':
                    await confirm_order();
                    await cooking_order();
                    break;

                case 'order placed':
                    await (async () => {
                        /** update order lifecycle */
                        order_lifecycle_array.forEach((p) => {
                            if (p.name === order_lifecycle_type) {
                                p.is_done = true;
                                p.date_created = date_current;
                                p.date_updated = date_current;
                            }
                        });

                        await new update_order_lifecycle(this.TDaoConfig).fetch(JSON.stringify(order_lifecycle_array), order_row_uuid).asyncData(this);
                        /** update the delivery status */
                        await new update_order_delivery_status(this.TDaoConfig).fetch('placed', order_row_uuid).asyncData(this);
                    })();
                    break;

                case 'order confirmed':
                    await confirm_order();
                    break;

                case 'cooking':
                    await cooking_order();
                    break;

                case 'order pickedup':
                    await order_picked_up();
                    break;

                case 'order on its way':
                    await order_on_way();
                    break;

                case 'order delivered':
                    await (async () => {
                        /** update the order lifecycle with order_confiremed */
                        order_lifecycle_array.forEach((p) => {
                            if (p.name === order_lifecycle_type) {
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
                    })();
                    break;

                case 'canceled':
                    await (async () => {
                        /** update the delivery status */
                        await new update_order_delivery_status(this.TDaoConfig).fetch('canceled', order_row_uuid).asyncData(this);
                    })();
                    break;
            }

            await this.closeTransaction();
            return this.baseFetch([]);
        } catch (error) {
            await this.rollback();
        }
    }
}
