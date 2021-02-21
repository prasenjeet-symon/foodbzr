import { Component, Input, OnInit } from '@angular/core';
import { IGetOrder } from '@foodbzr/shared/types';

@Component({
    selector: 'foodbzr-delivered-order',
    templateUrl: './delivered-order.component.html',
    styleUrls: ['./delivered-order.component.scss'],
})
export class DeliveredOrderComponent implements OnInit {
    @Input() order: IGetOrder;

    constructor() {}

    ngOnInit() {}
}
