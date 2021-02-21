import { Database } from '@sculify/node-room';
import { delete_dboy } from './dao/delete/dboy.d.dao';
import { delete_delivery_address } from './dao/delete/delivery_address.d.dao';
import { delete_food_category } from './dao/delete/food_category.d.dao';
import { delete_kitchen } from './dao/delete/kitchen.d.dao';
import { delete_menu } from './dao/delete/menu.d.dao';
import { delete_menu_picture } from './dao/delete/menu_picture.d.dao';
import { delete_menu_review } from './dao/delete/menu_review.d.dao';
import { delete_menu_size_variant } from './dao/delete/menu_size_variant.d.dao';
import { delete_woner } from './dao/delete/owner.d.dao';
import { delete_partner } from './dao/delete/partner.d.dao';
import { delete_regional_food_category } from './dao/delete/regional_food_category.d.dao';
import { delete_user } from './dao/delete/user.d.dao';
import { delete_user_cart } from './dao/delete/user_cart.d.dao';
import { insert_dboy } from './dao/insert/dboy.i.dao';
import { insert_delivery_address } from './dao/insert/delivery_address.i.dao';
import { insert_food_category } from './dao/insert/food_category.i.dao';
import { insert_kitchen } from './dao/insert/kitchen.i.dao';
import { insert_menu } from './dao/insert/menu.i.dao';
import { insert_multi_menu_picture } from './dao/insert/menu_picture.i.dao';
import { insert_menu_review } from './dao/insert/menu_review.i.dao';
import { insert_menu_size_variant } from './dao/insert/menu_size_variant.i.dao';
import { insert_order, insert_order_take_order } from './dao/insert/order.i.dao';
import { insert_owner } from './dao/insert/owner.i.dao';
import { insert_partner } from './dao/insert/partner.i.dao';
import { insert_regional_food_category } from './dao/insert/regional_food_category.i.dao';
import { insert_user } from './dao/insert/user.i.dao';
import { insert_user_cart } from './dao/insert/user_cart.i.dao';
import { fetch_dboy_of_kitchen, fetch_dboy_single } from './dao/select/dboy.s.dao';
import { fetch_delivery_address_of_user } from './dao/select/delivery_address.s.dao';
import { fetch_food_category_of_partner } from './dao/select/food_category.s.dao';
import { fetch_kitchens_of_partner, fetch_kitchen_all, fetch_kitchen_in_range, fetch_kitchen_password, fetch_kitchen_search, fetch_kitchen_single, fetch_kitchen_supported_menus } from './dao/select/kitchen.s.dao';
import { fetch_menus_of_kitchen, fetch_menu_of_regional_food_cat, fetch_menu_search, fetch_menu_single, fetch_menu_trending } from './dao/select/menu.s.dao';
import { fetch_menu_picture_of_menu } from './dao/select/menu_picture.s.dao';
import { fetch_menu_reviews_of_menu } from './dao/select/menu_review.s.dao';
import { fetch_menu_size_variant_for_cart, fetch_menu_size_variant_of_menu, fetch_menu_size_variant_single } from './dao/select/menu_size_variant.s.dao';
import { fetch_order_all, fetch_order_dboy_report, fetch_order_lifecycle, fetch_order_of_user, fetch_order_on_way_dboy, fetch_order_pending_dboy, fetch_order_single, fetch_order_status } from './dao/select/order.s.dao';
import { fetch_owner, fetch_owner_all } from './dao/select/owner.s.dao';
import { fetch_partners_of_owner, fetch_partner_all, fetch_partner_otp, fetch_partner_single } from './dao/select/partner.s.dao';
import { fetch_regional_food_category_of_partner } from './dao/select/regional_food_category.s.dao';
import { fetch_user_all, fetch_user_single } from './dao/select/user.s.dao';
import { fetch_user_cart_for_checkout, fetch_user_cart_full_details, fetch_user_cart_total_items } from './dao/select/user_cart.s.dao';
import { update_dboy, update_dboy_verify } from './dao/update/dboy.u.dao';
import { update_delivery_address } from './dao/update/delivery_address.u.dao';
import { update_food_category } from './dao/update/food_category.u.dao';
import { update_kitchen, update_kitchen_address, update_kitchen_login_detail, update_kitchen_offers, update_kitchen_password } from './dao/update/kitchen.u.dao';
import { update_menu, update_menu_category, update_menu_offers } from './dao/update/menu.u.dao';
import { update_menu_review } from './dao/update/menu_review.u.dao';
import { update_menu_size_variant, update_menu_size_variant_offer } from './dao/update/menu_size_variant.u.dao';
import {
    update_order_add_otp,
    update_order_assign_dboy,
    update_order_delivery_status,
    update_order_lifecycle,
    update_order_pay_status,
    update_order_remove_dboy,
    update_t_order_lifecycle,
} from './dao/update/order.u.dao';
import { update_owner_otp } from './dao/update/owner.u.dao';
import { update_partner, update_partner_bio, update_partner_gender, update_partner_mobile_number, update_partner_name, update_partner_otp } from './dao/update/partner.u.dao';
import { update_regional_food_category } from './dao/update/regional_food_category.u.dao';
import { update_user } from './dao/update/user.u.dao';
import { update_user_cart, update_user_cart_cooking_instruction } from './dao/update/user_cart.u.dao';
import { dboy } from './entity/table/dboy.table';
import { delivery_address } from './entity/table/delivery_address.table';
import { food_category } from './entity/table/food_category.table';
import { kitchen } from './entity/table/kitchen.table';
import { menu } from './entity/table/menu.table';
import { menu_picture } from './entity/table/menu_picture.table';
import { menu_review } from './entity/table/menu_review.table';
import { menu_size_variant } from './entity/table/menu_size_variant.table';
import { food_order } from './entity/table/order.table';
import { owner } from './entity/table/owner.table';
import { partner } from './entity/table/partner.table';
import { regional_food_category } from './entity/table/regional_food_category.table';
import { user } from './entity/table/user.table';
import { user_cart } from './entity/table/user_cart.table';

