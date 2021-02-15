/**
 * Gen user for the foodbzr
 */
import { Chance } from 'chance';
import { generate_profile_picture } from './generate_profile_picture';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

type gender = 'male' | 'female';

export function generate_partner(amount: number, gender: gender) {
    if (amount < 1) {
        return [];
    }

    /** gen the users */
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const chance = new Chance();
    const all_partners: {
        full_name: string;
        mobile_number: string;
        profile_picture: string;
        gender: gender;
        bio: string;
        date_created: string;
        row_uuid: string;
    }[] = [];

    for (let index = 0; index < +amount; index++) {
        const full_name = chance.name({ gender: gender });
        const mobile_number = chance.phone({ country: 'uk', mobile: true });
        const profile_picture = generate_profile_picture(gender, 'adult');
        const bio: string = chance.sentence({ words: 12 });

        all_partners.push({
            full_name: full_name,
            mobile_number: mobile_number,
            profile_picture: profile_picture,
            bio: bio,
            date_created: date_created,
            row_uuid: uuid(),
            gender: gender,
        });
    }

    return all_partners;
}
