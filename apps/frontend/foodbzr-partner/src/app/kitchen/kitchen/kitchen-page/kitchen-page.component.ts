import { Component, NgZone, OnInit } from '@angular/core';
import { IGetKitchen } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { CreateKitchenComponent } from '../components/create-kitchen/create-kitchen.component';
import { UpdateKitchenComponent } from '../components/update-kitchen/update-kitchen.component';
import { FoodbzrDatasource } from '@foodbzr/datasource';

@Component({
    selector: 'foodbzr-kitchen-page',
    templateUrl: './kitchen-page.component.html',
    styleUrls: ['./kitchen-page.component.scss'],
})
export class KitchenPageComponent implements OnInit {
    public partner_row_uuid: string;
    public database = {
        insert_kitchen: FoodbzrDatasource.getInstance().insert_kitchen,
        update_kitchen_offers: FoodbzrDatasource.getInstance().update_kitchen_offers,
        update_kitchen_login_detail: FoodbzrDatasource.getInstance().update_kitchen_login_detail,
        update_kitchen: FoodbzrDatasource.getInstance().update_kitchen,
        update_kitchen_address: FoodbzrDatasource.getInstance().update_kitchen_address
    };

    constructor(private modal: ModalController, private ngZone: NgZone) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
    }

    ngOnInit() {}

    /** Create new kitchen */
    async createKitchen() {
        this.ngZone.run(async () => {
            const modalRef = await this.modal.create({
                component: CreateKitchenComponent,
                componentProps: {
                    database: this.database,
                    partner_row_uuid: this.partner_row_uuid,
                },
                swipeToClose: true,
            });

            await modalRef.present();
        });
    }

    /** Update the kitchen */
    async updateKitchen(kitchen: IGetKitchen) {
        this.ngZone.run(async () => {
            const modalRef = await this.modal.create({
                component: UpdateKitchenComponent,
                swipeToClose: true,
                componentProps: {
                    partner_row_uuid: this.partner_row_uuid,
                    database: this.database,
                    kitchen,
                },
            });

            await modalRef.present();
        });
    }
}
