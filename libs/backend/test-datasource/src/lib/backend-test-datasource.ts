import { IDaoConfig, MYSQLConnectionConfig, QueryServerDatabase } from '@sculify/node-room';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { OrderMenu } from '@foodbzr/shared/types';
import { generate_owner } from './generators/generate_owner';
import { generate_partner } from './generators/generate_partner';
import { generate_kitchens } from './generators/generate_kitchen';
import { Chance } from 'chance';
import { generate_food_category } from './generators/generate_food_category';
import { generate_regional_food_category } from './generators/generate_regional_food_category';
import { generate_menus } from './generators/generate_menu';
import { generate_menu_size_variant } from './generators/generate_menu_variant';
import { generate_food_img } from './generators/generate_food_img';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { generate_users } from './generators/generate_user';
import { generate_reviews } from './generators/generate_review';
import { get_initial_order_lifecycle } from '@foodbzr/shared/util';
import { DateMaker } from './generators/date-iterator';
import { generate_dboys } from './generators/generate_dboy';

async function generate_test_data(daoConfig: IDaoConfig, MYSQL_CONFIG: MYSQLConnectionConfig, db_instance_name: string) {
    const rootDatabase = FoodbzrDatasource.getInstance();
    const chance = new Chance();
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    /**
     *
     *
     *
     *
     */
    /** add the one owner to the db */
    await (async () => {
        const gen_owners = generate_owner(1, 'female');
        const ins_owner = gen_owners[0];
        await new rootDatabase.insert_owner(daoConfig)
            .fetch(ins_owner.mobile_number, ins_owner.full_name, ins_owner.bio, ins_owner.gender, ins_owner.profile_picture, ins_owner.date_created, ins_owner.row_uuid)
            .asyncData();
    })();
    console.log('gen ---> owners');
    /**
     *
     *
     *
     *
     */
    /** add some partners to the owner */
    await (async () => {
        /** fetch the inserted owner */
        const ins_owners = await new rootDatabase.fetch_owner_all(daoConfig).fetch().asyncData();

        for (const ins_owner of ins_owners) {
            /** add 10 male partners and 10 female partners */
            /** adding male partners */
            const gen_10_males_partners = generate_partner(2, 'male');
            for (const male_partner of gen_10_males_partners) {
                await new rootDatabase.insert_partner(daoConfig)
                    .fetch(
                        ins_owner.row_uuid,
                        male_partner.profile_picture,
                        male_partner.gender,
                        male_partner.full_name,
                        male_partner.mobile_number,
                        male_partner.bio,
                        male_partner.date_created,
                        male_partner.row_uuid
                    )
                    .asyncData();
            }

            /** insert 10 female partners */
            const gen_10_females_partners = generate_partner(2, 'female');
            for (const female_partner of gen_10_females_partners) {
                await new rootDatabase.insert_partner(daoConfig)
                    .fetch(
                        ins_owner.row_uuid,
                        female_partner.profile_picture,
                        female_partner.gender,
                        female_partner.full_name,
                        female_partner.mobile_number,
                        female_partner.bio,
                        female_partner.date_created,
                        female_partner.row_uuid
                    )
                    .asyncData();
            }

            /** inactive random 5 partner */
            const partner_to_unverify = [...chance.pickset(gen_10_males_partners, 1), ...chance.pickset(gen_10_females_partners, 3)];
            for (const del_partner of partner_to_unverify) {
                await new rootDatabase.delete_partner_verification(daoConfig).fetch('no', del_partner.row_uuid).asyncData();
            }
        }
    })();
    console.log('gen ---> partners');
    /**
     *
     *
     *
     *
     */
    /** add some kitchens to the partner */
    /** created kitchen do not have any password or user_id */
    await (async () => {
        /** fetch all the inserted partners of db */
        const ins_all_partners = await new rootDatabase.fetch_partner_all(daoConfig).fetch().asyncData();

        for (const partner of ins_all_partners) {
            /** insert the 5 kitchen for single partner */
            const gen_5_kitchens = generate_kitchens(2);
            for (const kitchen of gen_5_kitchens) {
                /** insert the kitchen */
                await new rootDatabase.insert_kitchen(daoConfig)
                    .fetch(
                        partner.row_uuid,
                        kitchen.kitchen_user_id,
                        kitchen.kitchen_password,
                        kitchen.kitchen_name,
                        kitchen.kitchen_image,
                        15,
                        kitchen.latitude,
                        kitchen.longitude,
                        kitchen.opening_time,
                        kitchen.closing_time,
                        kitchen.open_week_list,
                        kitchen.street,
                        kitchen.pincode,
                        kitchen.city,
                        kitchen.state,
                        kitchen.country,
                        kitchen.date_created,
                        kitchen.row_uuid
                    )
                    .asyncData();
            }
            /** delete the 2 random kitchen */
            const kitchen_to_delete = chance.pickset(gen_5_kitchens, 1);
            for (const kitchen_to_del of kitchen_to_delete) {
                await new rootDatabase.delete_kitchen(daoConfig).fetch('no', kitchen_to_del.row_uuid).asyncData();
            }
        }
    })();
    console.log('gen ---> kitchens');
    /**
     *
     *
     *
     *
     */
    /** make some delivery boy */
    await (async () => {
        const all_owners = await new rootDatabase.fetch_owner_all(daoConfig).fetch().asyncData();
        for (const owner of all_owners) {
            /** fetch all the active partners */
            const all_partners = await new rootDatabase.fetch_partners_of_owner(daoConfig).fetch(owner.row_uuid, 'yes').asyncData();
            for (const partner of all_partners) {
                const all_kitchens = await new rootDatabase.fetch_kitchens_of_partner(daoConfig).fetch(partner.row_uuid, 'yes').asyncData();
                for (const kitchen of all_kitchens) {
                    /** add 10 dboys in single kitchen */
                    const gen_dboys = generate_dboys(2);
                    for (const dboy of gen_dboys) {
                        await new rootDatabase.insert_dboy(daoConfig)
                            .fetch(kitchen.row_uuid, dboy.full_name, dboy.mobile_number, dboy.profile_picture, dboy.gender, dboy.birth_date, dboy.date_created, dboy.row_uuid)
                            .asyncData();
                    }
                }
            }
        }
    })();
    console.log('gen ----> dboys');
    /**
     *
     *
     *
     *
     */
    /** Generate the food category */
    await (async () => {
        /** fetch all the partner  */
        const all_partners = await new rootDatabase.fetch_partner_all(daoConfig).fetch().asyncData();

        for (const partner of all_partners) {
            const food_category = generate_food_category();
            for (const food_cat of food_category) {
                await new rootDatabase.insert_food_category(daoConfig)
                    .fetch(
                        food_cat.name,
                        food_cat.profile_picture,
                        partner.row_uuid,
                        food_cat.offer_percentage,
                        food_cat.offer_start_datetime,
                        food_cat.offer_end_datetime,
                        food_cat.date_created,
                        food_cat.row_uuid
                    )
                    .asyncData();
            }
        }
    })();
    console.log('gen ---> food category');
    /**
     *
     *
     *
     *
     */
    /** generate the regional food category */
    await (async () => {
        /** fetch all partners */
        const all_partners = await new rootDatabase.fetch_partner_all(daoConfig).fetch().asyncData();
        for (const partner of all_partners) {
            /** add regional food cats */
            const all_regional_food_cats = generate_regional_food_category(5);
            for (const regional_food_cat of all_regional_food_cats) {
                await new rootDatabase.insert_regional_food_category(daoConfig)
                    .fetch(
                        regional_food_cat.name,
                        regional_food_cat.profile_picture,
                        partner.row_uuid,
                        regional_food_cat.offer_percentage,
                        regional_food_cat.offer_start_datetime,
                        regional_food_cat.offer_end_datetime,
                        regional_food_cat.date_created,
                        regional_food_cat.row_uuid
                    )
                    .asyncData();
            }
        }
    })();
    console.log('gen ---> regional food category');
    /**
     *
     *
     *
     *
     */
    /** create some menus for the kitchens */
    await (async () => {
        const all_partners = await new rootDatabase.fetch_partner_all(daoConfig).fetch().asyncData();
        for (const partner of all_partners) {
            /** fethc all the regional food cat and food cat */
            const all_regional_food_cats = await new rootDatabase.fetch_regional_food_category_of_partner(daoConfig).fetch(partner.row_uuid).asyncData();
            const all_food_cats = await new rootDatabase.fetch_food_category_of_partner(daoConfig).fetch(partner.row_uuid).asyncData();

            /** fetch all kitchens */
            const all_kitchens = await new rootDatabase.fetch_kitchens_of_partner(daoConfig).fetch(partner.row_uuid, 'yes').asyncData();
            for (const kitchen of all_kitchens) {
                /** create the menus */
                const gen_menus = generate_menus(5);
                for (const menu of gen_menus) {
                    /** insert the menu */
                    await new rootDatabase.insert_menu(daoConfig)
                        .fetch(
                            menu.name,
                            menu.profile_picture,
                            menu.bio,
                            kitchen.row_uuid,
                            chance.pickone(all_regional_food_cats).row_uuid,
                            chance.pickone(all_food_cats).row_uuid,
                            menu.offer_percentage,
                            menu.offer_start_datetime,
                            menu.offer_end_datetime,
                            menu.date_created,
                            menu.row_uuid
                        )
                        .asyncData();
                }
            }
        }
    })();
    console.log('gen ---> menus');
    /**
     *
     *
     *
     *
     */
    /** insert some menu size variant for the menus */
    await (async () => {
        /** fetch all partners */
        const all_partners = await new rootDatabase.fetch_partner_all(daoConfig).fetch().asyncData();
        for (const partner of all_partners) {
            /** fetch all active kitchens of partner*/
            const all_kitchens = await new rootDatabase.fetch_kitchens_of_partner(daoConfig).fetch(partner.row_uuid, 'yes').asyncData();
            for (const kitchen of all_kitchens) {
                /** fetch all menus of the kitchen */
                const all_menus = await new rootDatabase.fetch_menus_of_kitchen(daoConfig).fetch(kitchen.row_uuid).asyncData();
                for (const menu of all_menus) {
                    /** gen the size variants */
                    const generated_menu_size_variants = generate_menu_size_variant(2);
                    /** insert the size variant to every menu */
                    for (const size_variant of generated_menu_size_variants) {
                        await new rootDatabase.insert_menu_size_variant(daoConfig)
                            .fetch(size_variant.name, size_variant.profile_picture, size_variant.price_per_unit, 1, size_variant.bio, menu.row_uuid, size_variant.date_created, size_variant.row_uuid)
                            .asyncData();
                    }
                }
            }
        }
    })();
    console.log('gen ---> menu size variant');
    /**
     *
     *
     *
     *
     */
    /** insert the menu pictures */
    await (async () => {
        /** fetch all partners */
        const all_partners = await new rootDatabase.fetch_partner_all(daoConfig).fetch().asyncData();
        for (const partner of all_partners) {
            const all_kitchens = await new rootDatabase.fetch_kitchens_of_partner(daoConfig).fetch(partner.row_uuid, 'yes').asyncData();
            for (const kitchen of all_kitchens) {
                const all_menus = await new rootDatabase.fetch_menus_of_kitchen(daoConfig).fetch(kitchen.row_uuid).asyncData();
                for (const menu of all_menus) {
                    /** generate the pics of the foods */
                    const food_pics = generate_food_img(10);
                    const images_to_insert = food_pics.map((p) => {
                        return { pic_uri: p, thumbnail_uri: p, size: '0.001', mime_type: 'jpeg', menu_row_uuid: menu.row_uuid, date_created: date_created, row_uuid: uuid() };
                    });

                    await new rootDatabase.insert_multi_menu_picture(daoConfig).fetch(images_to_insert).asyncData();
                }
            }
        }
    })();
    console.log('gen ---> menu pictures');
    /**
     *
     *
     *
     *
     */
    /** generate the user of the owners */
    await (async () => {
        const all_owner = await new rootDatabase.fetch_owner_all(daoConfig).fetch().asyncData();
        for (const owner of all_owner) {
            /** genrate 40 males and 40 females */
            const gen_males = generate_users(2, 'male');
            for (const male_user of gen_males) {
                await new rootDatabase.insert_user(daoConfig)
                    .fetch(
                        owner.row_uuid,
                        male_user.full_name,
                        male_user.mobile_number,
                        male_user.profile_picture,
                        male_user.bio,
                        male_user.gender,
                        male_user.birth_date,
                        male_user.date_created,
                        male_user.row_uuid
                    )
                    .asyncData();
            }
            /** gen the females user */
            const gen_females = generate_users(2, 'female');
            for (const female_user of gen_females) {
                await new rootDatabase.insert_user(daoConfig)
                    .fetch(
                        owner.row_uuid,
                        female_user.full_name,
                        female_user.mobile_number,
                        female_user.profile_picture,
                        female_user.bio,
                        female_user.gender,
                        female_user.birth_date,
                        female_user.date_created,
                        female_user.row_uuid
                    )
                    .asyncData();
            }

            /** delete the 10 users */
            const user_to_delete = chance.pickset([...gen_females, gen_males], 2);
            for (const del_user of user_to_delete) {
                await new rootDatabase.delete_user(daoConfig).fetch('no', (del_user as any).row_uuid).asyncData();
            }
        }
    })();
    console.log('gen ---> users');
    /**
     *
     *
     *
     *
     */
    /** generate the user delivery address */
    await (async () => {
        const all_users = await new rootDatabase.fetch_user_all(daoConfig).fetch().asyncData();
        for (const user of all_users) {
            /**
             * generate the address for delivery
             *
             */
            const street = chance.street();
            const pincode = chance.zip();
            const city = chance.city();
            const lati = chance.latitude();
            const longi = chance.longitude();
            const state = chance.state();
            const country = chance.country();

            await new rootDatabase.insert_delivery_address(daoConfig).fetch(user.row_uuid, street, pincode, city, state, country, lati, longi, date_created, uuid()).asyncData();
        }
    })();
    console.log('gen ---> users delivery address');
    /**
     *
     *
     *
     *
     */
    /** insert the reviews for the menus */
    await (async () => {
        const all_users = await new rootDatabase.fetch_user_all(daoConfig).fetch().asyncData();
        const all_partners = await new rootDatabase.fetch_partner_all(daoConfig).fetch().asyncData();
        for (const partner of all_partners) {
            const all_kitchens = await new rootDatabase.fetch_kitchens_of_partner(daoConfig).fetch(partner.row_uuid, 'yes').asyncData();
            for (const kitchen of all_kitchens) {
                const all_menus = await new rootDatabase.fetch_menus_of_kitchen(daoConfig).fetch(kitchen.row_uuid).asyncData();
                for (const menu of all_menus) {
                    /** generate the reviews */
                    const all_reviews = generate_reviews(10);
                    for (const review of all_reviews) {
                        await new rootDatabase.insert_menu_review(daoConfig).fetch(menu.row_uuid, chance.pickone(all_users).row_uuid, review.review, review.date_created, review.row_uuid).asyncData();
                    }
                }
            }
        }
    })();
    console.log('gen ---> reviews');
    /**
     *
     *
     *
     *
     */
    /** generate the orders for every partners */
    const can_apply_offer = (start_datetime: string, current_datetime: string, end_datetime: string) => {
        if (+new Date(current_datetime) >= +new Date(start_datetime) && +new Date(current_datetime) <= +new Date(end_datetime)) {
            return true;
        } else {
            return false;
        }
    };

    await (async () => {
        const today_date = moment(new Date());
        const date_maker = new DateMaker(today_date.clone().subtract(1, 'years').format('YYYY-MM-DD'), today_date.format('YYYY-MM-DD'));
        
        for (const date_now of date_maker) {
            const current_date = `${date_now} 10:23:23`;

            const all_owners = await new rootDatabase.fetch_owner_all(daoConfig).fetch().asyncData();
            const all_users = await new rootDatabase.fetch_user_all(daoConfig).fetch().asyncData();

            for (const owner of all_owners) {
                const all_partners = await new rootDatabase.fetch_partners_of_owner(daoConfig).fetch(owner.row_uuid, 'yes').asyncData();

                for (const partner of all_partners) {
                    /** fetch all food category */
                    const all_food_cats = await new rootDatabase.fetch_food_category_of_partner(daoConfig).fetch(partner.row_uuid).asyncData();
                    const all_regional_food_cats = await new rootDatabase.fetch_regional_food_category_of_partner(daoConfig).fetch(partner.row_uuid).asyncData();
                    const all_kitchens = await new rootDatabase.fetch_kitchens_of_partner(daoConfig).fetch(partner.row_uuid, 'yes').asyncData();

                    for (const kitchen of all_kitchens) {
                        const all_menus = await new rootDatabase.fetch_menus_of_kitchen(daoConfig).fetch(kitchen.row_uuid).asyncData();
                        /** fetch the delivery boy */
                        const menu_to_order = chance.pickset(all_menus, Math.floor(all_menus.length / 2));
                        const menu_orders: OrderMenu[] = [];

                        for (const menu of menu_to_order) {
                            const all_menu_variants = await new rootDatabase.fetch_menu_size_variant_of_menu(daoConfig).fetch(menu.row_uuid).asyncData();
                            const menu_variant_to_oder = chance.pickone(all_menu_variants);
                            const amount_to_order = chance.natural({ min: 3, max: 10 });

                            let offer_percentage: number = 0;
                            const food_cat = all_food_cats.filter((p) => p.row_uuid === menu.food_category_row_uuid)[0];
                            const regional_food_cat = all_regional_food_cats.filter((p) => p.row_uuid === menu.regional_food_category_row_uuid)[0];

                            /** extract the offers */
                            if (
                                menu_variant_to_oder.offer_percentage !== 0 &&
                                menu_variant_to_oder.is_active === 'yes' &&
                                can_apply_offer(menu_variant_to_oder.offer_start_datetime, current_date, menu_variant_to_oder.offer_end_datetime)
                            ) {
                                offer_percentage = +menu_variant_to_oder.offer_percentage;
                            } else if (menu.offer_percentage !== 0 && menu.is_active === 'yes' && can_apply_offer(menu.offer_start_datetime, current_date, menu.offer_end_datetime)) {
                                offer_percentage = +menu.offer_percentage;
                            } else if (kitchen.offer_percentage !== 0 && kitchen.is_active === 'yes' && can_apply_offer(kitchen.offer_start_datetime, current_date, kitchen.offer_end_datetime)) {
                                offer_percentage = +kitchen.offer_percentage;
                            } else if (
                                regional_food_cat.offer_percentage !== 0 &&
                                regional_food_cat.is_active === 'yes' &&
                                can_apply_offer(regional_food_cat.offer_start_datetime, current_date, regional_food_cat.offer_end_datetime)
                            ) {
                                offer_percentage = +regional_food_cat.offer_percentage;
                            } else if (food_cat.offer_percentage !== 0 && food_cat.is_active === 'yes' && can_apply_offer(food_cat.offer_start_datetime, current_date, food_cat.offer_end_datetime)) {
                                offer_percentage = +food_cat.offer_percentage;
                            } else {
                                offer_percentage = 0;
                            }

                            const after_offer_price = menu_variant_to_oder.price_per_unit - (menu_variant_to_oder.price_per_unit * offer_percentage) / 100;

                            const order_menu_item: OrderMenu = {
                                menu_size_variant_row_uuid: menu_variant_to_oder.row_uuid,
                                menu_size_variant_name: menu_variant_to_oder.name,
                                menu_row_uuid: menu.row_uuid,
                                menu_row_name: menu.menu_name,
                                amount: amount_to_order,

                                cooking_instruction: chance.sentence({ words: 12 }),
                                original_price: +menu_variant_to_oder.price_per_unit,
                                after_offer_price: +after_offer_price.toFixed(2),
                                money_saved: +menu_variant_to_oder.price_per_unit - +after_offer_price.toFixed(2),
                                row_uuid: uuid(),
                                date_created: current_date,
                            };

                            menu_orders.push(order_menu_item);
                        }

                        /** calculate the payable amount */
                        const maped_price = menu_orders.map((p) => {
                            return { total_payable_amount: p.after_offer_price * +p.amount, total_amount_saved: p.money_saved * +p.amount };
                        });

                        const final_maped_price = maped_price.reduce((prev, current) => {
                            return { total_payable_amount: prev.total_payable_amount + current.total_payable_amount, total_amount_saved: prev.total_amount_saved + current.total_amount_saved };
                        });

                        const delivery_charge = 0.0;
                        const tax = 0.0;
                        const user_ordering = chance.pickset(all_users, 1);

                        for (const user_order of user_ordering) {
                            const user_address = await new rootDatabase.fetch_delivery_address_of_user(daoConfig).fetch(user_order.row_uuid).asyncData();

                            /** insert the order */
                            const order_row_uuid = uuid();
                            await new rootDatabase.insert_order(daoConfig)
                                .fetch(
                                    user_order.row_uuid,
                                    partner.row_uuid,
                                    kitchen.row_uuid,
                                    'COD',
                                    'pending',
                                    +final_maped_price.total_payable_amount.toFixed(2),
                                    0,
                                    delivery_charge,
                                    +final_maped_price.total_amount_saved.toFixed(2),
                                    JSON.stringify(get_initial_order_lifecycle()),
                                    JSON.stringify(menu_orders),
                                    user_address[0].row_uuid,
                                    current_date,
                                    order_row_uuid
                                )
                                .asyncData();
                        }
                    }
                }
            }
        }
    })();
    console.log('gen----> orders');

    /** update the order status */
    await (async () => {
        const all_orders = await new rootDatabase.fetch_order_all(daoConfig).fetch().asyncData();

        const order_to_update = chance.pickset(all_orders, Math.floor((all_orders.length * 90) / 100));
        const order_to_cancel = order_to_update.slice(0, Math.floor(order_to_update.length / 4));
        const order_to_delivered = order_to_update.slice(Math.floor(order_to_update.length / 4));

        console.log(order_to_update.length, order_to_delivered.length, order_to_cancel.length);

        for (const order of order_to_delivered) {
            const all_dboys = await new rootDatabase.fetch_dboy_of_kitchen(daoConfig).fetch(order.kitchen_row_uuid).asyncData();
            const dboy_to_delievr = chance.pickone(all_dboys);
            await new rootDatabase.update_order_assign_dboy(daoConfig).fetch(dboy_to_delievr.row_uuid, order.row_uuid).asyncData();

            await (await new rootDatabase.update_t_order_lifecycle(daoConfig).fetch('order confirmed then cooking', order.row_uuid)).asyncData();
            await (await new rootDatabase.update_t_order_lifecycle(daoConfig).fetch('order pickedup then order on its way', order.row_uuid)).asyncData();
            await (await new rootDatabase.update_t_order_lifecycle(daoConfig).fetch('order delivered', order.row_uuid)).asyncData();
        }

        for (const order of order_to_cancel) {
            const all_dboys = await new rootDatabase.fetch_dboy_of_kitchen(daoConfig).fetch(order.kitchen_row_uuid).asyncData();
            const dboy_to_delievr = chance.pickone(all_dboys);
            await new rootDatabase.update_order_assign_dboy(daoConfig).fetch(dboy_to_delievr.row_uuid, order.row_uuid).asyncData();

            await (await new rootDatabase.update_t_order_lifecycle(daoConfig).fetch('order confirmed then cooking', order.row_uuid)).asyncData();
            await (await new rootDatabase.update_t_order_lifecycle(daoConfig).fetch('order pickedup then order on its way', order.row_uuid)).asyncData();
            await (await new rootDatabase.update_t_order_lifecycle(daoConfig).fetch('canceled', order.row_uuid)).asyncData();
        }
    })();
}

export async function add_test_data(MYSQL_CONFIG: MYSQLConnectionConfig, db_instance_name: string) {
    /** Delete the database if exit first */
    FoodbzrDatasource.initInstance();
    const serverQuery = new QueryServerDatabase(MYSQL_CONFIG, db_instance_name);

    try {
        await generate_test_data({ runType: 'normal', serverQuery: serverQuery, asyncServerQuery: serverQuery }, MYSQL_CONFIG, db_instance_name);
        serverQuery.dispose_connection();
        return 'OK';
    } catch (error) {
        console.error(error, 'error');
        serverQuery.dispose_connection();
    }
}
