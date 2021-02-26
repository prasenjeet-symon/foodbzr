import { Component, Input, OnInit } from '@angular/core';
import { gender } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { update_owner_gender } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-update-gender',
    templateUrl: './update-gender.component.html',
    styleUrls: ['./update-gender.component.scss'],
})
export class UpdateGenderComponent implements OnInit {
    @Input() owner_row_uuid: string;
    @Input() prev_gender: gender;
    @Input() database: { update_owner_gender: databaseDao<update_owner_gender> };

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
        const update_owner_gender = new this.database.update_owner_gender(daoConfig);
        update_owner_gender.observe(daoLife).subscribe((val) => console.log('updated the partner'));
        update_owner_gender.fetch(this.prev_gender, this.owner_row_uuid).obsData();
        daoLife.softKill();
        this.closeModal();
    }
}
