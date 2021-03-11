import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CameraResultType, Plugins } from '@capacitor/core';
import { fetch_partner_single, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetPartner } from '@foodbzr/shared/types';
import { uri_to_blob } from '@foodbzr/shared/util';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import Axios from 'axios';
import { Subscription } from 'rxjs';
import { LoadingScreenService } from '../../../loading-screen.service';
import { UpdateBioComponent } from '../components/update-bio/update-bio.component';
import { UpdateGenderComponent } from '../components/update-gender/update-gender.component';
import { UpdateNameComponent } from '../components/update-name/update-name.component';
const { Camera } = Plugins;

@Component({
    selector: 'foodbzr-profile-manager-page',
    templateUrl: './profile-manager-page.component.html',
    styleUrls: ['./profile-manager-page.component.scss'],
})
export class ProfileManagerPage implements OnInit, OnDestroy, AfterViewInit {
    public database = {
        fetch_partner_single: FoodbzrDatasource.getInstance().fetch_partner_single,
        update_partner_bio: FoodbzrDatasource.getInstance().update_partner_bio,
        update_partner_name: FoodbzrDatasource.getInstance().update_partner_name,
        update_partner_gender: FoodbzrDatasource.getInstance().update_partner_gender,
        update_partner: FoodbzrDatasource.getInstance().update_partner,
    };
    daosLife: DaoLife;
    partner_row_uuid: string;
    fetch_partner_single__: fetch_partner_single;

    partnerDetail: IGetPartner;

    /** subscriptions */
    public networkSubscription: Subscription;

    constructor(private ngZone: NgZone, private modal: ModalController, private loading: LoadingScreenService, private platform: Platform, private router: Router) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngAfterViewInit() {}

    ngOnDestroy() {
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        this.daosLife.softKill();
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
            this.fetch_partner_single__ = new this.database.fetch_partner_single(daoConfig);
            this.fetch_partner_single__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.partnerDetail = val[0];
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_partner_single__.fetch(this.partner_row_uuid).obsData();
                });
            } else {
                this.fetch_partner_single__.fetch(this.partner_row_uuid).obsData();
            }
        });
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

    /** uplaod the picture */
    public async upload_pic() {
        const image = await Camera.getPhoto({
            quality: 70,
            allowEditing: true,
            resultType: CameraResultType.Base64,
        });

        if (!image) {
            return;
        }

        var imageUrl = `data:image/${image.format};base64,${image.base64String}`;

        /** convert the base64 to blob */
        const image_blob = await uri_to_blob(imageUrl);
        const form_data = new FormData();
        form_data.append('avatar', image_blob, `${+new Date()}_.${image.format}`);
        const domain_name = localStorage.getItem('domain_name');
        if (!domain_name) {
            return;
        }

        const upload_uri = domain_name + '/upload_profile_picture';
        const uploaded_image = await Axios.post(upload_uri, form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const image_data = uploaded_image.data;

        /** change the profile picture of the partner */
        if (!image_data) {
            return;
        }

        const daoLife = new DaoLife();
        const update_partner__ = new this.database.update_partner(daoConfig);
        update_partner__.observe(daoLife).subscribe((val) => {
            if (this.loading.dailogRef.isConnected) {
                this.loading.dailogRef.dismiss();
            }
        });

        this.loading.showLoadingScreen().then(() => {
            update_partner__.fetch(image_data.pic_uri, this.partnerDetail.gender, this.partnerDetail.full_name, this.partnerDetail.bio, this.partnerDetail.row_uuid).obsData();
        });
    }

    /** logout */
    public logOut() {
        localStorage.removeItem('partner_row_uuid');
        this.ngZone.run(() => {
            this.router.navigate(['auth']);
        });
    }
}
