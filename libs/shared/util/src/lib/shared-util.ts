import { fetch_push_message_fcm_tokens } from '@foodbzr/datasource';
import { IGetOrder, IGetOrderStatus, IGetOrderStatusGroupedKitchen } from '@foodbzr/shared/types';
import { NodeJsModules } from '@sculify/node-room';
import axios from 'axios';
import { Chance } from 'chance';
import * as moment from 'moment';

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

export function convertJsDateToSQL(date_string: string) {
    const SQL_DATE = moment(new Date(date_string)).format('YYYY-MM-DD HH:mm:ss');
    return SQL_DATE;
}

export class DateIterator implements IterableIterator<string> {
    protected start_moment_date!: moment.Moment;
    protected end_moment_date!: moment.Moment;
    protected current_date!: moment.Moment;

    constructor(protected start_date: string, end_date: string) {
        this.start_moment_date = moment(new Date(start_date));
        this.end_moment_date = moment(new Date(end_date));
    }

    public next(): IteratorResult<string> {
        if (this.current_date) {
            this.current_date = this.current_date.add('1', 'day');
        } else {
            this.current_date = this.start_moment_date;
        }

        if (this.current_date > this.end_moment_date) {
            return {
                done: true,
                value: '',
            };
        } else {
            return {
                done: false,
                value: this.current_date.format('YYYY-MM-DD'),
            };
        }
    }

    [Symbol.iterator](): IterableIterator<string> {
        return this;
    }
}

/** make the order stacked report */

export function makeOrderStackedGraphData(start_date: string, end_date: string, orders: IGetOrder[]) {
    const date_ite = new DateIterator(start_date, end_date);

    const labels: string[] = [];
    const delivered_orders_counts: number[] = [];
    const canceled_orders_counts: number[] = [];

    for (const current_date of date_ite) {
        const found_items = orders.filter((p) => moment(new Date(p.date_created)).format('YYYY-MM-DD') === current_date);
        const canceled_orders = found_items.filter((p) => p.delivery_status === 'canceled');
        const delivered_orders = found_items.filter((p) => p.delivery_status === 'delivered');

        labels.push(current_date);
        delivered_orders_counts.push(delivered_orders.length);
        canceled_orders_counts.push(canceled_orders.length);
    }

    return {
        labels,
        delivered_orders_counts,
        canceled_orders_counts,
    };
}

/** make the order stacked report money */
export function makeOrderMoneyStackedGraphData(start_date: string, end_date: string, orders: IGetOrder[]) {
    const date_ite = new DateIterator(start_date, end_date);

    const labels: string[] = [];
    const delivered_orders_counts: number[] = [];
    const canceled_orders_counts: number[] = [];

    for (const current_date of date_ite) {
        const found_items = orders.filter((p) => moment(new Date(p.date_created)).format('YYYY-MM-DD') === current_date);
        const canceled_orders = found_items.filter((p) => p.delivery_status === 'canceled');
        const delivered_orders = found_items.filter((p) => p.delivery_status === 'delivered');

        const reduce_initial_value = { amount_paid: 0 };

        /** sum the money */
        const total_delivered_amount = delivered_orders
            .map((p) => {
                return { amount_paid: p.amount_paid };
            })
            .reduce((prev, curr) => {
                return { amount_paid: +prev.amount_paid + +curr.amount_paid };
            }, reduce_initial_value).amount_paid;

        const total_canceled_amount = canceled_orders
            .map((p) => {
                return { amount_paid: p.amount_paid };
            })
            .reduce((prev, curr) => {
                return { amount_paid: +prev.amount_paid + +curr.amount_paid };
            }, reduce_initial_value).amount_paid;

        labels.push(current_date);
        delivered_orders_counts.push(+total_delivered_amount.toFixed(2));
        canceled_orders_counts.push(+total_canceled_amount.toFixed(2));
    }

    console.log(delivered_orders_counts, 'JKK');

    return {
        labels,
        delivered_orders_counts,
        canceled_orders_counts,
    };
}

/** make the order stacked report money */
export function makeOrderCommisionStackedGraphData(start_date: string, end_date: string, orders: IGetOrder[], commission: number) {
    const date_ite = new DateIterator(start_date, end_date);

    const labels: string[] = [];
    const delivered_orders_counts: number[] = [];

    for (const current_date of date_ite) {
        // single day
        const found_items = orders.filter((p) => moment(new Date(p.date_created)).format('YYYY-MM-DD') === current_date);
        const delivered_orders = found_items.filter((p) => p.delivery_status === 'delivered');

        const reduce_initial_value = { amount_paid: 0 };

        /** sum the money */
        const total_delivered_amount = delivered_orders
            .map((p) => {
                return { amount_paid: p.amount_paid };
            })
            .reduce((prev, curr) => {
                return { amount_paid: +prev.amount_paid + +curr.amount_paid };
            }, reduce_initial_value).amount_paid;

        const one_day_owner_commision: number = (total_delivered_amount * commission) / 100;

        labels.push(current_date);
        delivered_orders_counts.push(+one_day_owner_commision.toFixed(2));
    }

    return {
        labels,
        delivered_orders_counts,
    };
}

/**
 * upload the image to imageBB and return the json data back
 */

export class UploadToImageBB {
    constructor(private base64Data: any, private apiKey: string) {}

