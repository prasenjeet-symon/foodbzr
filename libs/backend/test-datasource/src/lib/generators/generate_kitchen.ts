import { Chance } from 'chance';
import * as moment from 'moment';
import { generate_kitchen_imgs } from './generate_kitchen_img';
import { v4 as uuid } from 'uuid';

/** Generate the kitchen */

export function generate_kitchens(amount: number) {
    if (amount < 1) {
        return [];
    }

    const chance = new Chance();
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const all_gen_kitchens: {
        kitchen_name: string;
        kitchen_image: string;
        kitchen_password: string;
        kitchen_user_id: string;
        date_created: string;
        row_uuid: string;
        latitude: number;
        longitude: number;
        street: string;
        pincode: string;
        state: string;
        country: string;
        opening_time: string;
        closing_time: string;
        open_week_list: string;
        city: string;
    }[] = [];
    for (let index = 0; index < +amount; index++) {
        /** create the kitchen data */
        const kitchen_name = chance.sentence({ words: chance.natural({ min: 3, max: 5 }) });
        const kitchen_image = generate_kitchen_imgs(1)[0];
        const kitchen_password = null;
        const kitchen_user_id = null;

        /** address info */
        const street: string = chance.street();
        const pincode = chance.zip();
        const latitude = chance.latitude();
        const longitude = chance.longitude();
        const city = chance.city();
        const state: string = chance.state();
        const country = chance.country();
        const start_time = moment(new Date('2020-01-01 10:00:00'));
        const opening_time = start_time.format('HH:mm:ss');
        const closing_time = start_time.add(8, 'hour').format('HH:mm:ss');
        const open_week_list = [1, 2, 3, 4, 5, 6, 7];
        all_gen_kitchens.push({
            kitchen_name,
            kitchen_image,
            kitchen_password,
            kitchen_user_id,
            street,
            pincode,
            latitude,
            longitude,
            state,
            country,
            date_created: date_created,
            row_uuid: uuid(),
            open_week_list: JSON.stringify(open_week_list),
            opening_time,
            closing_time,
            city
        });
    }

    return all_gen_kitchens;
}
