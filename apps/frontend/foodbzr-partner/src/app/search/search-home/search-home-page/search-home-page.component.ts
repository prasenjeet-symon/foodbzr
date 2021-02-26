import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FoodbzrDatasource, fetch_order_search_partner } from '@foodbzr/datasource';
import { IGetOrderStatus } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';

@Component({
    selector: 'foodbzr-search-home-page',
    templateUrl: './search-home-page.component.html',
    styleUrls: ['./search-home-page.component.scss'],
})
export class SearchHomePageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_order_search_partner: FoodbzrDatasource.getInstance().fetch_order_search_partner,
    };
    public daosLife: DaoLife;

    /** data */
    public searchResult: IGetOrderStatus[] = [];
    public partner_row_uuid: string;

    /** daos */
    fetch_order_search_partner__: fetch_order_search_partner;

    constructor(private ngZone: NgZone, private modal: ModalController) {
        this.daosLife = new DaoLife();
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
    }

    ngOnInit() {
        this.fetch_order_search_partner__ = new this.database.fetch_order_search_partner(daoConfig);
        this.fetch_order_search_partner__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.searchResult = val;
            });
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }

    public search(value: string) {
        this.fetch_order_search_partner__.fetch(this.partner_row_uuid, value).obsData();
    }

    /** show order full details */
    public async showOrderFullDetail(order: IGetOrderStatus) {
        const dailogRef = await this.modal.create({
            component: OrderDetailComponent,
            componentProps: { order: order },
        });

        await dailogRef.present();
    }
}
