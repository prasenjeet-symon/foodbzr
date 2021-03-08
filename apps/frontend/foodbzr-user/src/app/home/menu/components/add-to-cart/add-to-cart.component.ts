import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_menu_size_variant_for_cart, insert_user_cart } from '@foodbzr/datasource';
import { databaseDao, IGetMenuForCart, IGetMenuVariantForCart } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-add-to-cart',
    templateUrl: './add-to-cart.component.html',
    styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit, OnDestroy {
    @Input() user_row_uuid: string;
    @Input() menu: IGetMenuForCart;
    @Input() database: {
        fetch_menu_size_variant_for_cart: databaseDao<fetch_menu_size_variant_for_cart>;
        insert_user_cart: databaseDao<insert_user_cart>;
    };
    daosLife: DaoLife;

    /** data */
    public totalPrice: number;
    public totalAmount: number;
    public selectedMenu: IGetMenuVariantForCart;
    public menuSizeVariants: IGetMenuVariantForCart[] = [];
    public can_show_empty_screen = false;

    /** daos */
    fetch_menu_size_variant_for_cart__: fetch_menu_size_variant_for_cart;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private loading: LoadingScreenService, private platform: Platform, private modal: ModalController, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.daosLife.softKill();
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

    closeModal() {
        this.modal.dismiss();
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_menu_size_variant_for_cart__ = new this.database.fetch_menu_size_variant_for_cart(daoConfig);
            this.fetch_menu_size_variant_for_cart__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    if (val.length === 0) {
                        this.can_show_empty_screen = true;
                    }

                    this.menuSizeVariants = val;

                    if (val.length !== 0) {
                        this.itemSelected(val[0]);
                    }
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_menu_size_variant_for_cart__.fetch(this.menu.menu_row_uuid).obsData();
                });
            } else {
                this.fetch_menu_size_variant_for_cart__.fetch(this.menu.menu_row_uuid).obsData();
            }
        });
    }

    itemSelected(item: IGetMenuVariantForCart) {
        this.selectedMenu = item;
        this.totalAmount = +this.selectedMenu.menu_variant_min_order_amount ? this.selectedMenu.menu_variant_min_order_amount : 1;
        this.menuSizeVariants = this.menuSizeVariants.map((p) => {
            if (p.menu_variant_row_uuid === item.menu_variant_row_uuid) {
                return { ...p, is_selected: true };
            } else {
                return { ...p, is_selected: false };
            }
        });
        this.calculatePrice();
    }

    decreaseAmount() {
        if (this.totalAmount - 1 >= +this.selectedMenu.menu_variant_min_order_amount) {
            this.totalAmount = this.totalAmount - 1;
            this.calculatePrice();
        }
    }

    increaseAmount() {
        this.totalAmount = this.totalAmount + 1;
        this.calculatePrice();
    }

    tracker(index: number, value: IGetMenuVariantForCart) {
        return value.menu_variant_row_uuid;
    }

    calculatePrice() {
        this.totalPrice = +(this.totalAmount * +this.selectedMenu.final_price).toFixed(2);
    }

    addToCart() {
        this.platform.ready().then(() => {
            this.loading.showLoadingScreen().then(() => {
                const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

                const daoLife = new DaoLife();
                const insert_user_cart__ = new this.database.insert_user_cart(daoConfig);
                insert_user_cart__.observe(daoLife).subscribe((val) => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });
                insert_user_cart__.fetch(this.user_row_uuid, this.selectedMenu.menu_variant_row_uuid, this.totalAmount, date_created, uuid()).obsData();
                daoLife.softKill();
                this.closeModal();
            });
        });
    }
}
