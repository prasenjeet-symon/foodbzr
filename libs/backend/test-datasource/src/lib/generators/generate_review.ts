import { Chance } from 'chance';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

export function generate_reviews(amount: number) {
    if (+amount < 1) {
        return [];
    }

    const chance = new Chance();
    const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

    const all_reviews: { review: string; date_created: string; row_uuid: string; user_row_uuid: string }[] = [];

    for (let index = 0; index < +amount; index++) {
        const review = chance.sentence({ words: chance.integer({ min: 12, max: 25 }) });
        all_reviews.push({ review, date_created, row_uuid: uuid(), user_row_uuid: null });
    }
    return all_reviews;
}
