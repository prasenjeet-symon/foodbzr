import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_order_search_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrderStatus } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { Subscription } from 'rxjs';
import { LoadingScreenService } from '../../../loading-screen.service';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';

@Component({
    selector: 'foodbzr-search-home-page',
    templateUrl: './search-home-page.component.html',
    styleUrls: ['./search-home-page.component.scss'],
})
export class SearchHomePageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_order_search_partner: FoodbzrDatasource.getInstance().fetch_order_search_partner,
    };
    public daosLife: DaoLife;

    /** data */
    public searchResult: IGetOrderStatus[] = [];
    public partner_row_uuid: string;

    /** daos */
    fetch_order_search_partner__: fetch_order_search_partner;

    /** subscriptions */
    public networkSubscription: Subscription;

    constructor(private ngZone: NgZone, private modal: ModalController, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
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
            this.fetch_order_search_partner__ = new this.database.fetch_order_search_partner(daoConfig);
            this.fetch_order_search_partner__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.searchResult = val;
                });
            });
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    public search(value: string) {
        this.loading.showLoadingScreen().then(() => {
            this.fetch_order_search_partner__.fetch(this.partner_row_uuid, value).obsData();
        });
    }

    /** show order full details */
    public async showOrderFullDetail(order: IGetOrderStatus) {
        const dailogRef = await this.modal.create({
            component: OrderDetailComponent,
            componentProps: { order: order },
        });

        await dailogRef.present();
    }
}
