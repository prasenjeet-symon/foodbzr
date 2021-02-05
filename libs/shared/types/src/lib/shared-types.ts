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
