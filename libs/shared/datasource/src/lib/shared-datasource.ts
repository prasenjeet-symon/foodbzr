import { from } from 'rxjs';

export { FoodbzrDatasource } from './foodbzr/foodbzr-datasource';

/**
 * owner.table.ts
 */
export { delete_woner } from './foodbzr/dao/delete/owner.d.dao';
export { insert_owner } from './foodbzr/dao/insert/owner.i.dao';
export { fetch_owner } from './foodbzr/dao/select/owner.s.dao';
export { update_owner_otp } from './foodbzr/dao/update/owner.u.dao';

/**
 * partner.table.ts
 */
export { delete_partner } from './foodbzr/dao/delete/partner.d.dao';
export { insert_partner } from './foodbzr/dao/insert/partner.i.dao';
export { fetch_partner_single } from './foodbzr/dao/select/partner.s.dao';
export { update_partner, update_partner_mobile_number, update_partner_otp } from './foodbzr/dao/update/partner.u.dao';

/**
 * kitchen.table.ts
 */
export { delete_kitchen } from './foodbzr/dao/delete/kitchen.d.dao';
export { insert_kitchen } from './foodbzr/dao/insert/kitchen.i.dao';
export { fetch_kitchen_password, fetch_kitchens_of_partner, fetch_kitchen_single } from './foodbzr/dao/select/kitchen.s.dao';
export { update_kitchen, update_kitchen_password, update_kitchen_offers } from './foodbzr/dao/update/kitchen.u.dao';