@Database({
    db_name: 'foodbzr_database',
    Tables: [
        {
            entity: owner,
            cache_fetch_condition: '',
        },
        {
            entity: partner,
            cache_fetch_condition: '',
        },
        {
            entity: kitchen,
            cache_fetch_condition: '',
        },
        {
            entity: menu,
            cache_fetch_condition: '',
        },
        {
            entity: food_category,
            cache_fetch_condition: '',
        },
        {
            entity: regional_food_category,
            cache_fetch_condition: '',
        },
        {
            entity: menu_size_variant,
            cache_fetch_condition: '',
        },
        {
            entity: menu_picture,
            cache_fetch_condition: '',
        },
        {
            entity: menu_review,
            cache_fetch_condition: '',
        },
        {
            entity: user,
            cache_fetch_condition: '',
        },
        {
            entity: user_cart,
            cache_fetch_condition: '',
        },
        {
            entity: food_order,
            cache_fetch_condition: '',
        },
        {
            entity: delivery_address,
            cache_fetch_condition: '',
        },
        {
            entity: dboy,
            cache_fetch_condition: '',
        },
    ],
    Views: [],
    childDatabase: [],
})
export class FoodbzrDatasource {
    private static instance: FoodbzrDatasource;

    /** owner.table.ts */
    public delete_woner = delete_woner;
    public insert_owner = insert_owner;
    public fetch_owner = fetch_owner;
    public update_owner_otp = update_owner_otp;
    public fetch_owner_all = fetch_owner_all;

    /** partner.table.ts */
    public delete_partner = delete_partner;
    public insert_partner = insert_partner;
    public fetch_partner_single = fetch_partner_single;
    public fetch_partners_of_owner = fetch_partners_of_owner;
    public fetch_partner_otp = fetch_partner_otp;
    public update_partner_otp = update_partner_otp;
    public update_partner = update_partner;
    public update_partner_mobile_number = update_partner_mobile_number;
    public fetch_partner_all = fetch_partner_all;
    public update_partner_bio = update_partner_bio;
    public update_partner_name = update_partner_name;
    public update_partner_gender = update_partner_gender;

    /** kitchen.table.ts */
    public delete_kitchen = delete_kitchen;
    public insert_kitchen = insert_kitchen;
    public fetch_kitchen_single = fetch_kitchen_single;
    public fetch_kitchens_of_partner = fetch_kitchens_of_partner;
    public fetch_kitchen_password = fetch_kitchen_password;
    public update_kitchen = update_kitchen;
    public update_kitchen_offers = update_kitchen_offers;
    public update_kitchen_password = update_kitchen_password;
    public fetch_kitchen_all = fetch_kitchen_all;
    public update_kitchen_login_detail = update_kitchen_login_detail;
    public update_kitchen_address = update_kitchen_address;
    public fetch_kitchen_in_range = fetch_kitchen_in_range;
    public fetch_kitchen_search = fetch_kitchen_search;
    public fetch_kitchen_supported_menus = fetch_kitchen_supported_menus;

