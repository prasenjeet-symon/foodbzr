import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_partner_single, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetKitchen, IGetPartner } from '@foodbzr/shared/types';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';
import { CreateKitchenComponent } from '../components/create-kitchen/create-kitchen.component';
import { KitchenMoreMenuComponent } from '../components/kitchen-more-menu/kitchen-more-menu.component';
import { UpdateKitchenComponent } from '../components/update-kitchen/update-kitchen.component';
import { daoConfig } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-kitchen-page',
    templateUrl: './kitchen-page.component.html',
    styleUrls: ['./kitchen-page.component.scss'],
})
export class KitchenPageComponent implements OnInit, OnDestroy {
    public database = {
        insert_kitchen: FoodbzrDatasource.getInstance().insert_kitchen,
        update_kitchen_offers: FoodbzrDatasource.getInstance().update_kitchen_offers,
        update_kitchen_login_detail: FoodbzrDatasource.getInstance().update_kitchen_login_detail,
        update_kitchen: FoodbzrDatasource.getInstance().update_kitchen,
        update_kitchen_address: FoodbzrDatasource.getInstance().update_kitchen_address,
        fetch_partner_single: FoodbzrDatasource.getInstance().fetch_partner_single,
    };
    public daosLife = new DaoLife();
    public partner_row_uuid: string;
    public partner: IGetPartner;
    fetch_partner_single__: fetch_partner_single;

    /** subscriptins */
    public networkSubs: any;

    constructor(private modal: ModalController, private ngZone: NgZone, private popover: PopoverController, private platform: Platform, private loading: LoadingScreenService) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.initScreen();
        this.networkSubs = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubs) {
            this.networkSubs.unsubscribe();
        }
    }

    /** init the scren */
    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_partner_single__ = new this.database.fetch_partner_single(daoConfig);
            this.fetch_partner_single__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (val.length !== 0) {
                        this.partner = val[0];
                    }
                });
            });
            this.fetch_partner_single__.fetch(this.partner_row_uuid).obsData();
        });
    }

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
