import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { update_partner_name } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-update-name',
    templateUrl: './update-name.component.html',
    styleUrls: ['./update-name.component.scss'],
})
export class UpdateNameComponent implements OnInit {
    @Input() partner_row_uuid: string;
    @Input() prev_name: string;
    @Input() database: { update_partner_name: databaseDao<update_partner_name> };

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    /** close modal */
    closeModal() {
        this.modal.dismiss();
    }

    /** update the name */
    updateName() {
        if (!this.prev_name) {
            return;
        }

        const daoLIfe = new DaoLife();
        const update_partner_name__ = new this.database.update_partner_name(daoConfig);
        update_partner_name__.observe(daoLIfe).subscribe((val) => console.log('updated the name'));
        update_partner_name__.fetch(this.prev_name, this.partner_row_uuid).obsData();
        daoLIfe.softKill();
        this.closeModal()
    }
}
