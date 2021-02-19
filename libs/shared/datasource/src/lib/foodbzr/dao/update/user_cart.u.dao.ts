/**
 * Update the user cart
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_user_cart extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE user_cart
        SET 
        amount = :amount:
        WHERE row_uuid = :user_cart_row_uuid:
    ;`)
    fetch(amount: number, user_cart_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}

export class update_user_cart_cooking_instruction extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE user_cart
        SET 
        instruction = :instruction:
        WHERE row_uuid = :user_cart_row_uuid:
    ;`)
    fetch(instruction: string, user_cart_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
