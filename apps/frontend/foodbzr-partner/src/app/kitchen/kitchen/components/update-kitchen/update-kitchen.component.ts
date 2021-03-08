import { Component, Input, NgZone, OnInit } from '@angular/core';
import { update_kitchen, update_kitchen_address, update_kitchen_login_detail, update_kitchen_offers } from '@foodbzr/datasource';
import { databaseDao, IGetKitchen } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import * as moment from 'moment';
import { LoadingScreenService } from '../../../../loading-screen.service';
import { SearchLocationComponent } from '../search-location/search-location.component';

@Component({
    selector: 'foodbzr-update-kitchen',
    templateUrl: './update-kitchen.component.html',
    styleUrls: ['./update-kitchen.component.scss'],
})
export class UpdateKitchenComponent implements OnInit {
    @Input() database: {
        update_kitchen_offers: databaseDao<update_kitchen_offers>;
        update_kitchen_login_detail: databaseDao<update_kitchen_login_detail>;
        update_kitchen: databaseDao<update_kitchen>;
        update_kitchen_address: databaseDao<update_kitchen_address>;
    };
    @Input() partner_row_uuid: string;
    @Input() kitchen: IGetKitchen;
    can_show_save_button_general_detail = false;
    can_show_save_button_login_detail = false;
    can_show_save_button_offer_detail = false;
    can_show_save_button_address_detail = false;

    /** kitchen profile pic */
    public kitchen_profile_picture: string;

    /** kitchen details binding */
    public kitchen_name: string;
    public kitchen_radius: number;
    public opening_time: string;
    public closing_time: string;
    public open_week_list: string[];

    /** kitchen login details binding */
    public kitchen_user_id: string;
    public kitchen_password: string;
    public kitchen_password_again: string;

    /** offer binding property */
    public offer_percentage: number;
    public offer_start_time: string;
    public offer_start_date: string;
    public offer_end_time: string;
    public offer_end_date: string;

    /** kitchen address information */
    public street: string;
    public city: string;
    public pincode: string;
    public state: string;
    public country: string;
    public latitude: number;
    public longitude: number;

    constructor(private modal: ModalController, private location_modal: ModalController, private ngZOne: NgZone, private platform: Platform, private loading: LoadingScreenService) {}

    ngOnInit() {
        /** assign the profile pic */
        this.kitchen_profile_picture = this.kitchen.profile_picture;

        /** assign the prev value of kitchen details */
        this.kitchen_name = this.kitchen.kitchen_name;
        this.open_week_list = this.kitchen.open_week_list.map((p) => p.toString());
        this.opening_time = moment(new Date(this.kitchen.opening_time)).toLocaleString();
        this.closing_time = moment(new Date(this.kitchen.closing_time)).toLocaleString();
        this.kitchen_radius = +this.kitchen.radius;

        /** kitchen login details */
        this.kitchen_user_id = this.kitchen.kitchen_user_id;
        this.kitchen_password = this.kitchen.kitchen_password;
        this.kitchen_password_again = this.kitchen.kitchen_password;

        /** kitchen offers information */
        this.offer_percentage = this.kitchen.offer_percentage;
        this.offer_start_date = moment(new Date(this.kitchen.offer_start_datetime)).toLocaleString();
        this.offer_start_time = moment(new Date(this.kitchen.offer_start_datetime)).toLocaleString();
        this.offer_end_date = moment(new Date(this.kitchen.offer_end_datetime)).toLocaleString();
        this.offer_end_time = moment(new Date(this.kitchen.offer_end_datetime)).toLocaleString();

        /** kitchen address information */
        this.street = this.kitchen.street;
        this.city = this.kitchen.city;
        this.pincode = this.kitchen.pincode;
        this.state = this.kitchen.state;
        this.country = this.kitchen.country;
        this.latitude = this.kitchen.latitude;
        this.longitude = this.kitchen.longitude;
    }

    dismissModal() {
        this.modal.dismiss();
    }

