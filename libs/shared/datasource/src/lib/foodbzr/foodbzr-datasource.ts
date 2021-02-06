import { Database } from '@sculify/node-room';
import { delete_food_category } from './dao/delete/food_category.d.dao';
import { delete_kitchen } from './dao/delete/kitchen.d.dao';
import { delete_menu } from './dao/delete/menu.d.dao';
import { delete_menu_picture } from './dao/delete/menu_picture.d.dao';
import { delete_menu_review } from './dao/delete/menu_review.d.dao';
import { delete_menu_size_variant } from './dao/delete/menu_size_variant.d.dao';
import { delete_woner } from './dao/delete/owner.d.dao';
import { delete_partner } from './dao/delete/partner.d.dao';
import { delete_regional_food_category } from './dao/delete/regional_food_category.d.dao';
import { insert_food_category } from './dao/insert/food_category.i.dao';
import { insert_kitchen } from './dao/insert/kitchen.i.dao';
import { insert_menu } from './dao/insert/menu.i.dao';
import { insert_multi_menu_picture } from './dao/insert/menu_picture.i.dao';
import { insert_menu_review } from './dao/insert/menu_review.i.dao';
import { insert_menu_size_variant } from './dao/insert/menu_size_variant.i.dao';
import { insert_owner } from './dao/insert/owner.i.dao';
import { insert_partner } from './dao/insert/partner.i.dao';
import { insert_regional_food_category } from './dao/insert/regional_food_category.i.dao';
import { fetch_food_category_of_partner } from './dao/select/food_category.s.dao';
import { fetch_kitchens_of_partner, fetch_kitchen_password, fetch_kitchen_single } from './dao/select/kitchen.s.dao';
import { fetch_menus_of_kitchen, fetch_menu_single } from './dao/select/menu.s.dao';
import { fetch_menu_picture_of_menu } from './dao/select/menu_picture.s.dao';
import { fetch_menu_reviews_of_menu } from './dao/select/menu_review.s.dao';
import { fetch_menu_size_variant_of_menu, fetch_menu_size_variant_single } from './dao/select/menu_size_variant.s.dao';
import { fetch_owner } from './dao/select/owner.s.dao';
import { fetch_partners_of_owner, fetch_partner_otp, fetch_partner_single } from './dao/select/partner.s.dao';
import { fetch_regional_food_category_of_partner } from './dao/select/regional_food_category.s.dao';
import { update_food_category } from './dao/update/food_category.u.dao';
import { update_kitchen, update_kitchen_offers, update_kitchen_password } from './dao/update/kitchen.u.dao';
import { update_menu } from './dao/update/menu.u.dao';
import { update_menu_review } from './dao/update/menu_review.u.dao';
import { update_menu_size_variant } from './dao/update/menu_size_variant.u.dao';
import { update_owner_otp } from './dao/update/owner.u.dao';
import { update_partner, update_partner_mobile_number, update_partner_otp } from './dao/update/partner.u.dao';
import { update_regional_food_category } from './dao/update/regional_food_category.u.dao';
import { food_category } from './entity/table/food_category.table';
import { kitchen } from './entity/table/kitchen.table';
import { menu } from './entity/table/menu.table';
import { menu_picture } from './entity/table/menu_picture.table';
import { menu_review } from './entity/table/menu_review.table';
import { menu_size_variant } from './entity/table/menu_size_variant.table';
import { owner } from './entity/table/owner.table';
import { partner } from './entity/table/partner.table';
import { regional_food_category } from './entity/table/regional_food_category.table';

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

    /** partner.table.ts */
    public delete_partner = delete_partner;
    public insert_partner = insert_partner;
    public fetch_partner_single = fetch_partner_single;
    public fetch_partners_of_owner = fetch_partners_of_owner;
    public fetch_partner_otp = fetch_partner_otp;
    public update_partner_otp = update_partner_otp;
    public update_partner = update_partner;
    public update_partner_mobile_number = update_partner_mobile_number;

    /** kitchen.table.ts */
    public delete_kitchen = delete_kitchen;
    public insert_kitchen = insert_kitchen;
    public fetch_kitchen_single = fetch_kitchen_single;
    public fetch_kitchens_of_partner = fetch_kitchens_of_partner;
    public fetch_kitchen_password = fetch_kitchen_password;
    public update_kitchen = update_kitchen;
    public update_kitchen_offers = update_kitchen_offers;
    public update_kitchen_password = update_kitchen_password;

    /** menu.table.ts */
    public delete_menu = delete_menu;
    public insert_menu = insert_menu;
    public fetch_menu_single = fetch_menu_single;
    public fetch_menus_of_kitchen = fetch_menus_of_kitchen;
    public update_menu = update_menu;

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

    /** menu_picture.table.ts */
    public delete_menu_picture = delete_menu_picture;
    public insert_multi_menu_picture = insert_multi_menu_picture;
    public fetch_menu_picture_of_menu = fetch_menu_picture_of_menu;

    /** menu_review.table.ts */
    public delete_menu_review = delete_menu_review;
    public insert_menu_review = insert_menu_review;
    public update_menu_review = update_menu_review;
    public fetch_menu_reviews_of_menu = fetch_menu_reviews_of_menu;

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
