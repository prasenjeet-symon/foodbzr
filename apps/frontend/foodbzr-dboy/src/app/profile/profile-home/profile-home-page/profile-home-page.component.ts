import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetch_dboy_single, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetDBoy } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { FcmService } from '../../../fcm.service';
import { LoadingScreenService } from '../../../loading-screen.service';
import { UpdateBioComponent } from '../components/update-bio/update-bio.component';
import { UpdateGenderComponent } from '../components/update-gender/update-gender.component';
import { UpdateNameComponent } from '../components/update-name/update-name.component';

@Component({
    selector: 'foodbzr-profile-home-page',
    templateUrl: './profile-home-page.component.html',
    styleUrls: ['./profile-home-page.component.scss'],
})
export class ProfileHomePageComponent implements OnInit, OnDestroy {
    public daosLife: DaoLife;
    public database = {
        fetch_dboy_single: FoodbzrDatasource.getInstance().fetch_dboy_single,
        update_dboy: FoodbzrDatasource.getInstance().update_dboy,
    };

    /** data */
    public dboyDetails: IGetDBoy;
    public dboy_row_uuid: string;

    /** daos */
    fetch_dboy_single__: fetch_dboy_single;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private router: Router, private ngZone: NgZone, private modal: ModalController, private platform: Platform, private loading: LoadingScreenService, private fcm: FcmService) {
        this.daosLife = new DaoLife();
        this.dboy_row_uuid = localStorage.getItem('dboy_row_uuid');
        this.fcm.initPush();
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

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.toogleDarkMode();
            /** fetch the dboy profile info */
            this.fetch_dboy_single__ = new this.database.fetch_dboy_single(daoConfig);
            this.fetch_dboy_single__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    if (val.length !== 0) {
                        this.dboyDetails = val[0];
                    } else {
                        this.dboyDetails = null;
                    }
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_dboy_single__.fetch(this.dboy_row_uuid).obsData();
                });
            } else {
                this.fetch_dboy_single__.fetch(this.dboy_row_uuid).obsData();
            }
        });
    }

    /** update the profile */
    public async updateName() {
        const dailogRef = await this.modal.create({
            component: UpdateNameComponent,
            componentProps: {
                database: this.database,
                dboy: this.dboyDetails,
            },
        });

        await dailogRef.present();
    }

    public async updateBio() {
        const dailogRef = await this.modal.create({
            component: UpdateBioComponent,
            componentProps: {
                database: this.database,
                dboy: this.dboyDetails,
            },
        });

        await dailogRef.present();
    }

    public async updateGender() {
        const dailogRef = await this.modal.create({
            component: UpdateGenderComponent,
            componentProps: {
                database: this.database,
                dboy: this.dboyDetails,
            },
        });

        await dailogRef.present();
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
        localStorage.removeItem('dboy_row_uuid');
        this.ngZone.run(() => {
            this.router.navigate(['auth']);
        });
    }

    
}
