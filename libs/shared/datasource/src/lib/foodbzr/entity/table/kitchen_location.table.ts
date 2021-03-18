import { e_is_active, is_active, is_active_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'kitchen_location', primaryKey: 'row_id' })
export class kitchen_location {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private partner_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private kitchen_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.DOUBLE(), defaultValue: 0 })
    private commission: number;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.DOUBLE(), defaultValue: 10 })
    private radius: number;

    /** address information */
    @Column({ dataType: MYSQL_DATATYPE.POINT(4326) })
    private coordinate: string;

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
