import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetch_user_single, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetUser } from '@foodbzr/shared/types';
import { convertJsDateToSQL } from '@foodbzr/shared/util';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import * as moment from 'moment';
import { FcmService } from '../../../fcm.service';
import { LoadingScreenService } from '../../../loading-screen.service';
import { UpdateBioComponent } from '../components/update-bio/update-bio.component';
import { UpdateBirthdateComponent } from '../components/update-birthdate/update-birthdate.component';
import { UpdateGenderComponent } from '../components/update-gender/update-gender.component';
import { UpdateNameComponent } from '../components/update-name/update-name.component';

@Component({
    selector: 'foodbzr-user-profile-page',
    templateUrl: './user-profile-page.component.html',
    styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent implements OnInit, OnDestroy {
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

    /** subscriptions */
    public networkSubscription: any;

    constructor(private fcm: FcmService, private router: Router, private ngZone: NgZone, private modal: ModalController, private platform: Platform, private loading: LoadingScreenService) {
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
        this.daosLife = new DaoLife();
        this.fcm.initPush();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.initScreen();
        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.toogleDarkMode();
            /** fetch the user */
            this.fetch_user_single__ = new this.database.fetch_user_single(daoConfig);
            this.fetch_user_single__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    if (val.length !== 0) {
                        this.userDetails = val[0];
                    }
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_user_single__.fetch(this.user_row_uuid).obsData();
                });
            } else {
                this.fetch_user_single__.fetch(this.user_row_uuid).obsData();
            }
        });
    }

    /** update the user name */
    public async updateName() {
        this.platform.ready().then(async () => {
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
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });

                this.loading.showLoadingScreen().then(() => {
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
                });

                daoLife.softKill();
            }
        });
    }

    /** update user bio */
    async updateUserBio() {
        this.platform.ready().then(async () => {
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
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });

                this.loading.showLoadingScreen().then(() => {
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
                });

                daoLife.softKill();
            }
        });
    }

    /** update user gender */
    public async updateUserGender() {
        this.platform.ready().then(async () => {
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
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });

                this.loading.showLoadingScreen().then(() => {
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
                });

                daoLife.softKill();
            }
        });
    }

    /** update user birth date */
    public async updateBirthDate() {
        this.platform.ready().then(async () => {
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
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });

                this.loading.showLoadingScreen().then(() => {
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
                });

                daoLife.softKill();
            }
        });
    }

    /** toogle dark mode */
    public toogleDarkMode() {
        const toggle: any = document.querySelector('#themeToggle');

        // Listen for the toggle check/uncheck to toggle the dark class on the <body>
        toggle.addEventListener('ionChange', (ev: any) => {
            document.body.classList.toggle('dark', ev.detail.checked);
        });

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        // Listen for changes to the prefers-color-scheme media query
        prefersDark.addListener((e) => checkToggle(e.matches));

        // Called when the app loads
        function loadApp() {
            checkToggle(prefersDark.matches);
        }

        // Called by the media query to check/uncheck the toggle
        function checkToggle(shouldCheck) {
            toggle.checked = shouldCheck;
        }
    }

    /** logout */
    public logOut() {
        localStorage.removeItem('user_row_uuid');
        this.ngZone.run(() => {
            this.router.navigate(['auth']);
        });
    }
}
