import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_order_status, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrderStatus, order_lifecycle_state } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { Subscription } from 'rxjs';
import { LoadingScreenService } from '../../../../loading-screen.service';
import { ChooseDboyComponent } from '../choose-dboy/choose-dboy.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { OrderLocationComponent } from '../order-location/order-location.component';

@Component({
    selector: 'foodbzr-pending-order',
    templateUrl: './pending-order.component.html',
    styleUrls: ['./pending-order.component.scss'],
})
export class PendingOrderComponent implements OnInit, OnDestroy {
    public daosLife: DaoLife;
    public database = {
        fetch_order_status: FoodbzrDatasource.getInstance().fetch_order_status,
        update_t_order_lifecycle: FoodbzrDatasource.getInstance().update_t_order_lifecycle,
        fetch_dboy_of_kitchen: FoodbzrDatasource.getInstance().fetch_dboy_of_kitchen,
        update_order_assign_dboy: FoodbzrDatasource.getInstance().update_order_assign_dboy,
        update_order_remove_dboy: FoodbzrDatasource.getInstance().update_order_remove_dboy,
    };

    /** data */
    private partner_row_uuid: string;
    public allOrders: IGetOrderStatus[] = [];
    public pending_arr: IGetOrderStatus[] = [];
    public cooking_arr: IGetOrderStatus[] = [];
    public onitsway_arr: IGetOrderStatus[] = [];
    public can_show_loading = true;

    /** daos */
    fetch_order_status_pending__: fetch_order_status;

    /** subscriptions */
    public networkSubscription: Subscription;

    constructor(private ngZone: NgZone, private modal: ModalController, private platform: Platform, private loading: LoadingScreenService) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
        this.daosLife = new DaoLife();
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
            this.fetch_order_status_pending__ = new this.database.fetch_order_status(daoConfig);
            this.fetch_order_status_pending__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.allOrders = val.sort((a, b) => +new Date(b.food_order_date_created) - +new Date(a.food_order_date_created));
                    this.sortOrders();
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_status_pending__.fetch(this.partner_row_uuid).obsData();
                });
            } else {
                this.fetch_order_status_pending__.fetch(this.partner_row_uuid).obsData();
            }
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    /** sort the orders */
    public sortOrders() {
        this.pending_arr = this.allOrders.filter((p) => p.food_order_delivery_status === 'placed');
        this.cooking_arr = this.allOrders.filter((p) => p.food_order_delivery_status === 'cooking');
        this.onitsway_arr = this.allOrders.filter((p) => p.food_order_delivery_status === 'on_way');
    }

    async changeOrderStatus(status: order_lifecycle_state, order_row_uuid: string) {
        /** update local */
        this.allOrders = this.allOrders.map((p) => {
            if (p.food_order_row_uuid === order_row_uuid) {
                if (status === 'order confirmed then cooking') {
                    return { ...p, food_order_delivery_status: 'cooking' };
                } else if (status === 'canceled') {
                    return { ...p, food_order_delivery_status: 'canceled' };
                }
            } else {
                return { ...p };
            }
        });

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_t_order_lifecycle_dao = new this.database.update_t_order_lifecycle(daoConfig);
            update_t_order_lifecycle_dao.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(async () => {
                (await update_t_order_lifecycle_dao.fetch(status, order_row_uuid)).obsData();
            });

            daoLife.softKill();
        });
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

    /** show the order details page */
    public async openOrderDetailPage(order: IGetOrderStatus) {
        const dailogRef = await this.modal.create({
            component: OrderDetailComponent,
            componentProps: { order },
        });

        await dailogRef.present();
    }

    pendingOrderTracker(index: number, value: IGetOrderStatus) {
        return value.food_order_row_uuid;
    }

    cookingOrderTracker(index: number, value: IGetOrderStatus) {
        return value.food_order_row_uuid;
    }

    onitsWayOrderTracker(index: number, value: IGetOrderStatus) {
        return value.food_order_row_uuid;
    }
}
