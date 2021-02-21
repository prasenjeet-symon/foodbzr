import { Component, Input, OnInit } from '@angular/core';
import { IGetOrder } from '@foodbzr/shared/types';

@Component({
    selector: 'foodbzr-pending-order',
    templateUrl: './pending-order.component.html',
    styleUrls: ['./pending-order.component.scss'],
})
export class PendingOrderComponent implements OnInit {
    
    @Input() order: IGetOrder;

    constructor() {}

    ngOnInit() {}

}
