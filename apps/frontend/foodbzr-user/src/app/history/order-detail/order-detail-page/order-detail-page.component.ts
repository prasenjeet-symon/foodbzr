import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fetch_order_single, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrder } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';

@Component({
    selector: 'foodbzr-order-detail-page',
    templateUrl: './order-detail-page.component.html',
    styleUrls: ['./order-detail-page.component.scss'],
})
export class OrderDetailPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_order_single: FoodbzrDatasource.getInstance().fetch_order_single,
    };
    public daosLife: DaoLife;

    /** data */
    public order_row_uuid: string;
    public orderDetails: IGetOrder;

    /** daos */
    fetch_order_single__: fetch_order_single;

    /** Subscription */
    public networkSubscription: any;

    constructor(private platform: Platform, private loading: LoadingScreenService, private activatedRoute: ActivatedRoute, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.activatedRoute.paramMap.subscribe((val) => {
                if (val.has('order_row_uuid')) {
                    this.order_row_uuid = val.get('order_row_uuid');
                    this.initScreen();
                    this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
                        if (val) {
                            this.daosLife.softKill();
                            this.initScreen(false);
                        }
                    });
                }
            });
        });
    }

    ngOnDestroy() {
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        this.daosLife.softKill();
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_order_single__ = new this.database.fetch_order_single(daoConfig);
            this.fetch_order_single__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    if (val.length !== 0) {
                        this.orderDetails = val[0];
                    } else {
                        this.orderDetails = null;
                    }
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_single__.fetch(this.order_row_uuid).obsData();
                });
            } else {
                this.fetch_order_single__.fetch(this.order_row_uuid).obsData();
            }
        });
    }
}
