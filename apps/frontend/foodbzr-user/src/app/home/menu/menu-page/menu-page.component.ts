import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_menu_of_regional_food_cat, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetMenuForCart } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { AddToCartComponent } from '../components/add-to-cart/add-to-cart.component';
import { CommentsComponent } from '../components/comments/comments.component';
import { MenuPicsComponent } from '../components/menu-pics/menu-pics.component';

@Component({
    selector: 'foodbzr-menu-page',
    templateUrl: './menu-page.component.html',
    styleUrls: ['./menu-page.component.scss'],
})
export class MenuPageComponent implements OnInit {
    private daosLife: DaoLife;
    public database = {
        fetch_menu_of_regional_food_cat: FoodbzrDatasource.getInstance().fetch_menu_of_regional_food_cat,
        fetch_menu_size_variant_for_cart: FoodbzrDatasource.getInstance().fetch_menu_size_variant_for_cart,
        insert_user_cart: FoodbzrDatasource.getInstance().insert_user_cart,
        fetch_menu_picture_of_menu: FoodbzrDatasource.getInstance().fetch_menu_picture_of_menu,
        fetch_menu_reviews_of_menu: FoodbzrDatasource.getInstance().fetch_menu_reviews_of_menu,
        insert_menu_review: FoodbzrDatasource.getInstance().insert_menu_review,
        update_menu_review: FoodbzrDatasource.getInstance().update_menu_review,
        delete_menu_review: FoodbzrDatasource.getInstance().delete_menu_review,
    };

    /** data */
    public user_row_uuid: string;
    public partner_row_uuid: string;
    public kitchen_row_uuid: string;
    public profile_picture: string;
    public regional_food_category_row_uuid: string;
    public kitchenMenus: IGetMenuForCart[] = [];

    /** daos */
    fetch_menu_of_regional_food_cat__: fetch_menu_of_regional_food_cat;

    constructor(private modal: ModalController, private popOver: ModalController, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private router: Router) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.activatedRoute.paramMap.subscribe((val) => {
                if (val.has('partner_row_uuid') && val.has('kitchen_row_uuid') && val.has('regional_food_category_row_uuid') && val.has('profile_picture')) {
                    this.profile_picture = val.get('profile_picture');
                    this.regional_food_category_row_uuid = val.get('regional_food_category_row_uuid');
                    this.kitchen_row_uuid = val.get('kitchen_row_uuid');
                    this.partner_row_uuid = val.get('partner_row_uuid');

                    this.fetchMenus();
                }
            });
        });
    }

    async addToCart(menu: IGetMenuForCart) {
        this.ngZone.run(async () => {
            const popoverRef = await this.popOver.create({
                component: AddToCartComponent,
                componentProps: { menu, database: this.database, user_row_uuid: this.user_row_uuid },
            });

            popoverRef.present();
        });
    }

    /** fetch all the menus of the kitchen */
    fetchMenus() {
        this.fetch_menu_of_regional_food_cat__ = new this.database.fetch_menu_of_regional_food_cat(daoConfig);
        this.fetch_menu_of_regional_food_cat__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.kitchenMenus = val;
                console.log(this.kitchenMenus);
            });
        });

        setTimeout(() => {
            this.fetch_menu_of_regional_food_cat__.fetch(this.kitchen_row_uuid, this.regional_food_category_row_uuid).obsData();
        }, 100);
    }

    /** show the menus picture */
    public async showMenuPics(menu: IGetMenuForCart) {
        const dailogRef = await this.modal.create({
            component: MenuPicsComponent,
            componentProps: {
                database: this.database,
                menu_row_uuid: menu.menu_row_uuid,
            },
        });

        await dailogRef.present();
    }

    /** show the commnets */
    public async showComments(menu: IGetMenuForCart) {
        const dailogRef = await this.modal.create({
            component: CommentsComponent,
            componentProps: {
                database: this.database,
                menu_row_uuid: menu.menu_row_uuid,
            },
        });

        await dailogRef.present();
    }

    /** tracker */
    public tracker(index: number, value: IGetMenuForCart) {
        return value.menu_row_uuid;
    }
}
