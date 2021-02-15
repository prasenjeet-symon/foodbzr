import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_order_status, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrder, order_lifecycle_state } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { combineLatest } from 'rxjs';
import { ChooseDboyComponent } from '../choose-dboy/choose-dboy.component';
import { OrderLocationComponent } from '../order-location/order-location.component';

@Component({
    selector: 'foodbzr-pending-order',
    templateUrl: './pending-order.component.html',
    styleUrls: ['./pending-order.component.scss'],
})
export class PendingOrderComponent implements OnInit, OnDestroy {
    private partner_row_uuid: string;
    public daosLife: DaoLife;

    database = {
        fetch_order_status: FoodbzrDatasource.getInstance().fetch_order_status,
        update_t_order_lifecycle: FoodbzrDatasource.getInstance().update_t_order_lifecycle,
        fetch_dboy_of_kitchen: FoodbzrDatasource.getInstance().fetch_dboy_of_kitchen,
        update_order_assign_dboy: FoodbzrDatasource.getInstance().update_order_assign_dboy,
        update_order_remove_dboy: FoodbzrDatasource.getInstance().update_order_remove_dboy,
    };

    fetch_order_status_pending__: fetch_order_status;
    fetch_order_status_cooking__: fetch_order_status;
    fetch_order_status_onitsway__: fetch_order_status;

    can_show_loading = true;

    pending_arr: IGetOrder[] = [];
    cooking_arr: IGetOrder[] = [];
    onitsway_arr: IGetOrder[] = [];

    constructor(private ngZone: NgZone, private modal: ModalController) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.can_show_loading = true;

        this.fetch_order_status_pending__ = new this.database.fetch_order_status(daoConfig);
        this.fetch_order_status_cooking__ = new this.database.fetch_order_status(daoConfig);
        this.fetch_order_status_onitsway__ = new this.database.fetch_order_status(daoConfig);

        const combinedValues$$ = combineLatest(
            this.fetch_order_status_pending__.observe(this.daosLife),
            this.fetch_order_status_cooking__.observe(this.daosLife),
            this.fetch_order_status_onitsway__.observe(this.daosLife)
        );

        combinedValues$$.subscribe((val) => {
            this.can_show_loading = false;
            this.ngZone.run(() => {
                this.pending_arr = val[0];
                this.cooking_arr = val[1];
                this.onitsway_arr = val[2];
            });
        });

        this.fetch_order_status_pending__.fetch('placed', this.partner_row_uuid).obsData();
        this.fetch_order_status_cooking__.fetch('cooking', this.partner_row_uuid).obsData();
        this.fetch_order_status_onitsway__.fetch('on_way', this.partner_row_uuid).obsData();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }

    async changeOrderStatus(status: order_lifecycle_state, order_row_uuid: string) {
        const daoLife = new DaoLife();
        const update_t_order_lifecycle_dao = new this.database.update_t_order_lifecycle(daoConfig);
        update_t_order_lifecycle_dao.observe(daoLife).subscribe((val) => console.log('updated the order lifecycle'));
        (await update_t_order_lifecycle_dao.fetch(status, order_row_uuid)).obsData();
        daoLife.softKill();
    }

    /** Show the user location on the google map */
    async showOrderLocation(latitude: number, longitude: number) {
        const dailogRef = await this.modal.create({
            component: OrderLocationComponent,
            componentProps: {
                latitude: latitude,
                longitude: longitude,
                user_name: 'lorem',
            },
        });

        await dailogRef.present();
    }

    /** Choose the delivery boy for the cokking order  */
    async chooseDeliveryBoy(selected_dboy_row_uuid: string, kitchen_row_uuid: string, order_row_uuid: string) {
        this.ngZone.run(async () => {
            const modalRef = await this.modal.create({
                component: ChooseDboyComponent,
                componentProps: {
                    selected_dboy_row_uuid: selected_dboy_row_uuid,
                    kitchen_row_uuid: kitchen_row_uuid,
                    order_row_uuid: order_row_uuid,
                    database: this.database,
                },
            });

            await modalRef.present();
        });
    }

    pendingOrderTracker(index: number, value: IGetOrder) {
        return value.row_uuid;
    }

    cookingOrderTracker(index: number, value: IGetOrder) {
        return value.row_uuid;
    }

    onitsWayOrderTracker(index: number, value: IGetOrder) {
        return value.row_uuid;
    }
}
