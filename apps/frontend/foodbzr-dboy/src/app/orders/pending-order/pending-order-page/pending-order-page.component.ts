import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_order_pending_dboy, FoodbzrDatasource, fetch_order_on_way_dboy } from '@foodbzr/datasource';
import { IGetOrder, IGetOrderOnWay } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'foodbzr-pending-order-page',
    templateUrl: './pending-order-page.component.html',
    styleUrls: ['./pending-order-page.component.scss'],
})
export class PendingOrderPageComponent implements OnInit, OnDestroy {
    private dboy_row_uuid: string;

    public database = {
        fetch_order_pending_dboy: FoodbzrDatasource.getInstance().fetch_order_pending_dboy,
        update_order_remove_dboy: FoodbzrDatasource.getInstance().update_order_remove_dboy,
        update_t_order_lifecycle: FoodbzrDatasource.getInstance().update_t_order_lifecycle,
        fetch_order_on_way_dboy: FoodbzrDatasource.getInstance().fetch_order_on_way_dboy,
    };
    daosLife: DaoLife;

    /** data */
    allPendingOrder: IGetOrder[] = [];
    allOnwayOrders: IGetOrderOnWay[] = [];

    /** daos */
    fetch_order_pending_dboy__: fetch_order_pending_dboy;
    fetch_order_on_way_dboy__: fetch_order_on_way_dboy;

    constructor(private ngZone: NgZone) {
        this.dboy_row_uuid = localStorage.getItem('dboy_row_uuid');
    }

    ngOnInit() {
        /** fetch the pending order */
        this.fetch_order_pending_dboy__ = new this.database.fetch_order_pending_dboy(daoConfig);
        this.fetch_order_on_way_dboy__ = new this.database.fetch_order_on_way_dboy(daoConfig);

        const combinedLatest$$ = combineLatest(this.fetch_order_pending_dboy__.observe(this.daosLife), this.fetch_order_on_way_dboy__.observe(this.daosLife));

        combinedLatest$$.subscribe((val) => {
            this.ngZone.run(() => {
                this.allPendingOrder = val[0];
                this.allOnwayOrders = val[1];
            });
        });

        this.fetch_order_pending_dboy__.fetch(this.dboy_row_uuid).obsData();
        this.fetch_order_on_way_dboy__.fetch(this.dboy_row_uuid).obsData();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }

    trackerPending(index: number, value: IGetOrder) {
        return value.row_uuid;
    }

    trackerOnWay(index: number, value: IGetOrderOnWay) {
        return value.row_uuid;
    }

    /** remove the assigment */
    public removeDboy(order: IGetOrder) {
        const daoLife = new DaoLife();
        const update_order_remove_dboy__ = new this.database.update_order_remove_dboy(daoConfig);
        update_order_remove_dboy__.observe(daoLife).subscribe((val) => console.log('removed the assigment'));
        update_order_remove_dboy__.fetch(order.row_uuid).obsData();
        daoLife.softKill();
    }

    /** change the order status */
    public async changeOrderStatusOnWay(order: IGetOrder) {
        const daoLife = new DaoLife();
        const update_t_order_lifecycle__ = new this.database.update_t_order_lifecycle(daoConfig);
        update_t_order_lifecycle__.observe(daoLife).subscribe((val) => console.log('updated the status'));
        (await update_t_order_lifecycle__.fetch('order pickedup then order on its way', order.row_uuid)).obsData();
        daoLife.softKill();
    }

    /** cancel the order */
    public async cancelOrder(order: IGetOrderOnWay) {
        const daoLife = new DaoLife();
        const update_t_order_lifecycle__ = new this.database.update_t_order_lifecycle(daoConfig);
        update_t_order_lifecycle__.observe(daoLife).subscribe((val) => console.log('updated the status'));
        (await update_t_order_lifecycle__.fetch('canceled', order.row_uuid)).obsData();
        daoLife.softKill();
    }
}
