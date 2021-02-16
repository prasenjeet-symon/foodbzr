import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-add-to-cart',
    templateUrl: './add-to-cart.component.html',
    styleUrls: ['./add-to-cart.component.scss'],
})
export class AddToCartComponent implements OnInit {
    menu_variants = new Array(15).fill(null);

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    closeModal() {
        this.modal.dismiss();
    }
}
