/** create the menu size variants */

import { Chance } from 'chance';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { generate_food_img } from './generate_food_img';

export function generate_menu_size_variant(amount: number) {
    if (+amount < 1) {
        return [];
    }

    /** create the menus */
    const chance = new Chance();
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const all_menu_size_variant: {
        name: string;
        profile_picture: string;
        price_per_unit: number;
        offer_percentage: number;
        offer_start_datetime: string;
        offer_end_datetime: string;
        date_created: string;
        row_uuid: string;
        bio: string;
    }[] = [];
    for (let index = 0; index < +amount; index++) {
        const name: string = chance.sentence({ words: 3 });
        const profile_picture: string = generate_food_img(1)[0];
        const price_per_unit: number = chance.floating({ min: 100, max: 560, fixed: 2 });
        const offer_percentage: number = chance.natural({ min: 5, max: 15 });
        const offer_start_datetime = moment(new Date('2021-01-07 10:30:00')).format('YYYY-MM-DD HH:mm:ss');
        const offer_end_datetime = moment(new Date('2021-01-07 10:30:00')).add(3, 'months').format('YYYY-MM-DD HH:mm:ss');
        const bio: string = chance.sentence({ words: 12 });

        all_menu_size_variant.push({ name, profile_picture, price_per_unit, offer_percentage, offer_end_datetime, offer_start_datetime, date_created, row_uuid: uuid(), bio });
    }

    return all_menu_size_variant;
}
