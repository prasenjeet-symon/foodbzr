import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderDoneComponent } from '../components/order-done/order-done.component';

@Component({
    selector: 'foodbzr-pay-mode-page',
    templateUrl: './pay-mode-page.component.html',
    styleUrls: ['./pay-mode-page.component.scss'],
})
export class PayModePageComponent implements OnInit {
    constructor(private modal: ModalController) {}

    ngOnInit() {
        this.orderDone()
    }

    async orderDone() {
        const dailogRef = await this.modal.create({
            component: OrderDoneComponent,
            swipeToClose: true,
        });

        dailogRef.present();
    }
}
