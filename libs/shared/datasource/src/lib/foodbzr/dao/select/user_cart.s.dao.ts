/**
 * Fetch the user cart info
 */

import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';
import { IGetUserCartFull, IGetUserCartForCheckout, IGetUserCartGroupedKitchen } from '@foodbzr/shared/types';
import * as moment from 'moment';
import { can_apply_offer } from '@foodbzr/shared/util';

export class fetch_user_cart_full_details extends BaseDao<IGetUserCartFull[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        uc.user_row_uuid as user_row_uuid,
        uc.amount as amount,
        uc.date_created as date_created,
        uc.date_updated as date_updated,
        uc.row_uuid as row_uuid,

        msv.price_per_unit as menu_size_variant_price_per_unit,
        msv.name as menu_size_variant_name,
        msv.offer_percentage as menu_size_variant_offer_percentage,
        msv.offer_start_datetime as menu_size_variant_offer_start_datetime,
        msv.offer_end_datetime as menu_size_variant_offer_end_datetime,
        msv.row_uuid as menu_size_variant_row_uuid,

        men.menu_name as menu_menu_name,
        men.offer_percentage as menu_offer_percentage,
        men.offer_start_datetime as menu_offer_start_datetime,
        men.offer_end_datetime as menu_offer_end_datetime,
        men.row_uuid as menu_row_uuid,

        kit.kitchen_name as kitchen_kitchen_name,
        kit.offer_percentage as kitchen_offer_percentage,
        kit.offer_start_datetime as kitchen_offer_start_datetime,
        kit.offer_end_datetime as kitchen_offer_end_datetime,
        kit.row_uuid as kitchen_row_uuid,

        rfc.name as regional_food_category_name,
        rfc.offer_percentage as regional_food_category_offer_percentage,
        rfc.offer_start_datetime as regional_food_category_offer_start_datetime,
        rfc.offer_end_datetime as regional_food_category_offer_end_datetime,
        rfc.row_uuid as regional_food_category_row_uuid,

        fc.name as food_category_name,
        fc.offer_percentage as food_category_offer_percentage,
        fc.offer_start_datetime as food_category_offer_start_datetime,
        fc.offer_end_datetime as food_category_offer_end_datetime,
        fc.row_uuid as food_category_row_uuid

        FROM user_cart as uc
        LEFT OUTER JOIN menu_size_variant as msv
        ON msv.row_uuid = uc.menu_size_variant_row_uuid

        LEFT OUTER JOIN menu as men
        ON men.row_uuid = msv.menu_row_uuid

        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = men.kitchen_row_uuid

        LEFT OUTER JOIN regional_food_category as rfc
        ON rfc.row_uuid = men.regional_food_category_row_uuid

        LEFT OUTER JOIN food_category as fc
        ON fc.row_uuid = men.food_category_row_uuid

        WHERE uc.user_row_uuid = :user_row_uuid:
    ;`)
    fetch(user_row_uuid: string) {
        /** Group the items with key kitchen_row_uuid with kitchen information  */
        return this.baseFetch(this.DBData);
    }
}

/** total amount is user carts */
export class fetch_user_cart_total_items extends BaseDao<{ items: number }[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT COUNT(*) as items FROM user_cart WHERE user_row_uuid = :user_row_uuid:
    ;`)
    fetch(user_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

/** fetch the cart details with offer applied price */
export class fetch_user_cart_for_checkout extends BaseDao<IGetUserCartGroupedKitchen[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        SELECT

        uc.amount as user_cart_amount,
        uc.row_uuid as user_cart_row_uuid,
        uc.instruction as user_cart_instruction,

        rfc.name as regional_food_category_name,
        rfc.is_active as regional_food_category_is_active,
        rfc.offer_percentage as regional_food_category_offer_percentage,
        rfc.offer_start_datetime as regional_food_category_offer_start_datetime,
        rfc.offer_end_datetime as regional_food_category_offer_end_datetime,

        fc.name as food_category_name,
        fc.is_active as food_category_is_active,
        fc.offer_percentage as food_category_offer_percentage,
        fc.offer_start_datetime as food_category_offer_start_datetime,
        fc.offer_end_datetime as food_category_offer_end_datetime,

        kit.profile_picture as kitchen_profile_picture,
        kit.kitchen_name as kitchen_kitchen_name,
        kit.opening_time as kitchen_opening_time,
        kit.closing_time as kitchen_closing_time,
        kit.is_active as kitchen_is_active,
        kit.offer_percentage as kitchen_offer_percentage,
        kit.offer_start_datetime as kitchen_offer_start_datetime,
        kit.offer_end_datetime as kitchen_offer_end_datetime, 
        kit.partner_row_uuid as kitchen_partner_row_uuid,

        kit.street as kitchen_street,
        kit.pincode as kitchen_pincode,
        kit.city as kitchen_city,
        kit.state as kitchen_state,
        kit.country as kitchen_country,

        men.menu_name as menu_menu_name,
        men.is_active as menu_is_active,
        men.profile_picture as menu_profile_picture,
        men.kitchen_row_uuid as kitchen_row_uuid,
        men.regional_food_category_row_uuid as regional_food_category_row_uuid,
        men.food_category_row_uuid as food_category_row_uuid,
        men.offer_percentage as menu_offer_percentage,
        men.offer_start_datetime as menu_offer_start_datetime,
        men.offer_end_datetime as menu_offer_end_datetime,
        men.row_uuid as menu_row_uuid,

        msv.name as menu_variant_name,
        msv.price_per_unit as menu_variant_price_per_unit,
        msv.is_active as menu_variant_is_active,
        msv.offer_percentage as menu_variant_offer_percentage,
        msv.offer_start_datetime as menu_variant_offer_start_datetime,
        msv.offer_end_datetime as menu_variant_offer_end_datetime,
        msv.row_uuid  as menu_variant_row_uuid,
        msv.min_order_amount as menu_variant_min_order_amount

        FROM user_cart as uc
        LEFT OUTER JOIN menu_size_variant as msv
        ON msv.row_uuid = uc.menu_size_variant_row_uuid
        
        LEFT OUTER JOIN menu as men
        ON men.row_uuid = msv.menu_row_uuid

        LEFT OUTER JOIN kitchen as kit
        ON kit.row_uuid = men.kitchen_row_uuid

        LEFT OUTER JOIN regional_food_category as rfc
        ON rfc.row_uuid = men.regional_food_category_row_uuid

        LEFT OUTER JOIN food_category as fc
        ON fc.row_uuid = men.food_category_row_uuid

        WHERE uc.user_row_uuid = :user_row_uuid:
    ;`)
    fetch(user_row_uuid: string) {
        const current_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const filtered_arr: IGetUserCartForCheckout[] = (this.DBData as any).filter((p) => p.menu_variant_is_active === 'yes' && p.menu_is_active === 'yes' && p.kitchen_is_active === 'yes');

        /** extract the proper offer and calculate the final price */
        const final_arr = filtered_arr.map((p) => {
            /** find the offers */
            let offer_percentage: number = 0;

            if (+p.menu_variant_offer_percentage > 0 && can_apply_offer(p.menu_variant_offer_start_datetime, current_date, p.menu_variant_offer_end_datetime) && p.menu_variant_is_active === 'yes') {
                offer_percentage = +p.menu_variant_offer_percentage;
            } else if (+p.menu_offer_percentage > 0 && can_apply_offer(p.menu_offer_start_datetime, current_date, p.menu_offer_end_datetime) && p.menu_is_active === 'yes') {
                offer_percentage = +p.menu_offer_percentage;
            } else if (+p.kitchen_offer_percentage > 0 && can_apply_offer(p.kitchen_offer_start_datetime, current_date, p.kitchen_offer_end_datetime) && p.kitchen_is_active === 'yes') {
                offer_percentage = +p.kitchen_offer_percentage;
            } else if (
                +p.regional_food_category_offer_percentage > 0 &&
                can_apply_offer(p.regional_food_category_offer_start_datetime, current_date, p.regional_food_category_offer_end_datetime) &&
                p.regional_food_category_is_active === 'yes'
            ) {
                offer_percentage = +p.regional_food_category_offer_percentage;
            } else if (
                +p.food_category_offer_percentage > 0 &&
                can_apply_offer(p.food_category_offer_start_datetime, current_date, p.food_category_offer_end_datetime) &&
                p.food_category_is_active === 'yes'
            ) {
                offer_percentage = +p.food_category_offer_percentage;
            }

            const final_price = +p.menu_variant_price_per_unit - (+p.menu_variant_price_per_unit * offer_percentage) / 100;
            const total_final_price = final_price * p.user_cart_amount;
            const amount_saved = +p.menu_variant_price_per_unit - final_price;
            const total_amount_saved = amount_saved * p.user_cart_amount;

            return {
                ...p,
                is_selected: false,
                final_offer_percentage: offer_percentage,
                final_price: +final_price.toFixed(2),
                amount_saved: +amount_saved.toFixed(2),
                total_final_price: +total_final_price.toFixed(2),
                total_amount_saved: +total_amount_saved.toFixed(2),
            };
        });

        /** group the item in kichen */
        const grouped_items: IGetUserCartGroupedKitchen[] = [];

        final_arr.forEach((p) => {
            const found_kitchen = grouped_items.find((val) => val.kitchen.kitchen_row_uuid === p.kitchen_row_uuid);
            if (found_kitchen) {
                // already there
                found_kitchen.orders.push({
                    user_cart_row_uuid: p.user_cart_row_uuid,
                    user_cart_amount: p.user_cart_amount,
                    menu_variant_row_uuid: p.menu_variant_row_uuid,
                    menu_row_uuid: p.menu_row_uuid,
                    kitchen_row_uuid: p.kitchen_row_uuid,
                    final_price: p.final_price,
                    amount_saved: p.amount_saved,
                    total_final_price: p.total_final_price,
                    total_amount_saved: p.total_amount_saved,
                    menu_name: p.menu_menu_name,
                    menu_variant_name: p.menu_variant_name,
                    original_menu_price: +p.menu_variant_price_per_unit,
                    user_cart_instruction: p.user_cart_instruction,
                    menu_variant_min_order_amount: p.menu_variant_min_order_amount,
                });
            } else {
                // add the kitchen first
                grouped_items.push({
                    kitchen: {
                        kitchen_partner_row_uuid: p.kitchen_partner_row_uuid,
                        kitchen_name: p.kitchen_kitchen_name,
                        profile_picture: p.kitchen_profile_picture,
                        kitchen_row_uuid: p.kitchen_row_uuid,
                        address: `${p.kitchen_street}, ${p.kitchen_city}, ${p.kitchen_pincode}, ${p.kitchen_state}, ${p.kitchen_country}`,
                        can_take_order: can_apply_offer(p.kitchen_opening_time, current_date, p.kitchen_closing_time),
                    },
                    orders: [
                        {
                            user_cart_row_uuid: p.user_cart_row_uuid,
                            user_cart_amount: p.user_cart_amount,
                            menu_variant_row_uuid: p.menu_variant_row_uuid,
                            menu_row_uuid: p.menu_row_uuid,
                            kitchen_row_uuid: p.kitchen_row_uuid,
                            final_price: p.final_price,
                            amount_saved: p.amount_saved,
                            total_final_price: p.total_final_price,
                            total_amount_saved: p.total_amount_saved,
                            menu_name: p.menu_menu_name,
                            menu_variant_name: p.menu_variant_name,
                            original_menu_price: +p.menu_variant_price_per_unit,
                            user_cart_instruction: p.user_cart_instruction,
                            menu_variant_min_order_amount: p.menu_variant_min_order_amount,
                        },
                    ],
                    final_calculation: { total_menu_price: null, total_amount_saved: null, tax_amount: 0, delivery_charge: 0, amount_payable: null },
                });
            }
        });

        /** calculate the final calculation */
        grouped_items.forEach((p) => {
            let total_amount_saved = 0;
            let total_amount_payable = 0;
            let toal_menu_price = 0;
            p.orders.forEach((o) => {
                total_amount_saved = total_amount_saved + o.total_amount_saved;
                total_amount_payable = total_amount_payable + o.total_final_price;
                toal_menu_price = toal_menu_price + (o.total_amount_saved + o.total_final_price);
            });

            p.final_calculation.amount_payable = +total_amount_payable.toFixed(2);
            p.final_calculation.total_menu_price = +toal_menu_price.toFixed(2);
            p.final_calculation.total_amount_saved = +total_amount_saved.toFixed(2);
        });

        return this.baseFetch(grouped_items);
    }
}
