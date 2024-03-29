import { IDaoConfig } from '@sculify/node-room';

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
    row_id: number;
    owner_row_uuid: string;
    commission: number;
    last_otp: string;
    is_active: is_active;
    is_verified: is_active;
    profile_picture: string;
    gender: gender;
    full_name: string;
    mobile_number: string;
    bio: string;
    date_created: string;
    row_uuid: string;
    can_add_kitchen: is_active;
}

export const week_name_values = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export interface IGetKitchen {
    partner_row_uuid: string;
    is_active: is_active;
    kitchen_user_id: string;
    kitchen_password: string;
    kitchen_name: string;
    profile_picture: string;
    radius: number;
    latitude: number;
    longitude: number;
    opening_time: string;
    closing_time: string;
    open_week_list: string[];
    offer_percentage: number;
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
    address: string;
    can_edit_partner: is_active;
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
    offer_percentage: number;
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
    kitchen_name: string;
    partner_full_name: string;
    partner_row_uuid: string;
    kitchen_row_uuid: string;

    full_name: string;
    bio: string;
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

export type delivery_status = 'placed' | 'confirmed' | 'canceled' | 'cooking' | 'delivered' | 'on_way';
export const delivery_status_values = ['placed', 'confirmed', 'canceled', 'cooking', 'delivered', 'on_way'];

export type pay_type = 'COD' | 'ONLINE';
export const pay_type_values = ['COD', 'ONLINE'];

export type pay_status = 'paid' | 'pending' | 'refunded';
export const pay_status_values = ['paid', 'pending', 'refunded'];

export type order_lifecycle_state =
    | 'order placed'
    | 'order confirmed'
    | 'cooking'
    | 'order pickedup'
    | 'order on its way'
    | 'order delivered'
    | 'canceled'
    | 'order confirmed then cooking'
    | 'order pickedup then order on its way';
export const order_lifecycle_state_values = ['order placed', 'order confirmed', 'cooking', 'order pickedup', 'order on its way', 'order delivered', 'canceled'];

export interface OrderMenu {
    menu_size_variant_row_uuid: string;
    menu_size_variant_name: string;
    menu_row_uuid: string;
    menu_row_name: string;
    amount: number;
    cooking_instruction: string;

    original_price: number;
    after_offer_price: number;
    money_saved: number;

    row_uuid: string;
    date_created: string;
}

export interface IOrderLifeCycle {
    name: order_lifecycle_state;
    is_done: boolean;
    date_created: string;
    date_updated: string;
}
export interface IFetchOrderLifecycle {
    lifecycle: IOrderLifeCycle[];
}

export type databaseDao<T> = { new (config: IDaoConfig): T };

export interface IGetOrder {
    group_date: string;
    kitchen_profile_picture: string;
    owner_row_uuid: string;
    kitchen_name: string;
    row_id: number;
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
    order_menu: OrderMenu[];
    date_created: string;
    date_updated: string;
    row_uuid: string;
    profile_picture: string;
    full_name: string;
    mobile_number: string;
    latitude: number;
    longitude: number;
}

export interface IGetOrderStatus {
    user_full_name: string;
    user_mobile_number: string;
    user_profile_picture: string;
    user_gender: gender;

    kitchen_name: string;
    kitchen_profile_picture: string;
    kitchen_street: string;
    kitchen_pincode: string;
    kitchen_city: string;
    kitchen_state: string;
    kitchen_country: string;
    kitchen_address: string;

    food_order_row_id: number;
    user_row_uuid: string;
    partner_row_uuid: string;
    kitchen_row_uuid: string;
    dboy_row_uuid: string;
    order_address_row_uuid: string;

    food_order_delivery_status: delivery_status;
    food_order_pay_type: pay_type;
    food_order_pay_status: pay_status;
    food_order_otp: string;
    food_order_amount_paid: number;
    food_order_bzrcoin_used: number;
    food_order_delivery_charge: number;
    food_order_user_saved_amount: number;
    food_order_lifecycle: IOrderLifeCycle[];
    food_order_order_menu: OrderMenu[];

    food_order_date_created: string;
    food_order_date_updated: string;
    food_order_row_uuid: string;

    dboy_profile_picture: string;
    dboy_full_name: string;
    dboy_mobile_number: string;

    delivery_address_street: string;
    delivery_address_pincode: string;
    delivery_address_city: string;
    delivery_address_state: string;
    delivery_address_country: string;
    delivery_address_latitude: string;
    delivery_address_longitude: string;
    delivery_address: string;
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
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    date_created: string;
    date_updated: string;
    row_uuid: string;
    is_selected: boolean;
}

export interface IGetOrderOnWay {
    user_full_name: string;
    user_mobile_number: string;
    user_profile_picture: string;

    row_id: number;
    user_row_uuid: string;
    partner_row_uuid: string;
    kitchen_row_uuid: string;
    dboy_row_uuid: string;
    delivery_status: string;
    pay_type: pay_type;
    pay_status: pay_status;
    otp: string;
    amount_paid: number;
    bzrcoin_used: number;
    delivery_charge: number;
    user_saved_amount: number;
    lifecycle: IOrderLifeCycle[];
    order_menu: OrderMenu[];
    order_address_row_uuid: string;
    date_created: string;
    date_updated: string;
    row_uuid: string;
    dboy_profile_picture: string;
    dboy_full_name: string;
    dboy_mobile_number: string;
    latitude: number;
    longitude: number;
    street: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
    delivery_address: string;
}

export interface IGetMenuVariantForCart {
    is_selected: boolean;
    final_price: number;
    final_offer_percentage: number;

    regional_food_category_name: string;
    regional_food_category_is_active: is_active;
    regional_food_category_offer_percentage: number;
    regional_food_category_offer_start_datetime: string;
    regional_food_category_offer_end_datetime: string;

    food_category_name: string;
    food_category_is_active: is_active;
    food_category_offer_percentage: number;
    food_category_offer_start_datetime: string;
    food_category_offer_end_datetime: string;

    kitchen_is_active: is_active;
    kitchen_offer_percentage: number;
    kitchen_offer_start_datetime: string;
    kitchen_offer_end_datetime: string;

    regional_food_category_row_uuid: string;
    food_category_row_uuid: string;

    menu_menu_name: string;
    menu_is_active: is_active;
    menu_profile_picture: string;
    menu_bio: string;
    kitchen_row_uuid: string;

    menu_offer_percentage: number;
    menu_offer_start_datetime: string;
    menu_offer_end_datetime: string;
    menu_date_created: string;
    menu_date_updated: string;
    menu_row_uuid: string;

    menu_variant_name: string;
    menu_variant_price_per_unit: number;
    menu_variant_is_active: is_active;
    menu_variant_offer_percentage: number;
    menu_variant_offer_start_datetime: string;
    menu_variant_offer_end_datetime: string;
    menu_variant_row_uuid: string;
    menu_variant_min_order_amount: number;
    menu_variant_profile_picture: string;
}

export interface IGetMenuForCart {
    final_price: number;
    final_offer_percentage: number;

    regional_food_category_name: string;
    regional_food_category_is_active: is_active;
    regional_food_category_offer_percentage: number;
    regional_food_category_offer_start_datetime: string;
    regional_food_category_offer_end_datetime: string;

    food_category_name: string;
    food_category_is_active: is_active;
    food_category_offer_percentage: number;
    food_category_offer_start_datetime: string;
    food_category_offer_end_datetime: string;

    kitchen_is_active: is_active;
    kitchen_offer_percentage: number;
    kitchen_offer_start_datetime: string;
    kitchen_offer_end_datetime: string;

    regional_food_category_row_uuid: string;
    food_category_row_uuid: string;

    menu_menu_name: string;
    menu_is_active: is_active;
    menu_profile_picture: string;
    menu_bio: string;
    kitchen_row_uuid: string;

    menu_offer_percentage: number;
    menu_offer_start_datetime: string;
    menu_offer_end_datetime: string;
    menu_date_created: string;
    menu_date_updated: string;
    menu_row_uuid: string;

    menu_variant_price_per_unit: number;
    menu_variant_is_active: is_active;
    menu_variant_offer_percentage: number;
    menu_variant_offer_start_datetime: string;
    menu_variant_offer_end_datetime: string;
    menu_variant_row_uuid: string;
}

export interface IGetUserCartForCheckout {
    kitchen_partner_row_uuid: string;
    is_selected: boolean;
    final_offer_percentage: number;
    final_price: number;
    amount_saved: number;
    total_final_price: number;
    total_amount_saved: number;

    user_cart_amount: number;
    user_cart_row_uuid: string;
    user_cart_instruction: string;

    regional_food_category_name: string;
    regional_food_category_is_active: is_active;
    regional_food_category_offer_percentage: number;
    regional_food_category_offer_start_datetime: string;
    regional_food_category_offer_end_datetime: string;

    food_category_name: string;
    food_category_is_active: is_active;
    food_category_offer_percentage: number;
    food_category_offer_start_datetime: string;
    food_category_offer_end_datetime: string;

    kitchen_profile_picture: string;
    kitchen_kitchen_name: string;
    kitchen_opening_time: string;
    kitchen_closing_time: string;

    kitchen_is_active: is_active;
    kitchen_offer_percentage: number;
    kitchen_offer_start_datetime: string;
    kitchen_offer_end_datetime: string;

    kitchen_street: string;
    kitchen_pincode: string;
    kitchen_city: string;
    kitchen_state: string;
    kitchen_country: string;

    menu_menu_name: string;
    menu_is_active: is_active;
    menu_profile_picture: string;
    kitchen_row_uuid: string;
    regional_food_category_row_uuid: string;
    food_category_row_uuid: string;
    menu_offer_percentage: number;
    menu_offer_start_datetime: string;
    menu_offer_end_datetime: string;
    menu_row_uuid: string;

    menu_variant_name: string;
    menu_variant_price_per_unit: number;
    menu_variant_is_active: is_active;
    menu_variant_offer_percentage: number;
    menu_variant_offer_start_datetime: string;
    menu_variant_offer_end_datetime: string;
    menu_variant_row_uuid: string;
    menu_variant_min_order_amount: number;

    owner_row_uuid: string;
}

export interface IGetUserCartGroupedKitchen {
    kitchen: { owner_row_uuid: string; kitchen_row_uuid: string; kitchen_partner_row_uuid: string; kitchen_name: string; profile_picture: string; address: string; can_take_order: boolean };
    orders: {
        menu_name: string;
        menu_variant_name: string;
        user_cart_row_uuid: string;
        user_cart_amount: number;
        menu_variant_row_uuid: string;
        menu_row_uuid: string;
        kitchen_row_uuid: string;
        original_menu_price: number;
        final_price: number;
        amount_saved: number;
        total_final_price: number;
        total_amount_saved: number;
        user_cart_instruction: string;
        menu_variant_min_order_amount: number;
    }[];
    final_calculation: { total_menu_price: number; total_amount_saved: number; tax_amount: number; delivery_charge: number; amount_payable: number };
}

export interface IGetMenuSearchResult {
    name: string;
    profile_picture: string;
}

export interface IGetKitchenSearchResult {
    partner_row_uuid: string;
    row_uuid: string;
    kitchen_name: string;
    profile_picture: string;
    address: string;
    street: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
}

export interface IGetKitchenSearchResultMenu {
    row_uuid: string;
    address: string;
    menu_name: string;
    partner_row_uuid: string;
    kitchen_name: string;
    profile_picture: string;
    opening_time: string;
    closing_time: string;
    open_week_list: number[];
    street: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    offer_percentage: number;
    offer_start_datetime: string;
    offer_end_datetime: string;
    is_active: is_active;
}

export interface IGetOrderUser {
    date: string;
    data: IGetOrder[];
}

export interface IGetMenuTrending {
    menu_name: string;
    menu_profile_picture: string;
    menu_row_uuid: string;
    kitchen_row_uuid: string;
}

export interface IGetDboyAuth {
    is_err: boolean;
    error: string;
    dboy_row_uuid: string;
    kitchen_row_uuid: string;
    otp: string;
}

export interface IGetUserFavKitchen {
    partner_row_uuid: string;
    row_uuid: string;
    user_row_uuid: string;
    kitchen_row_uuid: string;
    profile_picture: string;
    kitchen_name: string;
    street: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
    address: string;
}

export interface IGetImageBBResponse {
    pic_uri: string;
    thumbnail_uri: string;
    delete_uri: string;
    mime: string;
    size: number;
}

export type foodbzr_entity = 'owner' | 'partner' | 'dboy' | 'user';
export const foodbzr_entity_values = ['owner', 'partner', 'dboy', 'user'];

export interface IGetPushAddress {
    entity: foodbzr_entity;
    entity_row_uuid: string;
    push_address: string;
    date_created: string;
    date_updated: string;
    row_uuid: string;
}

export enum PUSH_MESSAGE_TYPE {
    new_order = 'NEW ORDER RECEIVED',
    order_canceled = 'ORDER CANCELED',
    order_confirmed = 'ORDER CONFIRMED',
    order_pickedup = 'ORDER PICKEDUP',
    order_delivered = 'ORDER DELIVERED',
    order_cooking = 'ORDER COOKING',
}

export interface IGetOrderStatusGroupedKitchen {
    kitchen_name: string;
    kitchen_row_uuid: string;
    address: string;
    orders: IGetOrderStatus[];
}
