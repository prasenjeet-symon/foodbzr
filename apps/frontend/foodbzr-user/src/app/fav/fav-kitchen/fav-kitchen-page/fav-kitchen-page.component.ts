import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetch_user_fav_kitchen, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetUserFavKitchen } from '@foodbzr/shared/types';
import { DaoLife, daoConfig } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-fav-kitchen-page',
    templateUrl: './fav-kitchen-page.component.html',
    styleUrls: ['./fav-kitchen-page.component.scss'],
})
export class FavKitchenPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_user_fav_kitchen: FoodbzrDatasource.getInstance().fetch_user_fav_kitchen,
        delete_user_fav_kitchen: FoodbzrDatasource.getInstance().delete_user_fav_kitchen,
    };
    public daosLife: DaoLife;

    /** data */
    public user_row_uuid: string;
    public favKitchens: IGetUserFavKitchen[] = [];

    /** daos */
    fetch_user_fav_kitchen__: fetch_user_fav_kitchen;

    constructor(private ngZone: NgZone, private router: Router) {
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.fetch_user_fav_kitchen__ = new this.database.fetch_user_fav_kitchen(daoConfig);
        this.fetch_user_fav_kitchen__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.favKitchens = val;
            });
        });
        this.fetch_user_fav_kitchen__.fetch(this.user_row_uuid).obsData();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }

    /** remove from the fav */
    public removeFromFav(item: IGetUserFavKitchen) {
        const daoLife = new DaoLife();
        const delete_user_fav_kitchen__ = new this.database.delete_user_fav_kitchen(daoConfig);
        delete_user_fav_kitchen__.observe(daoLife).subscribe((val) => console.log('deleted from  the list'));
        delete_user_fav_kitchen__.fetch(item.row_uuid).obsData();
        daoLife.softKill();
    }

    /** nav to kitchen page */
    public navToKitchenPage(item: IGetUserFavKitchen) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab1', 'kitchen', item.kitchen_row_uuid, item.profile_picture, item.partner_row_uuid, item.kitchen_name]);
        });
    }

    /** tracker */
    public tracker(index: number, value: IGetUserFavKitchen) {
        return `${value.user_row_uuid}${value.kitchen_row_uuid}`;
    }
}
