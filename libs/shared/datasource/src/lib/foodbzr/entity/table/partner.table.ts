/**
 * This is partner table
 * This hold all the partner of the owner
 */

import { e_is_active, gender, gender_values, is_active, is_active_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'partner', primaryKey: 'row_id' })
export class partner {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private owner_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(5) })
    private last_otp: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.no })
    private can_add_kitchen: is_active;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.no })
    private is_verified: is_active;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private full_name: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private profile_picture: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(gender_values) })
    private gender: gender;

    @Column({ dataType: MYSQL_DATATYPE.DATE })
    private birth_date: string;

    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(12) })
    private mobile_number: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private bio: string;

    /** row info */
    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private row_uuid: string;
}
