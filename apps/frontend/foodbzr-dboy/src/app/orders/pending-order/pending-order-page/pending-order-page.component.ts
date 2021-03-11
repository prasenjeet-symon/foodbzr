import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_order_on_way_dboy, fetch_order_pending_dboy, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrder, IGetOrderOnWay } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { combineLatest } from 'rxjs';
import { LoadingScreenService } from '../../../loading-screen.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { FcmService } from '../../../fcm.service';

@Component({
    selector: 'foodbzr-pending-order-page',
    templateUrl: './pending-order-page.component.html',
    styleUrls: ['./pending-order-page.component.scss'],
})
export class PendingOrderPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_order_pending_dboy: FoodbzrDatasource.getInstance().fetch_order_pending_dboy,
        update_order_remove_dboy: FoodbzrDatasource.getInstance().update_order_remove_dboy,
        update_t_order_lifecycle: FoodbzrDatasource.getInstance().update_t_order_lifecycle,
        fetch_order_on_way_dboy: FoodbzrDatasource.getInstance().fetch_order_on_way_dboy,
    };
    daosLife: DaoLife;

    /** data */
    private dboy_row_uuid: string;
    public allPendingOrder: IGetOrder[] = [];
    allOnwayOrders: IGetOrderOnWay[] = [];

    /** daos */
    fetch_order_pending_dboy__: fetch_order_pending_dboy;
    fetch_order_on_way_dboy__: fetch_order_on_way_dboy;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private loading: LoadingScreenService, private platform: Platform, private call: CallNumber, private fcm: FcmService) {
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
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        this.daosLife.softKill();
    }

    initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            /** fetch the pending order */
            this.fetch_order_pending_dboy__ = new this.database.fetch_order_pending_dboy(daoConfig);
            this.fetch_order_on_way_dboy__ = new this.database.fetch_order_on_way_dboy(daoConfig);

            const combinedLatest$$ = combineLatest(this.fetch_order_pending_dboy__.observe(this.daosLife), this.fetch_order_on_way_dboy__.observe(this.daosLife));

            combinedLatest$$.subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.allPendingOrder = val[0];
                    this.allOnwayOrders = val[1];
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_pending_dboy__.fetch(this.dboy_row_uuid).obsData();
                    this.fetch_order_on_way_dboy__.fetch(this.dboy_row_uuid).obsData();
                });
            } else {
                this.fetch_order_pending_dboy__.fetch(this.dboy_row_uuid).obsData();
                this.fetch_order_on_way_dboy__.fetch(this.dboy_row_uuid).obsData();
            }
        });
    }

    trackerPending(index: number, value: IGetOrder) {
        return value.row_uuid;
    }

    trackerOnWay(index: number, value: IGetOrderOnWay) {
        return value.row_uuid;
    }

    /** remove the assigment */
    public removeDboy(order: IGetOrder) {
        this.loading.showLoadingScreen().then(() => {
            const daoLife = new DaoLife();
            const update_order_remove_dboy__ = new this.database.update_order_remove_dboy(daoConfig);
            update_order_remove_dboy__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            update_order_remove_dboy__.fetch(order.row_uuid).obsData();
            daoLife.softKill();
        });
    }

    /** change the order status */
    public async changeOrderStatusOnWay(order: IGetOrder) {
        this.loading.showLoadingScreen().then(async () => {
            const daoLife = new DaoLife();
            const update_t_order_lifecycle__ = new this.database.update_t_order_lifecycle(daoConfig);
            update_t_order_lifecycle__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            (await update_t_order_lifecycle__.fetch('order pickedup then order on its way', order.row_uuid)).obsData();
            daoLife.softKill();
        });
    }

    /** cancel the order */
    public async cancelOrder(order: IGetOrderOnWay) {
        this.loading.showLoadingScreen().then(async () => {
            const daoLife = new DaoLife();
            const update_t_order_lifecycle__ = new this.database.update_t_order_lifecycle(daoConfig);
            update_t_order_lifecycle__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            (await update_t_order_lifecycle__.fetch('canceled', order.row_uuid)).obsData();
            daoLife.softKill();
        });
    }

    public callNumbers(numb: string) {
        if (this.call.isCallSupported) {
            this.call.callNumber(numb, true);
        }
    }
}
