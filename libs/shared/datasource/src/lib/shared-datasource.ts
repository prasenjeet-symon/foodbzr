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

/** menu.table.ts */
export { delete_menu } from './foodbzr/dao/delete/menu.d.dao';
export { insert_menu } from './foodbzr/dao/insert/menu.i.dao';
export { fetch_menu_single, fetch_menus_of_kitchen } from './foodbzr/dao/select/menu.s.dao';
export { update_menu } from './foodbzr/dao/update/menu.u.dao';

/** food_category.table.ts */
export { delete_food_category } from './foodbzr/dao/delete/food_category.d.dao';
export { insert_food_category } from './foodbzr/dao/insert/food_category.i.dao';
export { fetch_food_category_of_partner } from './foodbzr/dao/select/food_category.s.dao';
export { update_food_category } from './foodbzr/dao/update/food_category.u.dao';

/** regional_food_category.table.ts */
export { delete_regional_food_category } from './foodbzr/dao/delete/regional_food_category.d.dao';
export { insert_regional_food_category } from './foodbzr/dao/insert/regional_food_category.i.dao';
export { fetch_regional_food_category_of_partner } from './foodbzr/dao/select/regional_food_category.s.dao';
export { update_regional_food_category } from './foodbzr/dao/update/regional_food_category.u.dao';
