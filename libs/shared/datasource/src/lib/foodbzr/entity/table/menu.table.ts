import { e_is_active, is_active, is_active_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

/**
 * This table is child of the kitchen table
 * With foreign key = 'kitchen_row_uuid'
 */

@Table({ tableName: 'menu', primaryKey: 'row_id' })
export class menu {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private menu_name: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private profile_picture: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private bio: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private kitchen_row_uuid: string;

    /**
     * Food category
     */
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private regional_food_category_row_uuid: string; // regional_food_category.table.ts

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private food_category_row_uuid: string; // food_category.table.ts

    /**
     * Discount information
     */
    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private offer_percentage: number;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private offer_start_datetime: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private offer_end_datetime: string;

    /**
     *
     */
    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private row_uuid: string;
}
