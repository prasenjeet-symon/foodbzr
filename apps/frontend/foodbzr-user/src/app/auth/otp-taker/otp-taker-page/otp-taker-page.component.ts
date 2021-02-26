import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { is_pure_number } from '@foodbzr/shared/util';
import { ToastController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-otp-taker-page',
    templateUrl: './otp-taker-page.component.html',
    styleUrls: ['./otp-taker-page.component.scss'],
})
export class OtpTakerPageComponent implements OnInit, OnDestroy {
    public database = {
        update_user_verify_otp: FoodbzrDatasource.getInstance().update_user_verify_otp,
        update_user_resend_otp: FoodbzrDatasource.getInstance().update_user_resend_otp,
    };

    /** data */
    public mobile_number: string;
    public user_row_uuid: string;
    public can_click_verify_button = true;
    public can_click_resend_button = false;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private ngZone: NgZone, private toast: ToastController) {}

    ngOnInit() {
        this.ngZone.run(() => {
            this.activatedRoute.paramMap.subscribe((param) => {
                if (param.has('user_row_uuid') && param.has('mobile_number')) {
                    this.user_row_uuid = param.get('user_row_uuid');
                    this.mobile_number = param.get('mobile_number');
                }
            });
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

        const daoLife = new DaoLife();
        const update_user_verify_otp = new this.database.update_user_verify_otp(daoConfig);
        update_user_verify_otp.observe(daoLife).subscribe((val) => {
            if (val.is_err) {
                /** print the message */
                this.can_click_verify_button = true;
                this.printToastMessage(val.error);
                return;
            }

            /** set the local storage */
            localStorage.setItem('user_row_uuid', val.user_row_uuid);
            /** nav to main tab */
            this.can_click_verify_button = true;
            this.navToMainPage();
        });
        (await update_user_verify_otp.fetch(this.mobile_number, otp_user, this.user_row_uuid)).obsData();
        daoLife.softKill();
    }

    /** resend the otp */
    public async resendOTP() {
        this.resendOTPCounter();
        /** resend the otp */
        const daoLife = new DaoLife();
        const update_user_resend_otp = new this.database.update_user_resend_otp(daoConfig);
        update_user_resend_otp.observe(daoLife).subscribe((val) => {
            if (val.is_err) {
                this.printToastMessage(val.error);
                return;
            }

            this.printToastMessage(`OTP sent to your mobile +91 ${this.mobile_number}`);
        });

        (await update_user_resend_otp.fetch(this.mobile_number, this.user_row_uuid)).obsData();
        daoLife.softKill();
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
