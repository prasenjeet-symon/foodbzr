import { Table, Column, MYSQL_DATATYPE } from '@sculify/node-room';
import { gender, gender_values, is_active, is_active_values, e_is_active } from '@foodbzr/shared/types';

@Table({ tableName: 'owner', primaryKey: 'row_id' })
export class owner {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(12) })
    private mobile_number: number;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private full_name: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private bio: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(gender_values) })
    private gender: gender;

    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(5) })
    private last_otp: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private profile_picture: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private row_uuid: string;
}
