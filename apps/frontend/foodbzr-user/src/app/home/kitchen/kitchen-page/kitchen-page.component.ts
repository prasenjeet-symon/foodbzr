import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_regional_food_category_of_partner, fetch_user_fav_kitchen_is_fav, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetRegionalFoodCategory } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { LoadingScreenService } from '../../../loading-screen.service';

@Component({
    selector: 'foodbzr-kitchen-page',
    templateUrl: './kitchen-page.component.html',
    styleUrls: ['./kitchen-page.component.scss'],
})
export class KitchenPageComponent implements OnInit, OnDestroy {
    daosLife: DaoLife;
    public database = {
        fetch_regional_food_category_of_partner: FoodbzrDatasource.getInstance().fetch_regional_food_category_of_partner,
        fetch_user_fav_kitchen_is_fav: FoodbzrDatasource.getInstance().fetch_user_fav_kitchen_is_fav,
        delete_user_fav_kitchen: FoodbzrDatasource.getInstance().delete_user_fav_kitchen,
        insert_user_fav_kitchen: FoodbzrDatasource.getInstance().insert_user_fav_kitchen,
    };

    /** data */
    public kitchen_row_uuid: string;
    public profile_picture: string;
    public partner_row_uuid: string;
    public kitchen_name: string;
    public kitchen_address: string;
    public kitchen_reg_menus: IGetRegionalFoodCategory[] = [];
    public is_fav_kitchen: boolean;
    public user_row_uuid: string;
    public user_fav_kitchen_row_uuid: string;

    /** daos */
    fetch_regional_food_category_of_partner__: fetch_regional_food_category_of_partner;
    fetch_user_fav_kitchen_is_fav__: fetch_user_fav_kitchen_is_fav;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private loading: LoadingScreenService, private platform: Platform) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((param) => {
            if (param.has('kitchen_row_uuid') && param.has('profile_picture') && param.has('partner_row_uuid') && param.has('name') && param.has('address')) {
                this.kitchen_row_uuid = param.get('kitchen_row_uuid');
                this.partner_row_uuid = param.get('partner_row_uuid');
                this.profile_picture = param.get('profile_picture');
                this.kitchen_name = param.get('name');
                this.kitchen_address = param.get('address');

                this.daosLife.softKill();
                this.initScreen();
                this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
                    if (val) {
                        this.daosLife.softKill();
                        this.initScreen(false);
                    }
                });
            }
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            /** fetch the regional cat */
            this.fetch_regional_food_category_of_partner__ = new this.database.fetch_regional_food_category_of_partner(daoConfig);
            this.fetch_regional_food_category_of_partner__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.kitchen_reg_menus = val;
                });
            });

            /** is fav kitchen */
            this.fetch_user_fav_kitchen_is_fav__ = new this.database.fetch_user_fav_kitchen_is_fav(daoConfig);
            this.fetch_user_fav_kitchen_is_fav__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    if (val.length !== 0) {
                        this.user_fav_kitchen_row_uuid = val[0].row_uuid;
                    }

                    this.is_fav_kitchen = val.length === 0 ? false : true;
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_user_fav_kitchen_is_fav__.fetch(this.kitchen_row_uuid, this.user_row_uuid).obsData();
                    this.fetch_regional_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
                });
            } else {
                this.fetch_user_fav_kitchen_is_fav__.fetch(this.kitchen_row_uuid, this.user_row_uuid).obsData();
                this.fetch_regional_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
            }
        });
    }

    navToMenu(regionalFoodCat: IGetRegionalFoodCategory) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab1', 'kitchen_menus', this.kitchen_row_uuid, this.partner_row_uuid, regionalFoodCat.row_uuid, regionalFoodCat.profile_picture]);
        });
    }

    /** add to fav one */
    public addToFavKitchen() {
        this.loading.showLoadingScreen().then(() => {
            const date_created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const daoLife = new DaoLife();
            const insert_user_fav_kitchen = new this.database.insert_user_fav_kitchen(daoConfig);
            insert_user_fav_kitchen.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            insert_user_fav_kitchen.fetch(this.user_row_uuid, this.kitchen_row_uuid, date_created, uuid()).obsData();
            daoLife.softKill();
        });
    }

    /** remove from the fav */
    public removeFromFav() {
        this.loading.showLoadingScreen().then(() => {
            const daoLife = new DaoLife();
            const delete_user_fav_kitchen__ = new this.database.delete_user_fav_kitchen(daoConfig);
            delete_user_fav_kitchen__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            delete_user_fav_kitchen__.fetch(this.user_fav_kitchen_row_uuid).obsData();
            daoLife.softKill();
        });
    }
}
