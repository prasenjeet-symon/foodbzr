import { Component, NgZone, OnInit } from '@angular/core';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetKitchen } from '@foodbzr/shared/types';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { LoadingScreenService } from '../../../loading-screen.service';
import { CreateKitchenComponent } from '../components/create-kitchen/create-kitchen.component';
import { KitchenMoreMenuComponent } from '../components/kitchen-more-menu/kitchen-more-menu.component';
import { UpdateKitchenComponent } from '../components/update-kitchen/update-kitchen.component';

@Component({
    selector: 'foodbzr-kitchen-page',
    templateUrl: './kitchen-page.component.html',
    styleUrls: ['./kitchen-page.component.scss'],
})
export class KitchenPageComponent implements OnInit {
    public database = {
        insert_kitchen: FoodbzrDatasource.getInstance().insert_kitchen,
        update_kitchen_offers: FoodbzrDatasource.getInstance().update_kitchen_offers,
        update_kitchen_login_detail: FoodbzrDatasource.getInstance().update_kitchen_login_detail,
        update_kitchen: FoodbzrDatasource.getInstance().update_kitchen,
        update_kitchen_address: FoodbzrDatasource.getInstance().update_kitchen_address,
    };
    public partner_row_uuid: string;
    public areWeUsingGps = false;

    constructor(private modal: ModalController, private ngZone: NgZone, private popover: PopoverController, private platform: Platform, private loading: LoadingScreenService) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
    }

    ngOnInit() {}

    /** show kitchen more menu */
    public async showMoreMenu(ev: any) {
        const popoverRef = await this.popover.create({
            component: KitchenMoreMenuComponent,
            event: ev,
        });

        await popoverRef.present();
    }

    /** Create new kitchen */
    async createKitchen() {
        this.platform.ready().then(async () => {
            const modalRef = await this.modal.create({
                component: CreateKitchenComponent,
                swipeToClose: true,
                componentProps: {
                    database: this.database,
                    partner_row_uuid: this.partner_row_uuid,
                },
            });

            await modalRef.present();
        });
    }

    /** Update the kitchen */
    async updateKitchen(kitchen: IGetKitchen) {
        this.platform.ready().then(async () => {
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
