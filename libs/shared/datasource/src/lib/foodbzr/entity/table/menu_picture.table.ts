/**
 *  This table hold the images of the menu of the kitchen
 * This table is the child of the menu table
 * With foreign key = 'menu_row_uuid'
 */

import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'menu_picture', primaryKey: 'row_id' })
export class menu_picture {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private menu_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private pic_uri: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private thumbnail_uri: string;

    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private size: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private mime_type: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
