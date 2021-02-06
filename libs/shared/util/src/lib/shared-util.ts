import * as moment from 'moment';
import { Chance } from 'chance';

export function convert_object_to_sql_object(obj: any) {
    Object.keys(obj).forEach((p) => {
        const value = obj[p];
        if (!value && value !== 0) {
            // value is either null or 0 undefined
            obj[p] = 'NULL';
        }
    });

    return obj;
}

/**
 * Initial order lifecycle object
 */
export const get_initial_order_lifecycle = () => {
    const initial_order_lifecycle = [
        { name: 'order placed', is_done: true, date_created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), date_updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
        { name: 'order confirmed', is_done: false, date_created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), date_updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
        { name: 'cooking', is_done: false, date_created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), date_updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
        { name: 'order pickedup', is_done: false, date_created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), date_updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
        { name: 'order on its way', is_done: false, date_created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), date_updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
        { name: 'order delivered', is_done: false, date_created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), date_updated: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
    ];

    return initial_order_lifecycle;
};

/**
 *  Generate the otp
 */
export const generate_otp = (length: number) => {
    if (length <= 3) {
        return `12345`;
    }
    const chance = new Chance();
    const otp_numbers: number[] = [];
    for (let index = 0; index < +length; index++) {
        otp_numbers.push(chance.natural({ min: 1, max: 9 }));
    }
    return otp_numbers.join('');
};
