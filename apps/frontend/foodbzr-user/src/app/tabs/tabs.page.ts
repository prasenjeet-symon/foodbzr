import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_user_cart_total_items, FoodbzrDatasource } from '@foodbzr/datasource';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
    private user_row_uuid: string;
    public daosLife: DaoLife;
    public totalItemsInCart = 0;
    public database = {
        fetch_user_cart_total_items: FoodbzrDatasource.getInstance().fetch_user_cart_total_items,
    };

    /** subscription */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private platform: Platform) {
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
        this.daosLife = new DaoLife();
    }

    fetch_user_cart_total_items__: fetch_user_cart_total_items;

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
            this.fetch_user_cart_total_items__ = new this.database.fetch_user_cart_total_items(daoConfig);
            this.fetch_user_cart_total_items__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    this.totalItemsInCart = val[0].items;
                });
            });
            this.fetch_user_cart_total_items__.fetch(this.user_row_uuid).obsData();
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }
}
