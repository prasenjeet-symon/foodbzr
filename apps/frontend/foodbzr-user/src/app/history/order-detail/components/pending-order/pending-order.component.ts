import { Component, Input, OnInit } from '@angular/core';
import { IGetOrder } from '@foodbzr/shared/types';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
    selector: 'foodbzr-pending-order',
    templateUrl: './pending-order.component.html',
    styleUrls: ['./pending-order.component.scss'],
})
export class PendingOrderComponent implements OnInit {
    @Input() order: IGetOrder;

    constructor(private call: CallNumber) {}

    ngOnInit() {}

    callDBoy(number: string) {
        this.call.callNumber(number, true);
    }
}
