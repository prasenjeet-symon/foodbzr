import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OrderDoneComponent } from '../components/order-done/order-done.component';
import { insert_order_take_order, FoodbzrDatasource } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { IGetOrder } from '@foodbzr/shared/types';

@Component({
    selector: 'foodbzr-pay-mode-page',
    templateUrl: './pay-mode-page.component.html',
    styleUrls: ['./pay-mode-page.component.scss'],
})
export class PayModePageComponent implements OnInit {
    /** data */
    public selectedPayMode: 'COD' = 'COD';
    public isSelected: boolean;
    public kitchen_row_uuid: string;
    public delivery_address_row_uuid: string;
    public user_row_uuid: string;

    public database = {
        insert_order_take_order: FoodbzrDatasource.getInstance().insert_order_take_order,
    };

    constructor(private modal: ModalController, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private router: Router) {
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.activatedRoute.paramMap.subscribe((val) => {
                if (val.has('kitchen_row_uuid') && val.has('delivery_address_row_uuid')) {
                    this.delivery_address_row_uuid = val.get('delivery_address_row_uuid');
                    this.kitchen_row_uuid = val.get('kitchen_row_uuid');
                }
            });
        });
    }

    async orderDone(order: IGetOrder) {
        const dailogRef = await this.modal.create({
            component: OrderDoneComponent,
            swipeToClose: true,
            componentProps: {
                order: order,
            },
        });

        await dailogRef.present();

        dailogRef.onWillDismiss().then(() => {
            this.router.navigate(['tabs', 'tab2'], { replaceUrl: true });
        });
    }

    async makeNewOrder() {
        const daoLife = new DaoLife();

        const insert_order_take_order = new this.database.insert_order_take_order(daoConfig);
        insert_order_take_order.observe(daoLife).subscribe((val) => {
            if (val.length !== 0) {
                this.orderDone(val[0]);
            }
        });
        (await insert_order_take_order.fetch(this.user_row_uuid, this.kitchen_row_uuid, this.selectedPayMode, this.delivery_address_row_uuid)).obsData();
        daoLife.softKill();
    }
}
