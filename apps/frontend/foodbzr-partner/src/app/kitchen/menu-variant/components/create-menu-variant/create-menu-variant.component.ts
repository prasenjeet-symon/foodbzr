import { Component, Input, OnInit } from '@angular/core';
import { insert_menu_size_variant } from '@foodbzr/datasource';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { databaseDao } from '@foodbzr/shared/types';
import { is_pure_number } from '@foodbzr/shared/util';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-create-menu-variant',
    templateUrl: './create-menu-variant.component.html',
    styleUrls: ['./create-menu-variant.component.scss'],
})
export class CreateMenuVariantComponent implements OnInit {
    @Input() menu_row_uuid: string;
    @Input() partner_row_uuid: string;
    @Input() menu_profile_picture: string;

    public database: { insert_menu_size_variant: databaseDao<insert_menu_size_variant> };

    /** data */

    public menu_variant_name: string;
    public menu_price: number;
    public min_order: number;
    public bio: string;

    /** daos */

    insert_menu_size_variant__: insert_menu_size_variant;

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    /** close the modal */
    closeModal() {
        this.modal.dismiss();
    }

    createMenu() {
        if (!(this.menu_variant_name && this.menu_price && this.bio && this.min_order)) {
            return;
        }

        if (!is_pure_number(this.menu_price)) {
            return;
        }

        if (!is_pure_number(this.min_order)) {
            return;
        }

        const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        const daoLife = new DaoLife();
        const insert_menu_size_variant__ = new this.database.insert_menu_size_variant(daoConfig);
        insert_menu_size_variant__.observe(daoLife).subscribe((val) => console.log('inserted the new menu'));
        insert_menu_size_variant__.fetch(this.menu_variant_name, this.menu_profile_picture, this.menu_price, this.min_order, this.bio, this.menu_row_uuid, date_created, uuid()).obsData();
        daoLife.softKill();
        this.closeModal();
    }
}
