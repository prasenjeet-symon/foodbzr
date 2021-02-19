import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_regional_food_category_of_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetRegionalFoodCategory } from '@foodbzr/shared/types';
import { DaoLife, daoConfig } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-kitchen-page',
    templateUrl: './kitchen-page.component.html',
    styleUrls: ['./kitchen-page.component.scss'],
})
export class KitchenPageComponent implements OnInit {
    daosLife: DaoLife;

    public database = {
        fetch_regional_food_category_of_partner: FoodbzrDatasource.getInstance().fetch_regional_food_category_of_partner,
    };

    /** data */
    public kitchen_row_uuid: string;
    public profile_picture: string;
    public partner_row_uuid: string;
    public kitchen_name: string;
    public kitchen_reg_menus: IGetRegionalFoodCategory[] = [];

    /** daos */
    fetch_regional_food_category_of_partner__: fetch_regional_food_category_of_partner;

    constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.activatedRoute.paramMap.subscribe((param) => {
                if (param.has('kitchen_row_uuid') && param.has('profile_picture') && param.has('partner_row_uuid') && param.has('name')) {
                    this.kitchen_row_uuid = param.get('kitchen_row_uuid');
                    this.partner_row_uuid = param.get('partner_row_uuid');
                    this.profile_picture = param.get('profile_picture');
                    this.kitchen_name = param.get('name');
                    this.fetchRegionalFoodCat();
                }
            });
        });
    }

    fetchRegionalFoodCat() {
        /** fetch the regional cat */
        this.fetch_regional_food_category_of_partner__ = new this.database.fetch_regional_food_category_of_partner(daoConfig);
        this.fetch_regional_food_category_of_partner__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.kitchen_reg_menus = val;
            });
        });

        setTimeout(() => {
            this.fetch_regional_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
        }, 100);
    }

    navToMenu(regionalFoodCat: IGetRegionalFoodCategory) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab1', 'kitchen_menus', this.kitchen_row_uuid, this.partner_row_uuid, regionalFoodCat.row_uuid, regionalFoodCat.profile_picture]);
        });
    }
}
