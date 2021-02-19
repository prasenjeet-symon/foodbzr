import { Component, NgZone, OnInit } from '@angular/core';
import { fetch_user_cart_for_checkout, FoodbzrDatasource, update_user_cart, update_user_cart_cooking_instruction, delete_user_cart } from '@foodbzr/datasource';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { IGetUserCartGroupedKitchen } from '@foodbzr/shared/types';
import { ModalController, PickerController } from '@ionic/angular';
import { CookingInstructionComponent } from '../components/cooking-instruction/cooking-instruction.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'foodbzr-food-cart-page',
    templateUrl: './food-cart-page.component.html',
    styleUrls: ['./food-cart-page.component.scss'],
})
export class FoodCartPageComponent implements OnInit {
    private user_row_uuid: string;

    /** database */
    public database = {
        fetch_user_cart_for_checkout: FoodbzrDatasource.getInstance().fetch_user_cart_for_checkout,
        update_user_cart: FoodbzrDatasource.getInstance().update_user_cart,
        update_user_cart_cooking_instruction: FoodbzrDatasource.getInstance().update_user_cart_cooking_instruction,
        delete_user_cart: FoodbzrDatasource.getInstance().delete_user_cart,
    };
    daosLife: DaoLife;

    /** data */
    allCheckoutItems: IGetUserCartGroupedKitchen[] = [];

    /** daos */
    fetch_user_cart_for_checkout__: fetch_user_cart_for_checkout;

    constructor(private ngZone: NgZone, private modal: ModalController, private picker: PickerController, private router: Router, private activatedRoute: ActivatedRoute) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
    }

    ngOnInit() {
        /** fetch the cart items */
        this.fetch_user_cart_for_checkout__ = new this.database.fetch_user_cart_for_checkout(daoConfig);
        this.fetch_user_cart_for_checkout__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allCheckoutItems = val;
            });
        });

        this.fetch_user_cart_for_checkout__.fetch(this.user_row_uuid).obsData();
    }

    deleteItem(user_cart_row_uuid: string) {
        const daoLife = new DaoLife();
        const delete_user_cart = new this.database.delete_user_cart(daoConfig);
        delete_user_cart.observe(daoLife).subscribe((val) => console.log('deleted the user cart item'));
        delete_user_cart.fetch(user_cart_row_uuid).obsData();
        daoLife.softKill();
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
            const daoLife = new DaoLife();
            const update_user_cart_cooking_instruction = new this.database.update_user_cart_cooking_instruction(daoConfig);
            update_user_cart_cooking_instruction.observe(daoLife).subscribe((val) => console.log('updated the user cart item cokking instuction'));
            update_user_cart_cooking_instruction.fetch(instruction, user_cart_row_uuid).obsData();
            daoLife.softKill();
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
                            const daoLife = new DaoLife();
                            const update_user_cart = new this.database.update_user_cart(daoConfig);
                            update_user_cart.observe(daoLife).subscribe((val) => console.log('updated the user cart cooking instruction'));
                            update_user_cart.fetch(menu_item, user_cart_row_uuid).obsData();
                            daoLife.softKill();
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
}
