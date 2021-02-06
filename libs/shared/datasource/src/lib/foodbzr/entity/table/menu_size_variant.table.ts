/**
 * This table hold the size variant of the main menu food
 * This table is child of the menu.table.ts
 * With foreign_key  = menu_row_uuid
 * This table exit because there is size problem in the menu
 */

import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';
import { currency_values, currency, e_currency, is_active, is_active_values, e_is_active } from '@foodbzr/shared/types';

@Table({ tableName: 'menu_size_variant', primaryKey: 'row_id' })
export class menu_size_variant {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    /** Main information */
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private name: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private profile_picture: string;

    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private price_per_unit: number;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(currency_values), defaultValue: e_currency.INR })
    private currency: currency;

    @Column({ dataType: MYSQL_DATATYPE.INT(false), defaultValue: 1 })
    private min_order_amount: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private bio: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private menu_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    /**
     * Discount information
     */
    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private offer_percentage: number;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private offer_start_datetime: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private offer_end_datetime: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
