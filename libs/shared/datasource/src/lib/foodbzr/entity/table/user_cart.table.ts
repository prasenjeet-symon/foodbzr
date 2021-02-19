/**
 * This is the child of the user table
 * This hold all the cart items
 * This is also the child of the menu_size_variant table
 */

import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'user_cart', primaryKey: 'row_id' })
export class user_cart {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private user_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private menu_size_variant_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYINT(false) })
    private amount: number;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private instruction: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
