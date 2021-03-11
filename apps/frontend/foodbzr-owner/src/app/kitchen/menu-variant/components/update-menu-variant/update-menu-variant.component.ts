import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { update_menu_size_variant, update_menu_size_variant_offer } from '@foodbzr/datasource';
import { databaseDao, IGetMenuSizeVariant } from '@foodbzr/shared/types';
import { is_pure_number } from '@foodbzr/shared/util';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import * as moment from 'moment';

@Component({
    selector: 'foodbzr-update-menu-variant',
    templateUrl: './update-menu-variant.component.html',
    styleUrls: ['./update-menu-variant.component.scss'],
})
export class UpdateMenuVariantComponent implements OnInit, OnDestroy {
    @Input() owner_row_uuid: string;
    @Input() menu_row_uuid: string;
    @Input() menu_variant: IGetMenuSizeVariant;
    @Input() database: { update_menu_size_variant: databaseDao<update_menu_size_variant>; update_menu_size_variant_offer: databaseDao<update_menu_size_variant_offer> };

    /** data */
    public menu_variant_name: string;
    public menu_price: number;
    public min_order: number;
    public bio: string;

    /** data offers */
    public offer_percentage: number;
    public offer_start_date: string;
    public offer_start_time: string;
    public offer_end_date: string;
    public offer_end_time: string;

    constructor(private modal: ModalController, private ngZone: NgZone) {}

    /** button state */
    can_show_save_button_general_info = false;
    can_show_save_button_offer_info = false;

    ngOnInit() {
        /** set the default values */
        /** menu general information */
        this.menu_variant_name = this.menu_variant.name;
        this.menu_price = this.menu_variant.price_per_unit;
        this.bio = this.menu_variant.bio;
        this.min_order = this.menu_variant.min_order_amount;

        /** set the offer default values */
        this.offer_percentage = this.menu_variant.offer_percentage;
        this.offer_start_date = moment(new Date(this.menu_variant.offer_start_datetime)).toLocaleString();
        this.offer_start_time = moment(new Date(this.menu_variant.offer_start_datetime)).toLocaleString();
        this.offer_end_date = moment(new Date(this.menu_variant.offer_end_datetime)).toLocaleString();
        this.offer_end_time = moment(new Date(this.menu_variant.offer_end_datetime)).toLocaleString();
    }

    ngOnDestroy() {}

    /** close the modal */
    closeModal() {
        this.modal.dismiss();
    }

    /** update the general information */
    updateMenu() {
        if (!(this.menu_variant_name && this.bio && this.min_order && this.menu_price)) {
            return;
        }

        if (!is_pure_number(this.menu_price)) {
            return;
        }

        if (!is_pure_number(this.min_order)) {
            return;
        }

        const daoLife = new DaoLife();
        const update_menu_size_variant__ = new this.database.update_menu_size_variant(daoConfig);
        update_menu_size_variant__.observe(daoLife).subscribe((val) => console.log('updated the menu size variant'));
        update_menu_size_variant__.fetch(this.menu_variant_name, this.menu_price, this.min_order, this.bio, this.menu_variant.row_uuid).obsData();
        daoLife.softKill();
        this.can_show_save_button_general_info = false;
    }

    generalInfoFocused() {
        this.can_show_save_button_general_info = true;
    }

    /** update the menu offers */
    public updateMenuOffer() {
        if (!(this.offer_percentage && this.offer_start_date && this.offer_start_time && this.offer_end_date && this.offer_end_time)) {
            return;
        }

        if (!is_pure_number(this.offer_percentage)) {
            return;
        }

        const offer_start_datetime = `${moment(new Date(this.offer_start_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_start_time)).format('HH:mm:ss')}`;
        const offer_end_datetime = `${moment(new Date(this.offer_end_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_end_time)).format('HH:mm:ss')}`;

        const daoLife = new DaoLife();
        const update_menu_size_variant_offer__ = new this.database.update_menu_size_variant_offer(daoConfig);
        update_menu_size_variant_offer__.observe(daoLife).subscribe((val) => console.log('updated the menu size variant offer'));
        update_menu_size_variant_offer__.fetch(this.offer_percentage, offer_start_datetime, offer_end_datetime, this.menu_variant.row_uuid).obsData();
        daoLife.softKill();
        this.can_show_save_button_offer_info = false;
    }

    offerInfoFocused() {
        this.can_show_save_button_offer_info = true;
    }
}