    public async uploadMedia() {
        try {
            const uplaodImage = await axios.post(`https://api.imgbb.com/1/upload?key=${this.apiKey}`, {
                image: this.base64Data,
            });

            return {
                pic_uri: uplaodImage.data.data.image.url,
                thumbnail_uri: uplaodImage.data.data.thumb.url,
                delete_uri: uplaodImage.data.data.delete_url,
                mime: uplaodImage.data.data.thumb.mime,
                size: uplaodImage.data.data.size,
            };
        } catch (error) {
            console.error(error);
        }
    }
}

export function addressFromForAddres(formatted_address: string, lat: number, lng: number) {
    const comma_separated = formatted_address.split(',');
    const country = comma_separated[comma_separated.length - 1];
    const pincode_state = comma_separated[comma_separated.length - 2].split(' ');
    const pincode = pincode_state[pincode_state.length - 1];
    const state = pincode_state[pincode_state.length - 2];

    const city = comma_separated[comma_separated.length - 3];
    const street = comma_separated.slice(0, comma_separated.length - 3).join(', ');

    return {
        street,
        city,
        pincode,
        state,
        country,
        lat,
        lng,
    };
}

/** send the message to mobile */
export async function sendSMS(to: string, sms: string) {
    const client = NodeJsModules.getInstance().getModule('Twilio')(process.env.accountSid, process.env.authToken);

    return

    const data = await client.messages.create({
        body: sms,
        from: '+19283774074',
        to: `+91 ${to}`,
    });

    return data;
}

/** send the push message */
export async function send_push_message(heading: string, body: string, banner_uri: string, data: any, fcm_token: string[]) {
    const admin = NodeJsModules.getInstance().getModule('FirebaseAdmin');
    const message = {
        notification: {
            title: heading,
            body: body,
        },
        android: {
            notification: {
                image: banner_uri,
            },
        },
        apns: {
            payload: {
                aps: {
                    'mutable-content': 1,
                },
            },
            fcm_options: {
                image: banner_uri,
            },
        },
        webpush: {
            headers: {
                image: banner_uri,
            },
        },
        data: data,
        tokens: fcm_token,
    };
    await admin.messaging().sendMulticast(message);
    return true;
}

export async function uri_to_blob(uri: string) {
    return await fetch(uri)
        .then((res) => res.blob())
        .then((data) => {
            return data;
        });
}

/** send the push  message to the user */
export const send_push_message_to_user = async (daoConfig: any, user_row_uuid: string, heading: string, body: string, image_uri: string, data: any) => {
    /** send the push to user */
    const pushData = await new fetch_push_message_fcm_tokens(daoConfig).fetch('user', user_row_uuid).asyncData(this);
    if (pushData.length === 0) {
        return;
    }

    return send_push_message(
        heading,
        body,
        image_uri,
        data,
        find_unique_items(pushData, 'push_address').map((p) => p.push_address)
    );
};

/** send the push  message to the partner */
export const send_push_message_to_partner = async (daoConfig: any, partner_row_uuid: string, heading: string, body: string, image_uri: string, data: any) => {
    /** send the push to user */
    const pushData = await new fetch_push_message_fcm_tokens(daoConfig).fetch('partner', partner_row_uuid).asyncData(this);
    if (pushData.length === 0) {
        return;
    }

    return send_push_message(
        heading,
        body,
        image_uri,
        data,
        find_unique_items(pushData, 'push_address').map((p) => p.push_address)
    );
};

/** send the push  message to the owner */
export const send_push_message_to_owner = async (daoConfig: any, owner_row_uuid: string, heading: string, body: string, image_uri: string, data: any) => {
    /** send the push to user */
    const pushData = await new fetch_push_message_fcm_tokens(daoConfig).fetch('owner', owner_row_uuid).asyncData(this);
    if (pushData.length === 0) {
        return;
    }

    return send_push_message(
        heading,
        body,
        image_uri,
        data,
        find_unique_items(pushData, 'push_address').map((p) => p.push_address)
    );
};

/** send the push  message to the dboy */
export const send_push_message_to_dboy = async (daoConfig: any, dboy_row_uuid: string, heading: string, body: string, image_uri: string, data: any) => {
    /** send the push to user */
    const pushData = await new fetch_push_message_fcm_tokens(daoConfig).fetch('dboy', dboy_row_uuid).asyncData(this);
    if (pushData.length === 0) {
        return;
    }

    return send_push_message(
        heading,
        body,
        image_uri,
        data,
        find_unique_items(pushData, 'push_address').map((p) => p.push_address)
    );
};

/** media server  */
export const media_server_url = 'https://foodbzr.xyz/';

/** group the order status for owner  */
export const group_order_status_in_kitchen = (orders: IGetOrderStatus[]) => {
    if (!orders) {
        return;
    }

    if (orders.length === 0) {
        return;
    }

    const unique_kitchens = find_unique_items(orders, 'kitchen_row_uuid');
    const grouped_items: IGetOrderStatusGroupedKitchen[] = [];

    unique_kitchens.forEach((kit) => {
        const found_orders = orders.filter((p) => p.kitchen_row_uuid === kit.kitchen_row_uuid);
        grouped_items.push({
            kitchen_name: kit.kitchen_name,
            address: kit.kitchen_address,
            kitchen_row_uuid: kit.kitchen_row_uuid,
            orders: found_orders,
        });
    });

    return grouped_items;
};
