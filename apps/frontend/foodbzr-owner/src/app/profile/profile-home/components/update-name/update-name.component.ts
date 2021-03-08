import { Component, Input, OnInit } from '@angular/core';
import { update_owner_name } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-update-name',
    templateUrl: './update-name.component.html',
    styleUrls: ['./update-name.component.scss'],
})
export class UpdateNameComponent implements OnInit {
    @Input() owner_row_uuid: string;
    @Input() prev_name: string;
    @Input() database: { update_owner_name: databaseDao<update_owner_name> };

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
        const update_owner_name = new this.database.update_owner_name(daoConfig);
        update_owner_name.observe(daoLIfe).subscribe((val) => console.log('updated the name'));
        update_owner_name.fetch(this.prev_name, this.owner_row_uuid).obsData();
        daoLIfe.softKill();
        this.closeModal();
    }
}
