/**
 * Gen user for the foodbzr
 */
import { Chance } from 'chance';
import { generate_profile_picture } from './generate_profile_picture';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

type gender = 'male' | 'female';

export function generate_users(amount: number, gender: gender) {
    if (amount < 1) {
        return [];
    }

    /** gen the users */
    const chance = new Chance();
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const all_users: {
        full_name: string;
        mobile_number: string;
        profile_picture: string;
        gender: gender;
        date_created: string;
        row_uuid: string;
        bio: string;
        birth_date: string;
    }[] = [];

    for (let index = 0; index < +amount; index++) {
        const full_name = chance.name({ gender: gender });
        const mobile_number = chance.phone({ country: 'uk', mobile: true });
        const profile_picture = generate_profile_picture(gender, 'adult');
        const bio: string = chance.sentence({ words: 12 });
        const birth_date = moment(chance.birthday()).format('YYYY-MM-DD');

        all_users.push({
            full_name,
            profile_picture,
            mobile_number,
            gender,
            date_created,
            row_uuid: uuid(),
            bio,
            birth_date,
        });
    }

    return all_users;
}
