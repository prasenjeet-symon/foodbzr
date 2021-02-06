/**
 * This table holds all the reviews of the  given menu
 * This is child of the menu table
 * With foreign key = 'menu_row_uuid'
 * This also depend on the user_table with review belong to user
 */

import { e_is_active, is_active, is_active_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'menu_review', primaryKey: 'row_id' })
export class menu_review {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private menu_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private user_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private review: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.INT(false) })
    private positive_points: number;

    @Column({ dataType: MYSQL_DATATYPE.INT(false) })
    private negative_points: number;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
