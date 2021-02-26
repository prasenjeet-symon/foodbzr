import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';
import { foodbzr_entity_values, foodbzr_entity } from '@foodbzr/shared/types';

@Table({ tableName: 'push_message', primaryKey: 'row_id' })
export class push_message {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(foodbzr_entity_values) })
    private entity: foodbzr_entity;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private entity_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private push_address: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
