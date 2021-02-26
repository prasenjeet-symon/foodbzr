/**
 *  Generate the menus for the kitchens
 */
import * as moment from 'moment';
import { Chance } from 'chance';
import { generate_food_img } from './generate_food_img';
import { v4 as uuid } from 'uuid';

export function generate_menus(amount: number) {
    if (amount < 1) {
        return [];
    }

    const chance = new Chance();
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const all_generated_menus: {
        name: string;
        profile_picture: string;
        offer_percentage: number;
        offer_start_datetime: string;
        offer_end_datetime: string;
        date_created: string;
        row_uuid: string;
        bio: string;
    }[] = [];

    const looper = new Array(amount).fill(null);

    for (const item of looper) {
        const menu_name: string = chance.sentence({ words: 3 });
        const profile_picture: string = generate_food_img(1)[0];
        const offer_percentage = chance.natural({ min: 5, max: 30 });
        const offer_start_datetime = moment(new Date('2021-01-07 10:30:00')).format('YYYY-MM-DD HH:mm:ss');
        const offer_end_datetime = moment(new Date('2021-01-07 10:30:00')).add(3, 'months').format('YYYY-MM-DD HH:mm:ss');
        const bio = chance.sentence({ words: 12 });

        all_generated_menus.push({ name: menu_name, profile_picture, offer_percentage, offer_end_datetime, offer_start_datetime, date_created: date_created, row_uuid: uuid(), bio });
    }

    return all_generated_menus;
}
