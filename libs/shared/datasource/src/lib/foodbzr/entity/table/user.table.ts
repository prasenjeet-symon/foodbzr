/**
 * This table is the child of the owner table
 */

import { e_is_active, gender, gender_values, is_active, is_active_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE } from '@sculify/node-room';

export class user {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private owner_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private full_name: string;

    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(12) })
    private mobile_number: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private profile_picture: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private bio: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.yes })
    private is_active: is_active;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(gender_values) })
    private gender: gender;

    @Column({ dataType: MYSQL_DATATYPE.DATE })
    private birth_date: string;

    /** login info */
    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(5) })
    private last_otp: string;

    @Column({ dataType: MYSQL_DATATYPE.ENUM(is_active_values), defaultValue: e_is_active.no })
    private is_mobile_verified: is_active;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
