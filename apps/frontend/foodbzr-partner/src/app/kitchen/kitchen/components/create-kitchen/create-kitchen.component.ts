import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { databaseDao } from '@foodbzr/shared/types';
import { insert_kitchen } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { SearchLocationComponent } from '../search-location/search-location.component';

@Component({
    selector: 'foodbzr-create-kitchen',
    styleUrls: ['./create-kitchen.component.scss'],
    templateUrl: './create-kitchen.component.html',
})
export class CreateKitchenComponent implements OnInit {
    @Input() database: { insert_kitchen: databaseDao<insert_kitchen> };
    @Input() partner_row_uuid: string;

    public choosen_profile_picture: string = 'https://i.ibb.co/fMwhNyM/image.jpg';

    /** kitchen general details */
    public opening_time: string = '1990-02-19T07:43Z';
    public closing_time: string = '1990-02-19T07:43Z';
    public kitchen_name: string;
    public open_week_list: string[] = [];
    public kitchen_radius: number;

    /** kitchen login details */
    public kitchen_user_id: string;
    public kitchen_password: string;
    public kitchen_password_again: string;

    /** kitchen address information */
    public street: string;
    public city: string;
    public pincode: string;
    public country: string;
    public state: string;
    public latitude: number;
    public longitude: number;

    constructor(private modal: ModalController, private ngZone: NgZone, private location_modal: ModalController) {}

    ngOnInit() {}

    public closeModal() {
        this.modal.dismiss();
    }

    public async searchLocation() {
        this.ngZone.run(async () => {
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
            }
        });
    }

    public async newKitchen() {
        if (
            !(this.opening_time && this.closing_time && this.kitchen_name && this.open_week_list && this.kitchen_radius && this.kitchen_user_id && this.kitchen_password && this.kitchen_password_again)
        ) {
            return;
        }

        if (!(this.state && this.street && this.city && this.pincode && this.country && this.latitude && this.longitude)) {
            return;
        }

        if (this.kitchen_password !== this.kitchen_password_again) {
            return;
        }

        const date_created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        /** insert the new kitchen */

        const kitchen_profile_picture = this.choosen_profile_picture ? this.choosen_profile_picture : '';
        const kitchen_name = this.kitchen_name;
        const opening_time = `2020-01-01 ${moment(new Date(this.opening_time)).format('HH:mm:ss')}`;
        const closing_time = `2020-01-01 ${moment(new Date(this.closing_time)).format('HH:mm:ss')}`;
        const open_week_list = JSON.stringify(this.open_week_list.map((p) => +p));
        const kitchen_radius = this.kitchen_radius ? this.kitchen_radius : 10;

        const kitchen_user_id = this.kitchen_user_id ? this.kitchen_user_id : '1234';
        const kitchen_password = this.kitchen_password ? this.kitchen_password : '1234';

        const daoLife = new DaoLife();
        const insert_kitchen__ = new this.database.insert_kitchen(daoConfig);
        insert_kitchen__.observe(daoLife).subscribe((val) => console.log('inserted the new kitchen'));
        insert_kitchen__
            .fetch(
                this.partner_row_uuid,
                kitchen_user_id,
                kitchen_password,
                kitchen_name,
                kitchen_profile_picture,
                kitchen_radius,
                this.latitude,
                this.longitude,
                opening_time,
                closing_time,
                open_week_list,
                this.street,
                this.pincode,
                this.city,
                this.state,
                this.country,
                date_created,
                uuid()
            )
            .obsData();
        daoLife.softKill();
        this.closeModal();
    }
}
