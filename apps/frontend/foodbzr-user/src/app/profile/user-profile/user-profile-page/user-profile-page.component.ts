import { Component, NgZone, OnInit } from '@angular/core';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { IGetUser } from '@foodbzr/shared/types';
import { FoodbzrDatasource, fetch_user_single, update_user } from '@foodbzr/datasource';
import { ModalController } from '@ionic/angular';
import { UpdateNameComponent } from '../components/update-name/update-name.component';
import { convertJsDateToSQL } from '@foodbzr/shared/util';
import { UpdateBioComponent } from '../components/update-bio/update-bio.component';
import { UpdateGenderComponent } from '../components/update-gender/update-gender.component';
import { UpdateBirthdateComponent } from '../components/update-birthdate/update-birthdate.component';
import * as moment from 'moment';

@Component({
    selector: 'foodbzr-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent implements OnInit {
    public database = {
        fetch_user_single: FoodbzrDatasource.getInstance().fetch_user_single,
        update_user: FoodbzrDatasource.getInstance().update_user,
    };
    public daosLife: DaoLife;

    /** data */
    public userDetails: IGetUser;
    public user_row_uuid: string;

    /** daos */
    fetch_user_single__: fetch_user_single;

    constructor(private ngZone: NgZone, private modal: ModalController) {
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        /** fetch the user */
        this.fetch_user_single__ = new this.database.fetch_user_single(daoConfig);
        this.fetch_user_single__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                if (val.length !== 0) {
                    this.userDetails = val[0];
                }
            });
        });
        this.fetch_user_single__.fetch(this.user_row_uuid).obsData();
    }

    /** update the user name */
    public async updateName() {
        const dailogRef = await this.modal.create({
            component: UpdateNameComponent,
            componentProps: { full_name: this.userDetails.full_name },
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();
        if (data) {
            const final_name = data;

            /** update the user full name */
            const daoLife = new DaoLife();
            const update_user__ = new this.database.update_user(daoConfig);
            update_user__.observe(daoLife).subscribe((val) => {
                console.log('updated the name of the user');
            });
            update_user__
                .fetch(
                    final_name,
                    this.userDetails.mobile_number,
                    this.userDetails.profile_picture,
                    this.userDetails.bio,
                    this.userDetails.gender,
                    convertJsDateToSQL(this.userDetails.birth_date),
                    this.userDetails.row_uuid
                )
                .obsData();

            daoLife.softKill();
        }
    }

    /** update user bio */
    async updateUserBio() {
        const dailogRef = await this.modal.create({
            component: UpdateBioComponent,
            componentProps: { bio: this.userDetails.bio },
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();

        if (data) {
            const new_bio = data;

            /** update the user bio */
            const daoLife = new DaoLife();
            const update_user__ = new this.database.update_user(daoConfig);
            update_user__.observe(daoLife).subscribe((val) => {
                console.log('updated the name of the user');
            });
            
            update_user__
                .fetch(
                    this.userDetails.full_name,
                    this.userDetails.mobile_number,
                    this.userDetails.profile_picture,
                    new_bio,
                    this.userDetails.gender,
                    convertJsDateToSQL(this.userDetails.birth_date),
                    this.userDetails.row_uuid
                )
                .obsData();

            daoLife.softKill();
        }
    }

    /** update user gender */
    public async updateUserGender() {
        const dailogRef = await this.modal.create({
            componentProps: { gender: this.userDetails.gender },
            component: UpdateGenderComponent,
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();

        if (data) {
            const new_gender = data;
            /** update the user bio */
            const daoLife = new DaoLife();
            const update_user__ = new this.database.update_user(daoConfig);
            update_user__.observe(daoLife).subscribe((val) => {
                console.log('updated the name of the user');
            });
            update_user__
                .fetch(
                    this.userDetails.full_name,
                    this.userDetails.mobile_number,
                    this.userDetails.profile_picture,
                    this.userDetails.bio,
                    new_gender,
                    convertJsDateToSQL(this.userDetails.birth_date),
                    this.userDetails.row_uuid
                )
                .obsData();

            daoLife.softKill();
        }
    }

    /** update user birth date */
    public async updateBirthDate() {
        const dailogRef = await this.modal.create({
            component: UpdateBirthdateComponent,
            componentProps: { birth_date: this.userDetails.birth_date },
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();

        if (data) {
            const new_birthdate = moment(new Date(data)).format('YYYY-MM-DD');

            /** update the user birthdate */
            const daoLife = new DaoLife();
            const update_user__ = new this.database.update_user(daoConfig);
            update_user__.observe(daoLife).subscribe((val) => {
                console.log('updated the name of the user');
            });
            update_user__
                .fetch(
                    this.userDetails.full_name,
                    this.userDetails.mobile_number,
                    this.userDetails.profile_picture,
                    this.userDetails.bio,
                    this.userDetails.gender,
                    new_birthdate,
                    this.userDetails.row_uuid
                )
                .obsData();

            daoLife.softKill();
        }
    }
}
