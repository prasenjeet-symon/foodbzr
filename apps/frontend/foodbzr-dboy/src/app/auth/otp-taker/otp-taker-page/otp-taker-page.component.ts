import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { is_pure_number } from '@foodbzr/shared/util';
import { ToastController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';

@Component({
    selector: 'foodbzr-otp-taker-page',
    templateUrl: './otp-taker-page.component.html',
    styleUrls: ['./otp-taker-page.component.scss'],
})
export class OtpTakerPageComponent implements OnInit, OnDestroy {
    public database = {
        update_dboy_verify_otp: FoodbzrDatasource.getInstance().update_dboy_verify_otp,
        update_dboy_resend_otp: FoodbzrDatasource.getInstance().update_dboy_resend_otp,
    };

    /** data */
    public mobile_number: string;
    public dboy_row_uuid: string;
    public can_click_verify_button = true;
    public can_click_resend_button = false;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private ngZone: NgZone, private toast: ToastController, private loading: LoadingScreenService) {}

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((param) => {
            if (param.has('dboy_row_uuid') && param.has('mobile_number')) {
                this.dboy_row_uuid = param.get('dboy_row_uuid');
                this.mobile_number = param.get('mobile_number');
            }
        });

        this.resendOTPCounter();
    }

    ngOnDestroy() {}

    /** verify the otp */
    public async verifyOTP(otp_user: string) {
        this.can_click_verify_button = false;
        /**
         *
         */
        if (otp_user.toString().length !== 5) {
            /** error */
            this.can_click_verify_button = true;
            this.printToastMessage('invalid otp');
            return;
        }
        /**
         *
         */
        if (!is_pure_number(otp_user)) {
            /** number error */
            this.can_click_verify_button = true;
            this.printToastMessage('invalid otp');
            return;
        }

        this.loading.showLoadingScreen().then(async () => {
            const daoLife = new DaoLife();
            const update_dboy_verify_otp__ = new this.database.update_dboy_verify_otp(daoConfig);
            update_dboy_verify_otp__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                if (val.is_err) {
                    /** print the message */
                    this.can_click_verify_button = true;
                    this.printToastMessage(val.error);
                    return;
                }

                /** set the local storage */
                localStorage.setItem('dboy_row_uuid', val.dboy_row_uuid);
                /** nav to main tab */
                this.can_click_verify_button = true;
                this.navToMainPage();
            });
            (await update_dboy_verify_otp__.fetch(this.dboy_row_uuid, otp_user)).obsData();
            daoLife.softKill();
        });
    }

    /** resend the otp */
    public async resendOTP() {
        this.resendOTPCounter();
        /** resend the otp */
        this.loading.showLoadingScreen().then(async () => {
            const daoLife = new DaoLife();
            const update_dboy_resend_otp__ = new this.database.update_dboy_resend_otp(daoConfig);
            update_dboy_resend_otp__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                if (val.is_err) {
                    this.printToastMessage(val.error);
                    return;
                }

                this.printToastMessage(`OTP sent to your mobile +91 ${this.mobile_number}`);
            });
            (await update_dboy_resend_otp__.fetch(this.mobile_number, this.dboy_row_uuid)).obsData();
            daoLife.softKill();
        });
    }

    /** resend otp counter */
    public resendOTPCounter() {
        this.can_click_resend_button = false;
        setTimeout(() => {
            this.can_click_resend_button = true;
        }, 12000);
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

    /** nav to tab page */
    public navToMainPage() {
        this.ngZone.run(() => {
            this.router.navigate(['tabs']);
        });
    }
}
