import { Component, Input } from '@angular/core';
import { insert_regional_food_category } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-add-food-cat',
    templateUrl: './add-food-cat.component.html',
    styleUrls: ['./add-food-cat.component.scss'],
})
export class AddFoodCatComponent {
    @Input() database: {
        insert_regional_food_category: databaseDao<insert_regional_food_category>;
    };
    @Input() partner_row_uuid: string;

    /** data */
    public food_cat_name: string;
    public offer_percentage: number;
    public offer_start_date: string;
    public offer_start_time: string;
    public offer_end_date: string;
    public offer_end_time: string;

    constructor(private modal: ModalController, private platform: Platform, private loading: LoadingScreenService) {}

    /** close the modal */
    public closeModal() {
        this.modal.dismiss();
    }

    /** save the new Food Cat */
    public saveFoodCat() {
        /** data check guard */
        if (!(this.food_cat_name && this.offer_percentage && this.offer_start_date && this.offer_start_time && this.offer_end_date && this.offer_end_time)) {
            return;
        }

        const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        /** prepare the datetime */
        const offer_start_datetime = `${moment(new Date(this.offer_start_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_start_time)).format('HH:mm:ss')}`;
        const offer_end_datetime = `${moment(new Date(this.offer_end_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_end_time)).format('HH:mm:ss')}`;

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const insert_regional_food_category__ = new this.database.insert_regional_food_category(daoConfig);
            insert_regional_food_category__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                insert_regional_food_category__.fetch(this.food_cat_name, null, this.partner_row_uuid, this.offer_percentage, offer_start_datetime, offer_end_datetime, date_created, uuid()).obsData();
            });

            daoLife.softKill();
        });

        this.closeModal();
    }
}
