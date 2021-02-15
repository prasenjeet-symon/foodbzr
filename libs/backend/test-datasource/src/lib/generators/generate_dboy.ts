/**
 * Generate the dboys
 */
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { Chance } from 'chance';
import { generate_profile_picture } from './generate_profile_picture';

export function generate_dboys(amount: number) {
    if (+amount < 1) {
        return [];
    }

    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const chance = new Chance();
    const looper = new Array(+amount).fill(null);

    const all_dboys: {
        full_name: string;
        bio: string;
        mobile_number: string;
        birth_date: string;
        gender: 'male' | 'female';
        date_created: string;
        row_uuid: string;
        profile_picture: string;
    }[] = [];

    for (const item of looper) {
        const full_name: string = chance.name({ gender: 'male' });
        const birth_date: string = moment(chance.birthday()).format('YYYY-MM-DD');
        const mobile_number = chance.phone({ country: 'uk', mobile: true });
        const profile_picture = generate_profile_picture('male', 'adult');
        const bio: string = chance.sentence({ words: 12 });

        all_dboys.push({ full_name, bio, birth_date, mobile_number, profile_picture, date_created, row_uuid: uuid(), gender: 'male' });
    }

    return all_dboys;
}
