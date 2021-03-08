import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { Platform, ToastController, ViewWillEnter } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';

@Component({
    selector: 'foodbzr-mobile-taker-page',
    templateUrl: './mobile-taker-page.component.html',
    styleUrls: ['./mobile-taker-page.component.scss'],
})
export class MobileTakerPageComponent implements OnInit, ViewWillEnter {
    public database = {
        update_partner_auth: FoodbzrDatasource.getInstance().update_partner_auth,
    };

    /** data */
    public mobile_number: string;
    public can_click_next_button = true;

    constructor(
        private toast: ToastController,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ngZone: NgZone,
        private platform: Platform,
        private loading: LoadingScreenService
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        if (this.isAuth()) {
            this.navToMainScreen();
        }
    }

    /** request otp */
    public async requestOtp() {
        this.can_click_next_button = false;

        // if (this.mobile_number.toString().length !== 10 || !is_pure_number(this.mobile_number)) {
        //     this.printToastMessage('Wrong mobile number');
        //     return;
        // }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_partner_auth__ = new this.database.update_partner_auth(daoConfig);
            update_partner_auth__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
                this.can_click_next_button = true;
                const data = val;
                if (data.is_err) {
                    this.printToastMessage(data.error);
                    return;
                }
                /**  nav to otp screen */
                this.navOtpScreen(data.partner_row_uuid, this.mobile_number);
            });

            this.loading.showLoadingScreen().then(async () => {
                (await update_partner_auth__.fetch(this.mobile_number)).obsData();
            });
            daoLife.softKill();
        });
    }

    /** print the toast message */
    public async printToastMessage(message: string) {
        const toastRef = await this.toast.create({
            translucent: true,
            header: message,
            duration: 1000,
        });

        await toastRef.present();
    }

    /** check if the user is authenticated */
    public isAuth() {
        const partner_row_uuid = localStorage.getItem('partner_row_uuid');
        if (!partner_row_uuid) {
            return false;
        } else {
            return true;
        }
    }

    /** nav to otp screen */
    public navOtpScreen(partner_row_uuid: string, mobile_number: string) {
        this.ngZone.run(() => {
            this.router.navigate(['auth', 'otp', partner_row_uuid, mobile_number]);
        });
    }

    /** nav to main screen */
    public navToMainScreen() {
        this.ngZone.run(() => {
            this.router.navigate(['tabs']);
        });
    }
}
