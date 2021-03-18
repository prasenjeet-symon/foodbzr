/**
 * This table holds all the order of all the kitchen of the main owner
 * This table do have one child table called as "online_transaction.table.ts"
 * That hold all the info of the online payment
 * This table is child of the delivery_address.table.ts
 */

import { delivery_status, delivery_status_values, pay_status, pay_status_values, pay_type, pay_type_values } from '@foodbzr/shared/types';
import { Column, MYSQL_DATATYPE, Table } from '@sculify/node-room';

@Table({ tableName: 'food_order', primaryKey: 'row_id' })
export class food_order {
    @Column({ dataType: MYSQL_DATATYPE.BIGINT(false) })
    private row_id: number;

    /**
     * This order is placed by some user
     * This section hold the information of that user
     * With reference id -> user_row_uuid
     */
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private user_row_uuid: string;

    /**
     * This order is placed against some partner of the owner
     * Hence this section hold the information of that partner
     * With reference id -> partner_row_uuid
     */
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private partner_row_uuid: string;

    /**
     * This order is placed against some partner's kitchen
     * This section hold the information of that kitchen
     * With reference id -> kitchen_row_uuid
     */
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private kitchen_location_row_uuid: string;

    /**
     * This order is delivered by some d_boy
     * This section hold the infromation of that dboy
     * With reference id -> dboy_row_uuid
     */
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private dboy_row_uuid: string;

    /**
     * This order hold the status of the order like
     * Oder Status :- 'placed' | 'confirmed' | 'canceled' | 'delivered'
     * This section hold the delivery status
     */
    @Column({ dataType: MYSQL_DATATYPE.ENUM(delivery_status_values), defaultValue: 'placed' })
    private delivery_status: delivery_status;

    /**
     * This order is paid using some method
     * Like 'COD', | 'Online'
     * This section hold the order pay_type
     */
    @Column({ dataType: MYSQL_DATATYPE.ENUM(pay_type_values), defaultValue: 'COD' })
    private pay_type: pay_type;

    /**
     * The payment against this order may be in any two stage
     * Stage 1 ) pending
     * Stage 2 ) paid
     * Stage 3 ) refunded ( then order  delivery_status = 'canceled')
     * This section hold the order's pay_status
     */
    @Column({ dataType: MYSQL_DATATYPE.ENUM(pay_status_values), defaultValue: 'pending' })
    private pay_status: pay_status;

    /**
     * Every order generate it's unique OTP for the delivery confirmation
     * This otp is shared to user and asked at the time of delivery of the food by the dboy
     * If the otp matched then order is delivered sucessfully other failed
     */
    @Column({ dataType: MYSQL_DATATYPE.VARCHAR(5) })
    private otp: string;

    /**
     * Total amount paid against this order in ruppes **.**
     */
    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private amount_paid: number;

    /**
     * BZRCoin used against this order by the user ( one BZRCoin has some real value in ruppe )
     */
    @Column({ dataType: MYSQL_DATATYPE.TINYINT(false) })
    private bzrcoin_used: number;

    /**
     * Kitchen owner charge some amount for delivery against every order
     * This section hold the information of delivery_charge
     */
    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private delivery_charge: number;

    /**
     * On every order there is some amount saved by the user
     * This section hold that amount saved by the user in ruppe
     * This is calculated on total items by considering the offers on every order items
     */
    @Column({ dataType: MYSQL_DATATYPE.DOUBLE() })
    private user_saved_amount: number;

    /**
     * Every order goes through the lifecycle
     * placed --> confirmed ( canceled) --> cooking --> pickedup --> delivering --> delivered
     */
    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private lifecycle: string;

    /**
     * list of all the ordered foods
     */
    @Column({ dataType: MYSQL_DATATYPE.TEXT() })
    private order_menu: string;

    /** Every order rich some location
     * This section hold the address information
     * With reference id -> order_address_row_uuid
     */
    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private order_address_row_uuid: string;

    @Column({ dataType: MYSQL_DATATYPE.DATETIME })
    private date_created: string;

    @Column({ dataType: MYSQL_DATATYPE.TIMESTAMP })
    private date_updated: string;

    @Column({ dataType: MYSQL_DATATYPE.TINYTEXT })
    private row_uuid: string;
}
