import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { update_dboy } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { databaseDao, IGetDBoy } from '@foodbzr/shared/types';
import * as moment from 'moment';

@Component({
    selector: 'foodbzr-update-bio',
    templateUrl: './update-bio.component.html',
    styleUrls: ['./update-bio.component.scss'],
})
export class UpdateBioComponent implements OnInit {
    @Input() dboy: IGetDBoy;
    @Input() database: { update_dboy: databaseDao<update_dboy> };

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    /** update the bio */
    updateBio() {
        const daoLife = new DaoLife();

        const birth_date = moment(new Date(this.dboy.birth_date)).format('YYYY-MM-DD');

        const update_dboy__ = new this.database.update_dboy(daoConfig);
        update_dboy__.observe(daoLife).subscribe((val) => console.log('updated the bio'));
        update_dboy__.fetch(this.dboy.full_name, this.dboy.profile_picture, this.dboy.gender, birth_date, this.dboy.bio, this.dboy.row_uuid).obsData();

        daoLife.softKill();
        this.dismissModal();
    }

    /** dismiss modal */
    dismissModal() {
        this.modal.dismiss();
    }
}
