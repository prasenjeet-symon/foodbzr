import { e_is_active, is_active, is_active_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

/**
 * This table hold the delivery address of the ordered foods
 * This table has one child table (order.table.ts)
 * This table is child of user.table.ts
 */
@Table({ tableName: 'delivery_address', primaryKey: 'row_id' })
export class delivery_address {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private user_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private street: string;

    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(10) })
    private pincode: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private state: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private country: string;

    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private latitude: number;

    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private longitude: number;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
