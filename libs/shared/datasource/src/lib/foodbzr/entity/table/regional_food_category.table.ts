/**
 * Hold the list of all supported regional food category
 * This is the child of the partner
 * With the foregin key 'partner_row_uuid'
 */

import { e_is_active, is_active, is_active_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'regional_food_category', primaryKey: 'row_id' })
export class regional_food_category {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    /** regional category information */
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private name: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private profile_picture: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private owner_row_uuid: string;

    /** offer information */
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

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
