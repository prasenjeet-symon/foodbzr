import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_food_category_of_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetFoodCategory } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';
import { AddFoodCatComponent } from '../components/add-food-cat/add-food-cat.component';
import { UpdateFoodCatComponent } from '../components/update-food-cat/update-food-cat.component';

@Component({
    selector: 'foodbzr-food-cat-page',
    templateUrl: './food-cat-page.component.html',
    styleUrls: ['./food-cat-page.component.scss'],
})
export class FoodCatPageComponent implements OnInit, OnDestroy {
    public database = {
        insert_food_category: FoodbzrDatasource.getInstance().insert_food_category,
        update_food_category: FoodbzrDatasource.getInstance().update_food_category,
        delete_food_category: FoodbzrDatasource.getInstance().delete_food_category,
        fetch_food_category_of_partner: FoodbzrDatasource.getInstance().fetch_food_category_of_partner,
    };
    public daosLife: DaoLife;

    /** data */
    public partner_row_uuid: string;
    public foodCate: IGetFoodCategory[] = [];

    /** daos */
    fetch_food_category_of_partner__: fetch_food_category_of_partner;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private modal: ModalController, private ngZone: NgZone, private loading: LoadingScreenService, private platform: Platform) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
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
            this.fetch_food_category_of_partner__ = new this.database.fetch_food_category_of_partner(daoConfig);
            this.fetch_food_category_of_partner__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.foodCate = val;
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
                });
            } else {
                this.fetch_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
            }
        });
    }

    /** add new cat */
    public async addNewCat() {
        const dailofRef = await this.modal.create({
            component: AddFoodCatComponent,
            componentProps: {
                database: this.database,
                partner_row_uuid: this.partner_row_uuid,
            },
        });

        await dailofRef.present();
    }

    /** update the food category */
    public async updateFoodCat(food_cat: IGetFoodCategory) {
        const dailofRef = await this.modal.create({
            component: UpdateFoodCatComponent,
            componentProps: {
                database: this.database,
                partner_row_uuid: this.partner_row_uuid,
                food_cat: food_cat,
            },
        });

        await dailofRef.present();
    }

    /** activate the food cat */
    public ActiveFoodCat(foodCat: IGetFoodCategory) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_food_category = new this.database.delete_food_category(daoConfig);
            delete_food_category.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                delete_food_category.fetch('yes', foodCat.row_uuid).obsData();
            });

            daoLife.softKill();
        });
    }

    /** inactive the food cat */
    public inActiveFoodCat(foodCat: IGetFoodCategory) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_food_category = new this.database.delete_food_category(daoConfig);
            delete_food_category.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                delete_food_category.fetch('no', foodCat.row_uuid).obsData();
            });

            daoLife.softKill();
        });
    }

    /** tracker */
    tracker(index: number, value: IGetFoodCategory) {
        return value.row_uuid;
    }
}
