import { Component, Input, OnInit } from '@angular/core';
import { gender } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { update_partner_gender } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-update-gender',
    templateUrl: './update-gender.component.html',
    styleUrls: ['./update-gender.component.scss'],
})
export class UpdateGenderComponent implements OnInit {
    @Input() partner_row_uuid: string;
    @Input() prev_gender: gender;
    @Input() database: { update_partner_gender: databaseDao<update_partner_gender> };

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    /** close modal */
    closeModal() {
        this.modal.dismiss();
    }

    /** update the gender */
    updateGender() {
        if (!this.prev_gender) {
            return;
        }

        const daoLife = new DaoLife();
        const update_partner_gender__ = new this.database.update_partner_gender(daoConfig);
        update_partner_gender__.observe(daoLife).subscribe((val) => console.log('updated the partner'));
        update_partner_gender__.fetch(this.prev_gender, this.partner_row_uuid).obsData();
        daoLife.softKill();
        this.closeModal();
    }
}
