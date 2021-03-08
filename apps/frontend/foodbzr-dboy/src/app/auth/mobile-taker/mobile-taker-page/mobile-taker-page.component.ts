import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';

@Component({
    selector: 'foodbzr-mobile-taker-page',
    templateUrl: './mobile-taker-page.component.html',
    styleUrls: ['./mobile-taker-page.component.scss'],
})
export class MobileTakerPageComponent implements OnInit, ViewWillEnter {
    public database = {
        auth_dboy: FoodbzrDatasource.getInstance().auth_dboy,
    };

    /** data */
    public mobile_number: string;
    public can_click_next_button = true;

    constructor(private loading: LoadingScreenService, private toast: ToastController, private router: Router, private activatedRoute: ActivatedRoute, private ngZone: NgZone) {}

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

        this.loading.showLoadingScreen().then(async () => {
            const daoLife = new DaoLife();
            const auth_dboy__ = new this.database.auth_dboy(daoConfig);
            auth_dboy__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                const data = val;
                if (data.is_err) {
                    this.can_click_next_button = true;
                    this.printToastMessage(data.error);
                    return;
                }

                this.can_click_next_button = true;
                this.navOtpScreen(data.dboy_row_uuid, this.mobile_number);
            });
            (await auth_dboy__.fetch(this.mobile_number)).obsData();
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
        const dboy_row_uuid = localStorage.getItem('dboy_row_uuid');
        if (!dboy_row_uuid) {
            return false;
        } else {
            return true;
        }
    }

    /** nav to otp screen */
    public navOtpScreen(dboy_row_uuid: string, mobile_number: string) {
        this.ngZone.run(() => {
            this.router.navigate(['auth', 'otp', dboy_row_uuid, mobile_number]);
        });
    }

    /** nav to main screen */
    public navToMainScreen() {
        this.ngZone.run(() => {
            this.router.navigate(['tabs']);
        });
    }
}
