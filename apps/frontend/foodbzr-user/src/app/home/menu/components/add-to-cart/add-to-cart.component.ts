import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IGetMenuForCart } from '@foodbzr/shared/types';
import { fetch_menu_size_variant_for_cart, insert_user_cart } from '@foodbzr/datasource';
import { databaseDao, IGetMenuVariantForCart } from '@foodbzr/shared/types';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

@Component({
    selector: 'foodbzr-add-to-cart',
    templateUrl: './add-to-cart.component.html',
    styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {
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

    /** daos */
    fetch_menu_size_variant_for_cart__: fetch_menu_size_variant_for_cart;

    constructor(private modal: ModalController, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.fetchMenuVariants();
    }

    closeModal() {
        this.modal.dismiss();
    }

    fetchMenuVariants() {
        this.fetch_menu_size_variant_for_cart__ = new this.database.fetch_menu_size_variant_for_cart(daoConfig);
        this.fetch_menu_size_variant_for_cart__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.menuSizeVariants = val;
                this.itemSelected(val[0]);
            });
        });

        setTimeout(() => {
            this.fetch_menu_size_variant_for_cart__.fetch(this.menu.menu_row_uuid).obsData();
        }, 50);
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
        const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

        const daoLife = new DaoLife();
        const insert_user_cart__ = new this.database.insert_user_cart(daoConfig);
        insert_user_cart__.observe(daoLife).subscribe((val) => console.log('inserted to the cart'));
        insert_user_cart__.fetch(this.user_row_uuid, this.selectedMenu.menu_variant_row_uuid, this.totalAmount, date_created, uuid()).obsData();
        daoLife.softKill();
        this.closeModal();
    }
}
