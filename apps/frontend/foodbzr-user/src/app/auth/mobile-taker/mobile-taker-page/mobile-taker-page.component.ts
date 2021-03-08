import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { is_pure_number } from '@foodbzr/shared/util';
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
        update_user_auth: FoodbzrDatasource.getInstance().update_user_auth,
    };

    /** data */
    public mobile_number: string;

    constructor(private toast: ToastController, private router: Router, private ngZone: NgZone, private loading: LoadingScreenService, private platform: Platform) {}

    ngOnInit() {
        if (this.isAuth()) {
            this.navToMainScreen();
        }
    }

    ionViewWillEnter() {}

    /** request otp */
    public async requestOtp() {
        if (this.mobile_number.toString().length !== 10 || !is_pure_number(this.mobile_number)) {
            this.printToastMessage('Wrong mobile number');
            return;
        }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_user_auth = new this.database.update_user_auth(daoConfig);
            update_user_auth.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                const data = val;

                if (data.is_err) {
                    this.printToastMessage(data.error);
                    return;
                }

                /**  nav to otp screen */
                this.navOtpScreen(data.user_row_uuid, this.mobile_number);
            });

            this.loading.showLoadingScreen().then(async () => {
                (await update_user_auth.fetch(this.mobile_number)).obsData();
            });

            daoLife.softKill();
        });
    }

    /** print the toast message */
    public async printToastMessage(message: string) {
        const toastRef = await this.toast.create({
            translucent: true,
            header: message,
            duration: 5000,
        });

        await toastRef.present();
    }

    /** check if the user is authenticated */
    public isAuth() {
        const user_row_uuid = localStorage.getItem('user_row_uuid');
        if (!user_row_uuid) {
            return false;
        } else {
            return true;
        }
    }

    /** nav to otp screen */
    public navOtpScreen(user_row_uuid: string, mobile_number: string) {
        this.ngZone.run(() => {
            this.router.navigate(['auth', 'otp', user_row_uuid, mobile_number]);
        });
    }

    /** nav to main screen */
    public navToMainScreen() {
        this.ngZone.run(() => {
            this.router.navigate(['tabs']);
        });
    }
}
