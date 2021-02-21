import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource, fetch_kitchen_supported_menus } from '@foodbzr/datasource';
import { IGetKitchenSearchResultMenu } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-found-kitchen-menu',
    templateUrl: './found-kitchen-menu-page.component.html',
    styleUrls: ['./found-kitchen-menu-page.component.scss'],
})
export class FoundKitchenMenuPageComponent implements OnInit {
    /** life */
    public daosLife: DaoLife;
    public database = {
        fetch_kitchen_supported_menus: FoodbzrDatasource.getInstance().fetch_kitchen_supported_menus,
    };

    /** data */
    public foundKitchens: IGetKitchenSearchResultMenu[] = [];
    public menu_name: string;

    /** daos */
    fetch_kitchen_supported_menus__: fetch_kitchen_supported_menus;

    constructor(private ngZone: NgZone, private activatedRoute: ActivatedRoute, private router: Router) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        /** fetch all the kitchens with given menus */
        this.fetch_kitchen_supported_menus__ = new this.database.fetch_kitchen_supported_menus(daoConfig);
        this.fetch_kitchen_supported_menus__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.foundKitchens = val;
            });
        });

        /** extract the param from the routes */
        this.activatedRoute.paramMap.subscribe((param) => {
            if (param.has('menu_name')) {
                this.menu_name = param.get('menu_name');
                this.fetch_kitchen_supported_menus__.fetch(`%${this.menu_name}%`).obsData();
            }
        });
    }

    /** nav to kitchen page */
    navKitchenPage(kitchen: IGetKitchenSearchResultMenu) {
        this.router.navigate(['tabs', 'tab1', 'kitchen', kitchen.row_uuid, kitchen.profile_picture, kitchen.partner_row_uuid, kitchen.kitchen_name]);
    }
}
