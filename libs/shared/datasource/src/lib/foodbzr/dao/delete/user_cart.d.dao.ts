/**
 *  Deleting items means actual delete
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class delete_user_cart extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        DELETE FROM user_cart
        WHERE row_uuid = :user_cart_row_uuid:
    ;`)
    fetch(user_cart_row_uuid: string) {
        return this.baseFetch(this.DBData);
    }
}
