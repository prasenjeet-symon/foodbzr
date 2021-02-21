import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetch_order_of_user, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrder, IGetOrderUser } from '@foodbzr/shared/types';
import { DaoLife, daoConfig } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-order-history-page',
    templateUrl: './order-history-page.component.html',
    styleUrls: ['./order-history-page.component.scss'],
})
export class OrderHistoryPageComponent implements OnInit {
    daosLife: DaoLife;

    /** database */
    public database = {
        fetch_order_of_user: FoodbzrDatasource.getInstance().fetch_order_of_user,
    };

    /** data */
    public orderHistory: IGetOrderUser[] = [];
    public user_row_uuid: string;

    /** daos */
    fetch_order_of_user__: fetch_order_of_user;

    constructor(private ngZone: NgZone, private router: Router) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
    }

    ngOnInit() {
        /** fetch the order history */
        this.fetch_order_of_user__ = new this.database.fetch_order_of_user(daoConfig);
        this.fetch_order_of_user__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.orderHistory = val;
            });
        });
        this.fetch_order_of_user__.fetch(this.user_row_uuid).obsData();
    }

    /** nav to full details page */
    navFullDetails(order: IGetOrder) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab3', 'details', order.row_uuid]);
        });
    }
}
