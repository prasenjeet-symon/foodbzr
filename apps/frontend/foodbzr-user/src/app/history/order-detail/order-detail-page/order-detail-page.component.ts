import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodbzrDatasource, fetch_order_single } from '@foodbzr/datasource';
import { IGetOrder } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-order-detail-page',
    templateUrl: './order-detail-page.component.html',
    styleUrls: ['./order-detail-page.component.scss'],
})
export class OrderDetailPageComponent implements OnInit {
    public daosLife: DaoLife;

    /** data */
    public order_row_uuid: string;
    public orderDetails: IGetOrder;

    /** database */
    public database = {
        fetch_order_single: FoodbzrDatasource.getInstance().fetch_order_single,
    };

    /** daos */
    fetch_order_single__: fetch_order_single;

    constructor(private activatedRoute: ActivatedRoute, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((val) => {
            if (val.has('order_row_uuid')) {
                this.order_row_uuid = val.get('order_row_uuid');
                this.getOrderDetails();
            }
        });
    }

    /** fetch the order details */
    public getOrderDetails() {
        this.fetch_order_single__ = new this.database.fetch_order_single(daoConfig);
        this.fetch_order_single__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                if (val.length !== 0) {
                    this.orderDetails = val[0];
                }
            });
        });
        this.fetch_order_single__.fetch(this.order_row_uuid).obsData();
    }
}
