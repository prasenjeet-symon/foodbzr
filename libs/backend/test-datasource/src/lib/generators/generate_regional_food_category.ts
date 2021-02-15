/**
 *  Generate the regional food category
 */
import * as moment from 'moment';
import { Chance } from 'chance';
import { v4 as uuid } from 'uuid';
import { generate_food_img } from './generate_food_img';

export function generate_regional_food_category(amount: number) {
    if (+amount < 1) {
        return [];
    }

    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const chance = new Chance();
    const all_regional_food_cat: {
        name: string;
        profile_picture: string;
        date_created: string;
        row_uuid: string;
        offer_percentage: number;
        offer_end_datetime: string;
        offer_start_datetime: string;
    }[] = [];

    for (let index = 0; index < +amount; index++) {
        const name: string = chance.sentence({ words: 3 });
        const profile_picture = generate_food_img(1)[0];
        const offer_percentage = chance.natural({ min: 5, max: 25 });
        const offer_start_datetime = moment(new Date('2021-01-07 10:30:00')).format('YYYY-MM-DD HH:mm:ss');
        const offer_end_datetime = moment(new Date('2021-01-07 10:30:00')).add(3, 'months').format('YYYY-MM-DD HH:mm:ss');

        all_regional_food_cat.push({ name: name, profile_picture: profile_picture, offer_percentage, offer_start_datetime, offer_end_datetime, date_created, row_uuid: uuid() });
    }

    return all_regional_food_cat;
}
