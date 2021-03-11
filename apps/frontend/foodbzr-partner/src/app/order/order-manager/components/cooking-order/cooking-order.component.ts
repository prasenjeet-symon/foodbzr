import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_order_status, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrderStatus, order_lifecycle_state } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { Subscription } from 'rxjs';
import { LoadingScreenService } from '../../../../loading-screen.service';
import { ChooseDboyComponent } from '../choose-dboy/choose-dboy.component';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
    selector: 'foodbzr-cooking-order',
    templateUrl: './cooking-order.component.html',
    styleUrls: ['./cooking-order.component.scss'],
})
export class CookingOrderComponent implements OnInit, OnDestroy {
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
    public cooking_arr: IGetOrderStatus[] = [];

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
                    this.cooking_arr = val.sort((a, b) => +new Date(b.food_order_date_created) - +new Date(a.food_order_date_created));
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_status_pending__.fetch('cooking', [this.partner_row_uuid]).obsData();
                });
            } else {
                this.fetch_order_status_pending__.fetch('cooking', [this.partner_row_uuid]).obsData();
            }
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    async changeOrderStatus(status: order_lifecycle_state, order_row_uuid: string) {
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

    cookingOrderTracker(index: number, value: IGetOrderStatus) {
        return value.food_order_row_uuid;
    }
}
