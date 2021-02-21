import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource, fetch_kitchen_in_range, fetch_menu_trending } from '@foodbzr/datasource';
import { IGetKitchen, IGetMenuTrending } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-found-kitchen-page',
    templateUrl: './found-kitchen-page.component.html',
    styleUrls: ['./found-kitchen-page.component.scss'],
})
export class FoundKitchenPageComponent implements OnInit {
    public database = {
        fetch_kitchen_in_range: FoodbzrDatasource.getInstance().fetch_kitchen_in_range,
        fetch_menu_trending: FoodbzrDatasource.getInstance().fetch_menu_trending,
    };
    daosLife: DaoLife;

    /** data */
    latitude: number = 12;
    longitude: number = 12;
    foundKitchens: IGetKitchen[] = [];
    trendingMenus: IGetMenuTrending[] = [];

    /** daos */
    fetch_menu_trending__: fetch_menu_trending;
    fetch_kitchen_in_range__: fetch_kitchen_in_range;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        /** fetch the found result in range */
        this.fetch_kitchen_in_range__ = new this.database.fetch_kitchen_in_range(daoConfig);
        this.fetch_kitchen_in_range__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.foundKitchens = val;
            });
        });
        this.fetch_kitchen_in_range__.fetch(this.latitude, this.longitude).obsData();

        /** fetch the trending menus */
        this.fetch_menu_trending__ = new this.database.fetch_menu_trending(daoConfig);
        this.fetch_menu_trending__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.trendingMenus = val;
            });
        });
        this.fetch_menu_trending__.fetch(this.latitude, this.longitude).obsData();
    }

    navKitchenPage(kitchen: IGetKitchen) {
        this.router.navigate(['kitchen', kitchen.row_uuid, kitchen.profile_picture, kitchen.partner_row_uuid, kitchen.kitchen_name], { relativeTo: this.activatedRoute });
    }

    navSearch() {
        this.router.navigate(['tabs', 'tab1', 'search']);
    }

    navToKitchenSearchPage(menu: IGetMenuTrending) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab1', 'found_kitchen_menu', menu.menu_name]);
        });
    }
}
