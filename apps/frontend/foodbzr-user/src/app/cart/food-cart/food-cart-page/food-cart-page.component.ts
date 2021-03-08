import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetch_user_cart_for_checkout, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetUserCartGroupedKitchen } from '@foodbzr/shared/types';
import { ModalController, PickerController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';
import { CookingInstructionComponent } from '../components/cooking-instruction/cooking-instruction.component';

@Component({
    selector: 'foodbzr-food-cart-page',
    templateUrl: './food-cart-page.component.html',
    styleUrls: ['./food-cart-page.component.scss'],
})
export class FoodCartPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_user_cart_for_checkout: FoodbzrDatasource.getInstance().fetch_user_cart_for_checkout,
        update_user_cart: FoodbzrDatasource.getInstance().update_user_cart,
        update_user_cart_cooking_instruction: FoodbzrDatasource.getInstance().update_user_cart_cooking_instruction,
        delete_user_cart: FoodbzrDatasource.getInstance().delete_user_cart,
    };
    daosLife: DaoLife;

    /** data */
    private user_row_uuid: string;
    public allCheckoutItems: IGetUserCartGroupedKitchen[] = [];
    public can_show_empty_screen = false;

    /** daos */
    fetch_user_cart_for_checkout__: fetch_user_cart_for_checkout;

    /** subscriptions */
    public networkSubscription: any;

    constructor(
        private platform: Platform,
        private loadingScreen: LoadingScreenService,
        private ngZone: NgZone,
        private modal: ModalController,
        private picker: PickerController,
        private router: Router
    ) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
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
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        this.daosLife.softKill();
    }

    public initScreen(can_show_loading = true) {
        /**
         * Fetch the cart items
         */
        this.platform.ready().then(() => {
            this.fetch_user_cart_for_checkout__ = new this.database.fetch_user_cart_for_checkout(daoConfig);
            this.fetch_user_cart_for_checkout__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    this.allCheckoutItems = val;
                    if (this.allCheckoutItems.length === 0) {
                        this.can_show_empty_screen = true;
                    } else {
                        this.can_show_empty_screen = false;
                    }

                    if (this.loadingScreen.dailogRef.isConnected) {
                        this.loadingScreen.dailogRef.dismiss();
                    }
                });
            });

            if (can_show_loading) {
                this.loadingScreen.showLoadingScreen().then(() => {
                    this.fetch_user_cart_for_checkout__.fetch(this.user_row_uuid).obsData();
                });
            } else {
                this.fetch_user_cart_for_checkout__.fetch(this.user_row_uuid).obsData();
            }
        });
    }

    deleteItem(user_cart_row_uuid: string) {
        this.loadingScreen.showLoadingScreen().then(() => {
            const daoLife = new DaoLife();
            const delete_user_cart = new this.database.delete_user_cart(daoConfig);
            delete_user_cart.observe(daoLife).subscribe((val) => console.log('deleted the user cart item'));
            delete_user_cart.fetch(user_cart_row_uuid).obsData();
            daoLife.softKill();
        });
    }

    async updateInstruction(default_instruction: string, user_cart_row_uuid: string) {
        /** open the modal to update the instruction */
        const modalRef = await this.modal.create({
            component: CookingInstructionComponent,
            componentProps: {
                instruction: default_instruction,
            },
        });

        await modalRef.present();

        const { data } = await modalRef.onWillDismiss();
        const instruction = data;

        if (instruction) {
            this.loadingScreen.showLoadingScreen().then(() => {
                const daoLife = new DaoLife();
                const update_user_cart_cooking_instruction__ = new this.database.update_user_cart_cooking_instruction(daoConfig);
                update_user_cart_cooking_instruction__.observe(daoLife).subscribe((val) => console.log('updated the user cart item cokking instuction'));
                update_user_cart_cooking_instruction__.fetch(instruction, user_cart_row_uuid).obsData();
                daoLife.softKill();
            });
        }
    }

    async updateNumberOfitem(user_cart_row_uuid: string, menu_variant_min_order_amount: number, order_amount: number) {
        menu_variant_min_order_amount = menu_variant_min_order_amount ? menu_variant_min_order_amount : 1;
        order_amount = order_amount ? order_amount : 1;

        const possibleAmount = new Array(100)
            .fill(null)
            .map((p, i) => i)
            .map((p) => {
                return { text: `${p}`, value: p };
            })
            .slice(menu_variant_min_order_amount);

        /** open the scroller */
        const pickerRef = await this.picker.create({
            columns: [
                {
                    name: 'menu_items',
                    selectedIndex: order_amount - 1,
                    options: possibleAmount,
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Confirm',
                    handler: (value) => {
                        const menu_item = value.menu_items.value;
                        if (menu_item) {
                            this.loadingScreen.showLoadingScreen().then(() => {
                                const daoLife = new DaoLife();
                                const update_user_cart = new this.database.update_user_cart(daoConfig);
                                update_user_cart.observe(daoLife).subscribe((val) => console.log('updated the user cart cooking instruction'));
                                update_user_cart.fetch(menu_item, user_cart_row_uuid).obsData();
                                daoLife.softKill();
                            });
                        }
                    },
                },
            ],
        });

        await pickerRef.present();
    }

    /** checkout page */
    navAddressChoser(kitchen_row_uuid: string) {
        this.router.navigate(['tabs', 'tab2', 'address', kitchen_row_uuid]);
    }

    /** tracker */
    public tracker(index: number, value: IGetUserCartGroupedKitchen) {
        return `${value.orders[0].user_cart_row_uuid}`;
    }

    public orderTracker(index: number, value: any) {
        return value.user_cart_row_uuid;
    }
}
