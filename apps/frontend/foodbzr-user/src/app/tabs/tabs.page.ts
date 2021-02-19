import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { FoodbzrDatasource, fetch_user_cart_total_items } from '@foodbzr/datasource';

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
    constructor(private ngZone: NgZone) {
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
        this.daosLife = new DaoLife();
    }

    fetch_user_cart_total_items__: fetch_user_cart_total_items;

    ngOnInit() {
        this.fetch_user_cart_total_items__ = new this.database.fetch_user_cart_total_items(daoConfig);
        this.fetch_user_cart_total_items__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.totalItemsInCart = val[0].items;
            });
        });
        this.fetch_user_cart_total_items__.fetch(this.user_row_uuid).obsData();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }
}
