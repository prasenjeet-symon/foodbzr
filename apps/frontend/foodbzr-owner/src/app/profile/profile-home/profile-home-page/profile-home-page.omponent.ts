import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetch_owner, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOwner } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';
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

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private modal: ModalController, private platform: Platform, private loading: LoadingScreenService, private router: Router) {
        this.daosLife = new DaoLife();
        this.owner_row_uuid = localStorage.getItem('owner_row_uuid');
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
            this.fetch_owner__ = new this.database.fetch_owner(daoConfig);
            this.fetch_owner__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    if (val.length !== 0) {
                        this.ownerData = val[0];
                    } else {
                        this.ownerData = null;
                    }
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_owner__.fetch(this.owner_row_uuid).obsData();
                });
            } else {
                this.fetch_owner__.fetch(this.owner_row_uuid).obsData();
            }
        });
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
        function checkToggle(shouldCheck: boolean) {
            toggle.checked = shouldCheck;
        }
    }

    /** logout */
    public logOut() {
        localStorage.removeItem('owner_row_uuid');
        this.ngZone.run(() => {
            this.router.navigate(['auth']);
        });
    }
}
