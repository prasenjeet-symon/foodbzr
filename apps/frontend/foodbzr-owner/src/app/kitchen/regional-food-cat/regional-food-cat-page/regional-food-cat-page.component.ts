import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_regional_food_category_of_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetRegionalFoodCategory } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { Subscription } from 'rxjs';
import { LoadingScreenService } from '../../../loading-screen.service';
import { AddFoodCatComponent } from '../components/add-food-cat/add-food-cat.component';
import { UpdateFoodCatComponent } from '../components/update-food-cat/update-food-cat.component';

@Component({
    selector: 'foodbzr-food-cart-page',
    templateUrl: './regional-food-cat-page.component.html',
    styleUrls: ['./regional-food-cat-page.component.scss'],
})
export class RegionalFoodCatPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_regional_food_category_of_partner: FoodbzrDatasource.getInstance().fetch_regional_food_category_of_partner,
        insert_regional_food_category: FoodbzrDatasource.getInstance().insert_regional_food_category,
        delete_regional_food_category: FoodbzrDatasource.getInstance().delete_regional_food_category,
        update_regional_food_category: FoodbzrDatasource.getInstance().update_regional_food_category,
    };
    public daosLife: DaoLife;

    /** data */
    public owner_row_uuid: string;
    public regionalFoodCats: IGetRegionalFoodCategory[] = [];

    /** daos */
    fetch_regional_food_category_of_partner__: fetch_regional_food_category_of_partner;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private modal: ModalController, private loading: LoadingScreenService, private platform: Platform) {
        this.owner_row_uuid = localStorage.getItem('owner_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.initScreen();
        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
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
            this.fetch_regional_food_category_of_partner__ = new this.database.fetch_regional_food_category_of_partner(daoConfig);
            this.fetch_regional_food_category_of_partner__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.regionalFoodCats = val;
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_regional_food_category_of_partner__.fetch(this.owner_row_uuid).obsData();
                });
            } else {
                this.fetch_regional_food_category_of_partner__.fetch(this.owner_row_uuid).obsData();
            }
        });
    }

    /** inactive the item */
    public inActiveFoodCat(foodC: IGetRegionalFoodCategory) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_regional_food_category__ = new this.database.delete_regional_food_category(daoConfig);
            delete_regional_food_category__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                delete_regional_food_category__.fetch('no', foodC.row_uuid).obsData();
            });

            daoLife.softKill();
        });
    }

    /** activate the food cat item */
    public activateFoodCat(foodC: IGetRegionalFoodCategory) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_regional_food_category__ = new this.database.delete_regional_food_category(daoConfig);
            delete_regional_food_category__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                delete_regional_food_category__.fetch('yes', foodC.row_uuid).obsData();
            });

            daoLife.softKill();
        });
    }

    /** add new regional food  category */
    public async addNewCat() {
        const dailogRef = await this.modal.create({
            component: AddFoodCatComponent,
            componentProps: {
                database: this.database,
                owner_row_uuid: this.owner_row_uuid,
            },
        });

        await dailogRef.present();
    }

    /** update regional food category */
    public async updateRegionalFoodCategory(foodC: IGetRegionalFoodCategory) {
        const dailogRef = await this.modal.create({
            component: UpdateFoodCatComponent,
            componentProps: {
                database: this.database,
                owner_row_uuid: this.owner_row_uuid,
                food_cat: foodC,
            },
        });

        await dailogRef.present();
    }

    /** tracker */
    public tracker(index: number, value: IGetRegionalFoodCategory) {
        return value.row_uuid;
    }
}
