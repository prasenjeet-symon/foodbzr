import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AddToCartComponent } from '../components/add-to-cart/add-to-cart.component';

@Component({
    selector: 'foodbzr-menu-page',
    templateUrl: './menu-page.component.html',
    styleUrls: ['./menu-page.component.scss'],
})
export class MenuPageComponent implements OnInit {
    menus = new Array(40).fill(null);

    constructor(private popOver: ModalController, private ngZone: NgZone) {}

    ngOnInit() {}

    async addToCart(menu: any) {
        this.ngZone.run(async () => {
            const popoverRef = await this.popOver.create({
                component: AddToCartComponent,
            });

            popoverRef.present();
        });
    }
}
