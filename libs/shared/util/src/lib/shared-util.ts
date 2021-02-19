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

/** is pure number */
export const is_pure_number = (str: string | number) => {
    if (isNaN(Number(str))) {
        return false;
    } else {
        return true;
    }
};

export const google_map_dark_theme = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
    },
];

export const find_unique_items = <T>(items: T[], key: string) => {
    const unique_one: T[] = [];
    items.forEach((p) => {
        if (unique_one.some((val) => val[key] === p[key])) {
        } else {
            // push the item
            unique_one.push(p);
        }
    });

    return unique_one;
};

export const can_apply_offer = (start_datetime: string, current_datetime: string, end_datetime: string) => {
    if (+new Date(current_datetime) >= +new Date(start_datetime) && +new Date(current_datetime) <= +new Date(end_datetime)) {
        return true;
    } else {
        return false;
    }
};
