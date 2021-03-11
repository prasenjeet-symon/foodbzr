/**
 * This is the kitchen table
 * This table is child of the partner table
 * With foreign key = 'partner_row_uuid'
 *
 */
import { e_is_active, is_active, is_active_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'kitchen', primaryKey: 'row_id' })
export class kitchen {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private partner_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private owner_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.no })
    private can_edit_partner: is_active;

    /** kitchen login info */
    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private kitchen_user_id: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private kitchen_password: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private kitchen_name: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private profile_picture: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private bio: string;

    @Column({ dataType: MYSQL_DATATYPE.DOUBLE(), defaultValue: 10 })
    private radius: number;

    @Column({ dataType: MYSQL_DATATYPE.POINT(4326) })
    private coordinate: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private opening_time: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private closing_time: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private open_week_list: string; // JSON.stringfy(['sunday', 'monday']);

    /**Offers information */
    @Column({ dataType: MYSQL_DATATYPE.DOUBLE(), defaultValue: 0 })
    private offer_percentage: number;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private offer_start_datetime: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private offer_end_datetime: string;

    // Kitchen address retrive from the reverse location
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private street: string;

    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(10) })
    private pincode: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private city: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private state: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private country: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private row_uuid: string;
}
