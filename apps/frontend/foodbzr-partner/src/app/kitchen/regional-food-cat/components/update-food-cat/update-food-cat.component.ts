import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { databaseDao, IGetRegionalFoodCategory } from '@foodbzr/shared/types';
import { update_regional_food_category } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
    selector: 'foodbzr-update-food-cat',
    templateUrl: './update-food-cat.component.html',
    styleUrls: ['./update-food-cat.component.scss'],
})
export class UpdateFoodCatComponent implements OnInit, OnDestroy {
    @Input() database: {
        update_regional_food_category: databaseDao<update_regional_food_category>;
    };
    @Input() food_cat: IGetRegionalFoodCategory;
    @Input() partner_row_uuid: string;

    /** data */
    public profile_picture: string;
    public food_cat_name: string;
    public offer_percentage: number;
    public offer_start_date: string;
    public offer_start_time: string;
    public offer_end_date: string;
    public offer_end_time: string;

    public can_show_save_genral = false;
    public can_show_save_offer = false;

    constructor(private modal: ModalController) {}

    ngOnInit() {
        /** set the initial value */
        this.profile_picture = this.food_cat.profile_picture;
        this.food_cat_name = this.food_cat.name;
        this.offer_percentage = this.food_cat.offer_percentage;
        this.offer_start_date = moment(new Date(this.food_cat.offer_start_datetime)).toLocaleString();
        this.offer_start_time = moment(new Date(this.food_cat.offer_start_datetime)).toLocaleString();
        this.offer_end_date = moment(new Date(this.food_cat.offer_end_datetime)).toLocaleString();
        this.offer_end_time = moment(new Date(this.food_cat.offer_end_datetime)).toLocaleString();
    }

    closeModal() {
        this.modal.dismiss();
    }

    updateOffer() {
        /** data check guard */
        if (!(this.food_cat_name && this.offer_percentage && this.offer_start_date && this.offer_start_time && this.offer_end_date && this.offer_end_time)) {
            return;
        }

        /** prepare the datetime */
        const offer_start_datetime = `${moment(new Date(this.offer_start_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_start_time)).format('HH:mm:ss')}`;
        const offer_end_datetime = `${moment(new Date(this.offer_end_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_end_time)).format('HH:mm:ss')}`;

        /** update the item */
        const daoLife = new DaoLife();
        const update_regional_food_category__ = new this.database.update_regional_food_category(daoConfig);
        update_regional_food_category__.observe(daoLife).subscribe((val) => console.log('updated the food category'));
        update_regional_food_category__.fetch(this.food_cat_name, this.profile_picture, this.offer_percentage, offer_start_datetime, offer_end_datetime, this.food_cat.row_uuid).obsData();
        daoLife.softKill();
        this.can_show_save_offer = false;
    }

    updateGeneral() {
        /** data check guard */
        if (!(this.food_cat_name && this.offer_percentage && this.offer_start_date && this.offer_start_time && this.offer_end_date && this.offer_end_time)) {
            return;
        }

        /** prepare the datetime */
        const offer_start_datetime = `${moment(new Date(this.offer_start_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_start_time)).format('HH:mm:ss')}`;
        const offer_end_datetime = `${moment(new Date(this.offer_end_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_end_time)).format('HH:mm:ss')}`;

        /** update the item */
        /** update the item */
        const daoLife = new DaoLife();
        const update_regional_food_category__ = new this.database.update_regional_food_category(daoConfig);
        update_regional_food_category__.observe(daoLife).subscribe((val) => console.log('updated the food category'));
        update_regional_food_category__.fetch(this.food_cat_name, this.profile_picture, this.offer_percentage, offer_start_datetime, offer_end_datetime, this.food_cat.row_uuid).obsData();
        daoLife.softKill();

        this.can_show_save_genral = false;
    }

    generalFocus() {
        this.can_show_save_genral = true;
    }

    offerFocus() {
        this.can_show_save_offer = true;
    }

    ngOnDestroy() {}
}
