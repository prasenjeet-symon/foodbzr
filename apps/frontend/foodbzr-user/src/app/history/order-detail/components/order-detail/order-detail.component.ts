import { Component, Input } from '@angular/core';
import { IGetOrderStatus } from '@foodbzr/shared/types';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent {
    @Input() order: IGetOrderStatus;

    constructor(private modal: ModalController, private call: CallNumber) {}

    callDBoy(number: string) {
        this.call.callNumber(number, true);
    }
}
