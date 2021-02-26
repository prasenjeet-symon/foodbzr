import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FoodbzrDatasource, fetch_owner } from '@foodbzr/datasource';
import { IGetOwner } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { UpdateBioComponent } from '../components/update-bio/update-bio.component';
import { UpdateGenderComponent } from '../components/update-gender/update-gender.component';
import { UpdateNameComponent } from '../components/update-name/update-name.component';

@Component({
    selector: 'foodbzr-profile-home-page',
    templateUrl: './profile-home-page.omponent.html',
    styleUrls: ['./profile-home-page.omponent.scss'],
})
export class ProfileHomePageComponent implements OnInit, OnDestroy {
    public daosLife: DaoLife;
    public database = {
        fetch_owner: FoodbzrDatasource.getInstance().fetch_owner,
        update_owner_bio: FoodbzrDatasource.getInstance().update_owner_bio,
        update_owner_gender: FoodbzrDatasource.getInstance().update_owner_gender,
        update_owner_name: FoodbzrDatasource.getInstance().update_owner_name,
    };

    /** data */
    public owner_row_uuid: string;
    ownerData: IGetOwner;

    /** daos */
    fetch_owner__: fetch_owner;

    constructor(private ngZone: NgZone, private modal: ModalController) {
        this.daosLife = new DaoLife();
        this.owner_row_uuid = localStorage.getItem('owner_row_uuid');
    }

    ngOnInit() {
        this.fetch_owner__ = new this.database.fetch_owner(daoConfig);
        this.fetch_owner__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                if (val.length !== 0) {
                    this.ownerData = val[0];
                } else {
                    this.ownerData = null;
                }
            });
        });
        this.fetch_owner__.fetch(this.owner_row_uuid).obsData();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }

    /** update the bio */
    async updateBio() {
        const dailogRef = this.modal.create({
            component: UpdateBioComponent,
            componentProps: {
                database: this.database,
                owner_row_uuid: this.owner_row_uuid,
                prev_bio: this.ownerData.bio,
            },
        });

        (await dailogRef).present();
    }

    /** update the name */
    async updateName() {
        const dailogRef = await this.modal.create({
            component: UpdateNameComponent,
            componentProps: {
                prev_name: this.ownerData.full_name,
                database: this.database,
                owner_row_uuid: this.owner_row_uuid,
            },
        });

        dailogRef.present();
    }

    /** update the gender */
    async updateGender() {
        const dailogRef = await this.modal.create({
            component: UpdateGenderComponent,
            componentProps: { database: this.database, prev_gender: this.ownerData.gender, owner_row_uuid: this.owner_row_uuid },
        });

        dailogRef.present();
    }
}
