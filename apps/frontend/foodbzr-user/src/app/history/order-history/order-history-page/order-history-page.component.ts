import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetch_order_of_user, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrder, IGetOrderUser } from '@foodbzr/shared/types';
import { Platform, PopoverController } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import * as moment from 'moment';
import { LoadingScreenService } from '../../../loading-screen.service';
import { DateRangeComponent } from '../components/date-range/date-range.component';

@Component({
    selector: 'foodbzr-order-history-page',
    templateUrl: './order-history-page.component.html',
    styleUrls: ['./order-history-page.component.scss'],
})
export class OrderHistoryPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_order_of_user: FoodbzrDatasource.getInstance().fetch_order_of_user,
    };
    public daosLife: DaoLife;

    /** data */
    public orderHistory: IGetOrderUser[] = [];
    public user_row_uuid: string;
    public start_date: string;
    public end_date: string;

    /** daos */
    fetch_order_of_user__: fetch_order_of_user;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private modal: PopoverController, private ngZone: NgZone, private router: Router, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
        /** add the default date range */
        this.end_date = moment(new Date()).format('YYYY-MM-DD');
        this.start_date = moment(new Date()).subtract(2, 'months').format('YYYY-MM-DD');
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
            /** fetch the order history */
            this.fetch_order_of_user__ = new this.database.fetch_order_of_user(daoConfig);
            this.fetch_order_of_user__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.orderHistory = val.sort((a, b) => +new Date(`${b.date}-01`) - +new Date(`${a.date}-01`));
                    console.log(this.orderHistory)
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_of_user__.fetch(this.user_row_uuid, this.start_date, this.end_date).obsData();
                });
            } else {
                this.fetch_order_of_user__.fetch(this.user_row_uuid, this.start_date, this.end_date).obsData();
            }
        });
    }

    /** nav to full details page */
    navFullDetails(order: IGetOrder) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab3', 'details', order.row_uuid]);
        });
    }

    /** choose date range */
    public async chooseDateRange() {
        const dailogRef = await this.modal.create({
            component: DateRangeComponent,
            componentProps: {
                start_date: this.start_date,
                end_date: this.end_date,
            },
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();

        if (data) {
            this.loading.showLoadingScreen().then((ref) => {
                const start_date = data.start_date;
                const end_date = data.end_date;

                this.start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
                this.end_date = moment(new Date(end_date)).format('YYYY-MM-DD');

                this.fetch_order_of_user__.fetch(this.user_row_uuid, this.start_date, this.end_date).obsData();
            });
        }
    }
}
