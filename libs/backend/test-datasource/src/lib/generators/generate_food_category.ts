/**
 *  Generate the food category
 */
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { Chance } from 'chance';

export function generate_food_category() {
    const chance = new Chance();
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const veg_food = {
        name: 'veg',
        profile_picture: 'https://www.flaticon.com/svg/vstatic/svg/616/616428.svg?token=exp=1612712929~hmac=d9b8cf3d78de55111e559cca5d2845d8',
        date_created: date_created,
        row_uuid: uuid(),
        offer_percentage: chance.natural({ min: 5, max: 20 }),
        offer_start_datetime: moment(new Date('2021-01-07 10:30:00')).format('YYYY-MM-DD HH:mm:ss'),
        offer_end_datetime: moment(new Date('2021-01-07 10:30:00')).add(3, 'months').format('YYYY-MM-DD HH:mm:ss'),
    };
    const non_veg = {
        name: 'non veg',
        profile_picture: 'https://www.flaticon.com/svg/vstatic/svg/1046/1046751.svg?token=exp=1612713159~hmac=31d55870041ea94ea92badb492ddb356',
        date_created: date_created,
        row_uuid: uuid(),
        offer_percentage: chance.natural({ min: 5, max: 20 }),
        offer_start_datetime: moment(new Date('2021-01-07 10:30:00')).format('YYYY-MM-DD HH:mm:ss'),
        offer_end_datetime: moment(new Date('2021-01-07 10:30:00')).add(3, 'months').format('YYYY-MM-DD HH:mm:ss'),
    };

    return [veg_food, non_veg];
}
