import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_regional_food_category_of_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { IGetRegionalFoodCategory } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { UpdateFoodCatComponent } from '../components/update-food-cat/update-food-cat.component';
import { AddFoodCatComponent } from '../components/add-food-cat/add-food-cat.component';

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
    public partner_row_uuid: string;
    public regionalFoodCats: IGetRegionalFoodCategory[] = [];

    /** daos */
    fetch_regional_food_category_of_partner__: fetch_regional_food_category_of_partner;

    constructor(private ngZone: NgZone, private modal: ModalController) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
    }

    ngOnDestroy() {}

    ngOnInit() {
        this.fetch_regional_food_category_of_partner__ = new this.database.fetch_regional_food_category_of_partner(daoConfig);
        this.fetch_regional_food_category_of_partner__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.regionalFoodCats = val;
            });
        });
        this.fetch_regional_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
    }

    /** inactive the item */
    public inActiveFoodCat(foodC: IGetRegionalFoodCategory) {
        const daoLife = new DaoLife();
        const delete_regional_food_category__ = new this.database.delete_regional_food_category(daoConfig);
        delete_regional_food_category__.observe(daoLife).subscribe((val) => console.log('updatet the active status'));
        delete_regional_food_category__.fetch('no', foodC.row_uuid).obsData();
        daoLife.softKill();
    }

    /** activate the food cat item */
    public activateFoodCat(foodC: IGetRegionalFoodCategory) {
        const daoLife = new DaoLife();
        const delete_regional_food_category__ = new this.database.delete_regional_food_category(daoConfig);
        delete_regional_food_category__.observe(daoLife).subscribe((val) => console.log('updatet the active status'));
        delete_regional_food_category__.fetch('yes', foodC.row_uuid).obsData();
        daoLife.softKill();
    }

    /** add new regional food  category */
    public async addNewCat() {
        const dailogRef = await this.modal.create({
            component: AddFoodCatComponent,
            componentProps: {
                database: this.database,
                partner_row_uuid: this.partner_row_uuid,
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
                partner_row_uuid: this.partner_row_uuid,
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
