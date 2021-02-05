/**
 * Update the menu of the kitchen
 */

import { IModificationDaoStatus } from '@foodbzr/shared/types';
import { BaseDao, IDaoConfig, Query } from '@sculify/node-room';

export class update_menu extends BaseDao<IModificationDaoStatus> {
    constructor(config: IDaoConfig) {
        super(config);
    }

    @Query(`
        UPDATE menu
        SET 
        menu_name = :menu_name:,
        profile_picture = :profile_picture:,
        bio = :bio:,
        offer_percentage = :offer_percentage:,
        offer_start_datetime = :offer_start_datetime:,
        offer_end_datetime = :offer_end_datetime:

        WHERE row_uuid = :menu_row_uuid:

    ;`)
    fetch(menu_row_uuid: string, menu_name: string, profile_picture: string, bio: string, offer_percentage: string, offer_start_datetime: string, offer_end_datetime: string) {
        return this.baseFetch(this.DBData);
    }
}
