import { Component, Input, OnInit } from '@angular/core';
import { update_partner_bio } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-update-bio',
    templateUrl: './update-bio.component.html',
    styleUrls: ['./update-bio.component.scss'],
})
export class UpdateBioComponent implements OnInit {
    @Input() partner_row_uuid: string;
    @Input() prev_bio: string;
    @Input() database: { update_partner_bio: databaseDao<update_partner_bio> };

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    /** update the bio */
    updateBio() {
        if (!this.prev_bio) {
            return;
        }

        const daoLife = new DaoLife();
        const update_partner_bio__ = new this.database.update_partner_bio(daoConfig);
        update_partner_bio__.observe(daoLife).subscribe((val) => console.log('updated the bio'));
        update_partner_bio__.fetch(this.prev_bio, this.partner_row_uuid).obsData();
        daoLife.softKill();
        this.dismissModal();
    }

    /** dismiss modal */
    dismissModal() {
        this.modal.dismiss();
    }
}
