import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'user_fav_kitchen', primaryKey: 'row_id' })
export class user_fav_kitchen {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private user_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private kitchen_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
