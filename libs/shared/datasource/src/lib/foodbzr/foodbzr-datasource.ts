import { Database } from '@sculify/node-room';
import { delete_kitchen } from './dao/delete/kitchen.d.dao';
import { delete_woner } from './dao/delete/owner.d.dao';
import { delete_partner } from './dao/delete/partner.d.dao';
import { insert_kitchen } from './dao/insert/kitchen.i.dao';
import { insert_owner } from './dao/insert/owner.i.dao';
import { insert_partner } from './dao/insert/partner.i.dao';
import { fetch_kitchens_of_partner, fetch_kitchen_password, fetch_kitchen_single } from './dao/select/kitchen.s.dao';
import { fetch_owner } from './dao/select/owner.s.dao';
import { fetch_partners_of_owner, fetch_partner_otp, fetch_partner_single } from './dao/select/partner.s.dao';
import { update_kitchen, update_kitchen_offers, update_kitchen_password } from './dao/update/kitchen.u.dao';
import { update_owner_otp } from './dao/update/owner.u.dao';
import { update_partner, update_partner_mobile_number, update_partner_otp } from './dao/update/partner.u.dao';
import { kitchen } from './entity/table/kitchen.table';
import { owner } from './entity/table/owner.table';
import { partner } from './entity/table/partner.table';

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
