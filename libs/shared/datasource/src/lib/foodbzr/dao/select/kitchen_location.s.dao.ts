/**
 * Fetch the kitchen location of the kitchen
 */

import { IGetKitchenLocation, is_active } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class fetch_kitchen_location_of_kitchen extends BaseDao<IGetKitchenLocation[]> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
     SELECT 

     kitl.partner_row_uuid as partner_row_uuid,
     kitl.commission as commission,
     kitl.is_active as kitchen_location_is_active,
     kitl.radius as radius,
     kitl.coordinate  as coordinate,
     kitl.street  as street,
     kitl.pincode as pincode,
     kitl.city as city,
     kitl.state as state,
     kitl.country as country,
     kitl.date_created as date_created,
     kitl.date_updated as date_updated,
     kitl.row_uuid as row_uuid,

     pat.owner_row_uuid as owner_row_uuid,
     pat.is_active as partner_is_active,
     pat.can_add_kitchen as partner_can_add_kitchen,
     pat.is_verified as partner_is_verified,
     pat.full_name as partner_full_name,
     pat.profile_picture as partner_profile_picture,
     pat.gender as partner_gender,
     pat.birth_date as partner_birth_date,
     pat.mobile_number as partner_mobile_number,
     pat.bio as partner_bio,

     kit.profile_picture as kitchen_profile_picture,
     kit.bio as kitchen_bio,
     kit.opening_time as kitchen_opening_time,
     kit.closing_time as kitchen_closing_time,
     kit.open_week_list as kitchen_open_week_list,
     kit.offer_percentage as kitchen_offer_percentage,
     kit.offer_start_datetime as kitchen_offer_start_datetime,
     kit.offer_end_datetime as kitchen_offer_end_datetime,
     kit.is_active as kitchen_is_active,
     kit.can_edit_partner as kitchen_can_edit_partner,
     kit.kitchen_type as kitchen_kitchen_type,
     kit.kitchen_user_id as kitchen_user_id,
     kit.kitchen_password as kitchen_password,
     kit.kitchen_name as kitchen_name
 
     FROM kitchen_location as kitl
     LEFT OUTER JOIN partner as pat
     ON kitl.partner_row_uuid = pat.row_uuid
     LEFT OUTER JOIN kitchen as kit
     ON kit.row_uuid  = kitl.kitchen_row_uuid

     WHERE kitl.kitchen_row_uuid = :kitchen_row_uuid: AND kitl.is_active = :is_active:
    ;`)
    fetch(kitchen_row_uuid: string, is_active: is_active) {
        return this.baseFetch(
            this.DBData.map((p) => {
                return { ...p, address: `${p.street}, ${p.city}, ${p.pincode}, ${p.state}, ${p.country}`, kitchen_open_week_list: JSON.parse(p.kitchen_open_week_list as any) };
            })
        );
    }
}
