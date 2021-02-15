/**
 * Gen user for the foodbzr
 */
import { Chance } from 'chance';
import { generate_profile_picture } from './generate_profile_picture';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

type gender = 'male' | 'female';

export function generate_owner(amount: number, gender: gender) {
    if (amount < 1) {
        return [];
    }

    /** gen the users */
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const chance = new Chance();
    const all_owners: { full_name: string; bio: string; mobile_number: string; profile_picture: string; gender: gender; date_created: string; row_uuid: string }[] = [];

    for (let index = 0; index < +amount; index++) {
        const full_name = chance.name({ gender: gender });
        const mobile_number = chance.phone({ country: 'uk', mobile: true });
        const profile_picture = generate_profile_picture(gender, 'adult');
        const bio = chance.sentence({ words: 12 });

        all_owners.push({
            profile_picture: profile_picture,
            full_name: full_name,
            mobile_number: mobile_number,
            bio: bio,
            gender: gender,
            date_created: date_created,
            row_uuid: uuid(),
        });
    }

    return all_owners;
}
