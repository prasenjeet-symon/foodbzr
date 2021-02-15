import { Component, NgZone, OnInit } from '@angular/core';
import { fetch_partner_single, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetPartner } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { UpdateBioComponent } from '../components/update-bio/update-bio.component';
import { UpdateGenderComponent } from '../components/update-gender/update-gender.component';
import { UpdateNameComponent } from '../components/update-name/update-name.component';

@Component({
    selector: 'foodbzr-profile-manager-page',
    templateUrl: './profile-manager-page.component.html',
    styleUrls: ['./profile-manager-page.component.scss'],
})
export class ProfileManagerPage implements OnInit {
    public database = {
        fetch_partner_single: FoodbzrDatasource.getInstance().fetch_partner_single,
        update_partner_bio: FoodbzrDatasource.getInstance().update_partner_bio,
        update_partner_name: FoodbzrDatasource.getInstance().update_partner_name,
        update_partner_gender: FoodbzrDatasource.getInstance().update_partner_gender,
    };
    daosLife: DaoLife;
    partner_row_uuid: string;
    fetch_partner_single__: fetch_partner_single;

    partnerDetail: IGetPartner;

    constructor(private ngZone: NgZone, private modal: ModalController) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.fetch_partner_single__ = new this.database.fetch_partner_single(daoConfig);
        this.fetch_partner_single__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.partnerDetail = val[0];
            });
        });
        this.fetch_partner_single__.fetch(this.partner_row_uuid).obsData();
    }

    /** update the bio */
    async updateBio() {
        const dailogRef = this.modal.create({
            component: UpdateBioComponent,
            componentProps: {
                database: this.database,
                partner_row_uuid: this.partner_row_uuid,
                prev_bio: this.partnerDetail.bio,
            },
        });

        (await dailogRef).present();
    }

    /** update the name */
    async updateName() {
        const dailogRef = await this.modal.create({
            component: UpdateNameComponent,
            componentProps: {
                prev_name: this.partnerDetail.full_name,
                database: this.database,
                partner_row_uuid: this.partner_row_uuid,
            },
        });

        dailogRef.present();
    }

    /** update the gender */
    async updateGender() {
        const dailogRef = await this.modal.create({
            component: UpdateGenderComponent,
            componentProps: { database: this.database, prev_gender: this.partnerDetail.gender, partner_row_uuid: this.partner_row_uuid },
        });

        dailogRef.present();
    }
}
