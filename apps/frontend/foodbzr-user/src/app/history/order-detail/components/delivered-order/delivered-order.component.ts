import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { fetch_order_status_for_user, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrder, IGetOrderStatus } from '@foodbzr/shared/types';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-delivered-order',
    templateUrl: './delivered-order.component.html',
    styleUrls: ['./delivered-order.component.scss'],
})
export class DeliveredOrderComponent implements OnInit, OnDestroy {
    public database = {
        fetch_order_status_for_user: FoodbzrDatasource.getInstance().fetch_order_status_for_user,
    };
    public daosLife: DaoLife;
    @Input() order: IGetOrder;

    /** data */
    public orderStatus: IGetOrderStatus;

    /** daos */
    fetch_order_status_for_user__: fetch_order_status_for_user;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private platform: Platform, private loading: LoadingScreenService, private call: CallNumber) {
        this.daosLife = new DaoLife();
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
            if (can_show_loading) {
                this.loading.showLoadingScreen().then((ref) => {
                    this.fetch_order_status_for_user__ = new this.database.fetch_order_status_for_user(daoConfig);
                    this.fetch_order_status_for_user__.observe(this.daosLife).subscribe((val) => {
                        if (ref.isConnected) {
                            ref.dismiss();
                        }

                        if (val.length !== 0) {
                            this.orderStatus = val[0];
                        } else {
                            this.orderStatus = null;
                        }
                    });
                    this.fetch_order_status_for_user__.fetch(this.order.row_uuid).obsData();
                });
            } else {
                this.fetch_order_status_for_user__ = new this.database.fetch_order_status_for_user(daoConfig);
                this.fetch_order_status_for_user__.observe(this.daosLife).subscribe((val) => {
                    if (val.length !== 0) {
                        this.orderStatus = val[0];
                    } else {
                        this.orderStatus = null;
                    }
                });
                this.fetch_order_status_for_user__.fetch(this.order.row_uuid).obsData();
            }
        });
    }

    callDBoy(number: string) {
        this.call.callNumber(number, true);
    }
}
