export type gender = 'male' | 'female' | 'other';
export const gender_values = ['male', 'female', 'other'];
export enum e_gender {
    male = 'male',
    female = 'female',
    other = 'other',
}

export type is_active = 'yes' | 'no';
export const is_active_values = ['yes', 'no'];
export enum e_is_active {
    yes = 'yes',
    no = 'no',
}

export interface IModificationDaoStatus {
    status: 'OK';
    status_code: 200;
    changedRows: number;
    affectedRows: number;
    insertId: number;
}

export interface IGetOwner {
    mobile_number: string;
    full_name: string;
    bio: string;
    gender: gender;
    last_otp: string;
    profile_picture: string;
    is_active: is_active;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export interface IGetPartner {
    owner_row_uuid: string;
    is_active: is_active;
    profile_picture: string;
    gender: gender;
    full_name: string;
    mobile_number: string;
    bio: string;
    date_created: string;
    row_uuid: string;
}

export const week_name_values = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export interface IGetKitchen {
    partner_row_uuid: string;
    is_active: is_active;
    kitchen_user_id: string;
    kitchen_name: string;
    profile_picture: string;
    radius: number;
    latitude: number;
    longitude: number;
    opening_time: string;
    closing_time: string;
    open_week_list: string[];
    offer_start_datetime: string;
    offer_end_datetime: string;
    street: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export interface IGetMenu {
    menu_name: string;
    is_active: is_active;
    profile_picture: string;
    bio: string;
    kitchen_row_uuid: string;
    regional_food_category_row_uuid: string;
    regional_food_category_name: string;
    food_category_row_uuid: string;
    food_category_name: string;
    offer_percentage: number;
    offer_start_datetime: string;
    offer_end_datetime: string;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export interface IGetFoodCategory {
    name: string;
    is_active: is_active;
    profile_picture: string;
    partner_row_uuid: string;
    offer_percentage: string;
    offer_start_datetime: string;
    offer_end_datetime: string;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export interface IGetRegionalFoodCategory {
    name: string;
    is_active: is_active;
    profile_picture: string;
    partner_row_uuid: string;
    offer_percentage: number;
    offer_start_datetime: string;
    offer_end_datetime: string;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

/** Currency  */
export enum e_currency {
    INR = 'INR',
    USD = 'USD',
}

export const currency_values = ['INR', 'USD'];
export type currency = 'USD' | 'INR';

export interface IGetMenuSizeVariant {
    name: string;
    profile_picture: string;
    price_per_unit: number;
    currency: number;
    min_order_amount: number;
    bio: string;
    menu_row_uuid: string;
    is_active: is_active;
    offer_percentage: number;
    offer_start_datetime: string;
    offer_end_datetime: string;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export interface IGetMenuPicture {
    menu_row_uuid: string;
    pic_uri: string;
    thumbnail_uri: string;
    size: number;
    mime_type: string;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export interface IGetMenuReview {
    menu_row_uuid: string;
    user_row_uuid: string;
    review: string;
    is_active: is_active;
    positive_points: number;
    negative_points: number;
    date_created: string;
    date_updated: string;
    row_uuid: string;
    full_name: string;
    profile_picture: string;
}

export interface IGetUser {
    owner_row_uuid: string;
    full_name: string;
    mobile_number: string;
    profile_picture: string;
    bio: string;
    is_active: is_active;
    gender: gender;
    birth_date: string;
    last_otp: string;
    is_mobile_verified: is_active;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export interface IGetDBoy {
    kitchen_row_uuid: string;
    full_name: string;
    mobile_number: string;
    profile_picture: string;
    gender: gender;
    is_active: is_active;
    is_mobile_verified: is_active;
    last_otp: string;
    birth_date: string;
    is_verified: is_active;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export type delivery_status = 'placed' | 'confirmed' | 'canceled' | 'delivered';
export const delivery_status_values = ['placed', 'confirmed', 'canceled', 'delivered'];

export type pay_type = 'COD' | 'ONLINE';
export const pay_type_values = ['COD', 'ONLINE'];

export type pay_status = 'paid' | 'pending' | 'refunded';
export const pay_status_values = ['paid', 'pending', 'refunded'];

export type order_lifecycle_state = 'order placed' | 'order confirmed' | 'cooking' | 'order pickedup' | 'order on its way' | 'order delivered' | 'canceled';
export const order_lifecycle_state_values = ['order placed', 'order confirmed', 'cooking', 'order pickedup', 'order on its way', 'order delivered', 'canceled'];

export interface IOrderLifeCycle {
    name: order_lifecycle_state;
    is_done: boolean;
    date_created: string;
    date_updated: string;
}
export interface IFetchOrderLifecycle {
    lifecycle: IOrderLifeCycle[];
}

export interface IGetOrder {
    user_row_uuid: string;
    partner_row_uuid: string;
    kitchen_row_uuid: string;
    dboy_row_uuid: string;
    delivery_status: delivery_status;
    pay_type: pay_type;
    pay_status: pay_status;
    otp: string;
    amount_paid: number;
    bzrcoin_used: number;
    delivery_charge: number;
    user_saved_amount: number;
    lifecycle: IOrderLifeCycle[];
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export interface IGetUserCartFull {
    user_row_uuid: string;
    amount: number;
    date_created: string;
    date_updated: string;
    row_uuid: string;

    menu_size_variant_price_per_unit: number;
    menu_size_variant_name: string;
    menu_size_variant_offer_percentage: number;
    menu_size_variant_offer_start_datetime: string;
    menu_size_variant_offer_end_datetime: string;
    menu_size_variant_row_uuid: string;

    menu_menu_name: string;
    menu_offer_percentage: number;
    menu_offer_start_datetime: string;
    menu_offer_end_datetime: string;
    menu_row_uuid: string;

    kitchen_kitchen_name: string;
    kitchen_offer_percentage: number;
    kitchen_offer_start_datetime: string;
    kitchen_offer_end_datetime: string;
    kitchen_row_uuid: string;

    regional_food_category_name: string;
    regional_food_category_offer_percentage: number;
    regional_food_category_offer_start_datetime: string;
    regional_food_category_offer_end_datetime: string;
    regional_food_category_row_uuid: string;

    food_category_name: string;
    food_category_offer_percentage: number;
    food_category_offer_start_datetime: string;
    food_category_offer_end_datetime: string;
    food_category_row_uuid: string;
}

export interface IGetDeliveryAddress {
    user_row_uuid: string;
    is_active: is_active;
    street: string;
    pincode: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}