    public async searchLocation() {
        this.ngZOne.run(async () => {
            const dailogRef = await this.location_modal.create({
                component: SearchLocationComponent,
            });

            await dailogRef.present();
            const { data } = await dailogRef.onWillDismiss();
            if (data) {
                this.street = data.street;
                this.pincode = data.pincode;
                this.city = data.city;
                this.country = data.country;
                this.state = data.state;
                this.latitude = data.lat;
                this.longitude = data.lng;
                this.can_show_save_button_address_detail = true;
            }
        });
    }

    /** update the kitchen general details */
    updateKitchenGeneral() {
        if (!(this.kitchen_name && this.opening_time && this.closing_time && this.kitchen_radius && this.open_week_list)) {
            return;
        }

        /** format the opening and closing time */
        const opening_time = `2020-01-01 ${moment(new Date(this.opening_time)).format('HH:mm:ss')}`;
        const closing_time = `2020-01-01 ${moment(new Date(this.closing_time)).format('HH:mm:ss')}`;
        const open_week_list = JSON.stringify(this.open_week_list.map((p) => +p));

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_kitchen__ = new this.database.update_kitchen(daoConfig);
            update_kitchen__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                update_kitchen__.fetch(this.kitchen_name, opening_time, closing_time, +this.kitchen_radius, open_week_list, this.kitchen.row_uuid).obsData();
            });

            daoLife.softKill();
        });

        this.can_show_save_button_general_detail = false;
    }

    kitchenGeneralDetailsFocused() {
        this.can_show_save_button_general_detail = true;
    }

    /** update the kitchen login details */
    async updateKitchenLoginDetail() {
        if (!(this.kitchen_user_id && this.kitchen_password && this.kitchen_password_again)) {
            return;
        }

        if (this.kitchen_password !== this.kitchen_password_again) {
            return;
        }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_kitchen_login_detail__ = new this.database.update_kitchen_login_detail(daoConfig);
            update_kitchen_login_detail__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                update_kitchen_login_detail__.fetch(this.kitchen_password, this.kitchen_user_id, this.kitchen.row_uuid).obsData();
            });

            daoLife.softKill();
        });

        this.can_show_save_button_login_detail = false;
    }

    kitchenLoginDetailFocused() {
        this.can_show_save_button_login_detail = true;
    }

    /** update the offers details */
    updateKitchenOfferDetails() {
        if (!(this.offer_end_date && this.offer_end_time && this.offer_start_time && this.offer_start_date)) {
            return;
        }

        this.offer_percentage = this.offer_percentage === 0 ? null : this.offer_percentage;

        const offer_start_datetime = `${moment(new Date(this.offer_start_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_start_time)).format('HH:mm:ss')}`;
        const offer_end_datetime = `${moment(new Date(this.offer_end_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_end_time)).format('HH:mm:ss')}`;

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_kitchen_offers__ = new this.database.update_kitchen_offers(daoConfig);
            update_kitchen_offers__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            this.loading.showLoadingScreen().then(() => {
                update_kitchen_offers__.fetch(this.offer_percentage, offer_start_datetime, offer_end_datetime, this.kitchen.row_uuid).obsData();
            });

            daoLife.softKill();
        });

        this.can_show_save_button_offer_detail = false;
    }

    kitchenOfferDetailFocused() {
        this.can_show_save_button_offer_detail = true;
    }

    /** update the kitchen address information */
    updateKitchenAddress() {
        if (!(this.street && this.city && this.country && this.state && this.latitude && this.longitude && this.pincode && this.latitude && this.longitude)) {
            return;
        }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_kitchen_address__ = new this.database.update_kitchen_address(daoConfig);
            update_kitchen_address__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            update_kitchen_address__.fetch(this.street, this.pincode, this.city, this.state, this.country, this.latitude, this.longitude, this.kitchen.row_uuid).obsData();
            daoLife.softKill();
        });
        this.can_show_save_button_address_detail = false;
    }

    kitchenAddressDetailFocused() {
        this.can_show_save_button_address_detail = true;
    }
}
