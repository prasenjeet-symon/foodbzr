import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddFoodCatComponent } from '../components/add-food-cat/add-food-cat.component';
import { fetch_food_category_of_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { IGetFoodCategory } from '@foodbzr/shared/types';
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

    constructor(private modal: ModalController, private ngZone: NgZone) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.fetch_food_category_of_partner__ = new this.database.fetch_food_category_of_partner(daoConfig);
        this.fetch_food_category_of_partner__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.foodCate = val;
            });
        });
        this.fetch_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }

    /**  */

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
        this.ngZone.run(() => {
            const daoLife = new DaoLife();
            const delete_food_category = new this.database.delete_food_category(daoConfig);
            delete_food_category.observe(daoLife).subscribe((val) => console.log('deleted the food cat'));
            delete_food_category.fetch('yes', foodCat.row_uuid).obsData();
            daoLife.softKill();
        });
    }

    /** inactive the food cat */
    public inActiveFoodCat(foodCat: IGetFoodCategory) {
        this.ngZone.run(() => {
            const daoLife = new DaoLife();
            const delete_food_category = new this.database.delete_food_category(daoConfig);
            delete_food_category.observe(daoLife).subscribe((val) => console.log('deleted the food cat'));
            delete_food_category.fetch('no', foodCat.row_uuid).obsData();
            daoLife.softKill();
        });
    }

    /** tracker */
    tracker(index: number, value: IGetFoodCategory) {
        return value.row_uuid;
    }
}
