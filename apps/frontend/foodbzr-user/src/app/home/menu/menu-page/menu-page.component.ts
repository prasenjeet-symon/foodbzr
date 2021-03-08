import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_menu_of_regional_food_cat, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetMenuForCart } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';
import { AddToCartComponent } from '../components/add-to-cart/add-to-cart.component';
import { CommentsComponent } from '../components/comments/comments.component';
import { MenuPicsComponent } from '../components/menu-pics/menu-pics.component';

@Component({
    selector: 'foodbzr-menu-page',
    templateUrl: './menu-page.component.html',
    styleUrls: ['./menu-page.component.scss'],
})
export class MenuPageComponent implements OnInit, OnDestroy {
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
    public can_show_empty_screen = false;

    /** daos */
    fetch_menu_of_regional_food_cat__: fetch_menu_of_regional_food_cat;

    /** subscription */
    public networkSubscription: any;

    constructor(
        private platform: Platform,
        private loading: LoadingScreenService,
        private modal: ModalController,
        private popOver: ModalController,
        private ngZone: NgZone,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((val) => {
            if (val.has('partner_row_uuid') && val.has('kitchen_row_uuid') && val.has('regional_food_category_row_uuid') && val.has('profile_picture')) {
                this.profile_picture = val.get('profile_picture');
                this.regional_food_category_row_uuid = val.get('regional_food_category_row_uuid');
                this.kitchen_row_uuid = val.get('kitchen_row_uuid');
                this.partner_row_uuid = val.get('partner_row_uuid');
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
    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_menu_of_regional_food_cat__ = new this.database.fetch_menu_of_regional_food_cat(daoConfig);
            this.fetch_menu_of_regional_food_cat__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.kitchenMenus = val;
                    if (this.kitchenMenus.length === 0) {
                        this.can_show_empty_screen = true;
                    }
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_menu_of_regional_food_cat__.fetch(this.kitchen_row_uuid, this.regional_food_category_row_uuid).obsData();
                });
            } else {
                this.fetch_menu_of_regional_food_cat__.fetch(this.kitchen_row_uuid, this.regional_food_category_row_uuid).obsData();
            }
        });
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
