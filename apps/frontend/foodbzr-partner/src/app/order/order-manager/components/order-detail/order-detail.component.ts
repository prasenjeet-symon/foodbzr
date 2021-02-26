import { ModalController } from '@ionic/angular';
import { Component, Input } from '@angular/core';
import { IGetOrderStatus } from '@foodbzr/shared/types';

@Component({
    selector: 'foodbzr-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent  {
    @Input() order: IGetOrderStatus;

    constructor(private modal: ModalController) {}

    /** close modal */
    closeModal() {
        this.modal.dismiss();
    }
}
