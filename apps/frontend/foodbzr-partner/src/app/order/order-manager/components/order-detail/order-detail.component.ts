import { Component, Input } from '@angular/core';
import { IGetOrderStatus } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
    selector: 'foodbzr-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent {
    @Input() order: IGetOrderStatus;

    constructor(private modal: ModalController, private callNumber: CallNumber) {}

    /** close modal */
    closeModal() {
        this.modal.dismiss();
    }

    public async callNumberNow(number: string) {
        this.callNumber.callNumber(number.toString(), true);
    }
}