    /** menu.table.ts */
    public delete_menu = delete_menu;
    public insert_menu = insert_menu;
    public fetch_menu_single = fetch_menu_single;
    public fetch_menus_of_kitchen = fetch_menus_of_kitchen;
    public update_menu = update_menu;
    public update_menu_offers = update_menu_offers;
    public update_menu_category = update_menu_category;
    public fetch_menu_of_regional_food_cat = fetch_menu_of_regional_food_cat; 
    public fetch_menu_search = fetch_menu_search;
    public fetch_menu_trending = fetch_menu_trending;

    /** food_category.table.ts */
    public delete_food_category = delete_food_category;
    public insert_food_category = insert_food_category;
    public fetch_food_category_of_partner = fetch_food_category_of_partner;
    public update_food_category = update_food_category;

    /** regional_food_category.table.ts */
    public delete_regional_food_category = delete_regional_food_category;
    public insert_regional_food_category = insert_regional_food_category;
    public fetch_regional_food_category_of_partner = fetch_regional_food_category_of_partner;
    public update_regional_food_category = update_regional_food_category;

    /** menu_size_variant.table.ts */
    public fetch_menu_size_variant_of_menu = fetch_menu_size_variant_of_menu;
    public fetch_menu_size_variant_single = fetch_menu_size_variant_single;
    public delete_menu_size_variant = delete_menu_size_variant;
    public insert_menu_size_variant = insert_menu_size_variant;
    public update_menu_size_variant = update_menu_size_variant;
    public update_menu_size_variant_offer = update_menu_size_variant_offer;
    public fetch_menu_size_variant_for_cart = fetch_menu_size_variant_for_cart;

    /** menu_picture.table.ts */
    public delete_menu_picture = delete_menu_picture;
    public insert_multi_menu_picture = insert_multi_menu_picture;
    public fetch_menu_picture_of_menu = fetch_menu_picture_of_menu;

    /** menu_review.table.ts */
    public delete_menu_review = delete_menu_review;
    public insert_menu_review = insert_menu_review;
    public update_menu_review = update_menu_review;
    public fetch_menu_reviews_of_menu = fetch_menu_reviews_of_menu;

    /** user.table.ts */
    public fetch_user_single = fetch_user_single;
    public delete_user = delete_user;
    public insert_user = insert_user;
    public update_user = update_user;
    public fetch_user_all = fetch_user_all;

    /** user_cart.table.ts */
    public fetch_user_cart_full_details = fetch_user_cart_full_details;
    public delete_user_cart = delete_user_cart;
    public insert_user_cart = insert_user_cart;
    public update_user_cart = update_user_cart;
    public fetch_user_cart_total_items = fetch_user_cart_total_items;
    public fetch_user_cart_for_checkout = fetch_user_cart_for_checkout;
    public update_user_cart_cooking_instruction = update_user_cart_cooking_instruction;

    /** order.table.ts  */
    public fetch_order_lifecycle = fetch_order_lifecycle;
    public fetch_order_single = fetch_order_single;
    public insert_order = insert_order;
    public update_order_add_otp = update_order_add_otp;
    public update_order_assign_dboy = update_order_assign_dboy;
    public update_order_delivery_status = update_order_delivery_status;
    public update_order_lifecycle = update_order_lifecycle;
    public update_order_pay_status = update_order_pay_status;
    public update_order_remove_dboy = update_order_remove_dboy;
    public update_t_order_lifecycle = update_t_order_lifecycle;
    public fetch_order_all = fetch_order_all;
    public fetch_order_status = fetch_order_status;
    public fetch_order_pending_dboy = fetch_order_pending_dboy;
    public fetch_order_on_way_dboy = fetch_order_on_way_dboy;
    public insert_order_take_order = insert_order_take_order;
    public fetch_order_of_user  = fetch_order_of_user;
    public fetch_order_dboy_report = fetch_order_dboy_report;

    /** delivery_address.table.ts */
    public delete_delivery_address = delete_delivery_address;
    public fetch_delivery_address_of_user = fetch_delivery_address_of_user;
    public insert_delivery_address = insert_delivery_address;
    public update_delivery_address = update_delivery_address;

    /** dboy.table.ts */
    public fetch_dboy_of_kitchen = fetch_dboy_of_kitchen;
    public fetch_dboy_single = fetch_dboy_single;
    public insert_dboy = insert_dboy;
    public update_dboy = update_dboy;
    public delete_dboy = delete_dboy;
    public update_dboy_verify = update_dboy_verify;

    constructor() {}

    public static initInstance(): void {
        if (!FoodbzrDatasource.instance) {
            FoodbzrDatasource.instance = new FoodbzrDatasource();
        }
    }

    public static getInstance(): FoodbzrDatasource {
        return FoodbzrDatasource.instance;
    }
}
