import { Component, Input, OnInit } from '@angular/core';
import { update_dboy } from '@foodbzr/datasource';
import { databaseDao, IGetDBoy } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import * as moment from 'moment';

@Component({
    selector: 'foodbzr-update-name',
    templateUrl: './update-name.component.html',
    styleUrls: ['./update-name.component.scss'],
})
export class UpdateNameComponent implements OnInit {
    @Input() dboy: IGetDBoy;
    @Input() database: { update_dboy: databaseDao<update_dboy> };

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    /** close modal */
    closeModal() {
        this.modal.dismiss();
    }

    /** update the name */
    updateName() {
        const daoLIfe = new DaoLife();
        const birth_date = moment(new Date(this.dboy.birth_date)).format('YYYY-MM-DD');

        const update_dboy__ = new this.database.update_dboy(daoConfig);
        update_dboy__.observe(daoLIfe).subscribe((val) => console.log('updated the name'));
        update_dboy__.fetch(this.dboy.full_name, this.dboy.profile_picture, this.dboy.gender, birth_date, this.dboy.bio, this.dboy.row_uuid).obsData();
        daoLIfe.softKill();

        this.closeModal();
    }
}
