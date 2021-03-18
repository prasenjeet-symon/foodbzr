/**
 * This is the kitchen table
 * This table is child of the partner table
 * With foreign key = 'partner_row_uuid'
 */

import { e_is_active, is_active, is_active_values, kitchen_type, kitchen_type_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'kitchen', primaryKey: 'row_id' })
export class kitchen {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private owner_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    /** can assigned partner edit the menu or not  */
    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.no })
    private can_edit_partner: is_active;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(kitchen_type_values) })
    private kitchen_type: kitchen_type;

    /** kitchen login info */
    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private kitchen_user_id: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private kitchen_password: string;

    /** kitchen basic information */
    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private kitchen_name: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private profile_picture: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private bio: string;

    /** operating time */
    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private opening_time: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private closing_time: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private open_week_list: string; // JSON.stringfy(['sunday', 'monday']);

    /**Offers information */
    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private offer_percentage: number;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private offer_start_datetime: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private offer_end_datetime: string;

    /** row info */
    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private row_uuid: string;
}
