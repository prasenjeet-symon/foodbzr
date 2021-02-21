import { Component, Input, OnInit } from '@angular/core';
import { IGetOrder } from '@foodbzr/shared/types';

@Component({
    selector: 'foodbzr-canceled-order',
    templateUrl: './canceled-order.component.html',
    styleUrls: ['./canceled-order.component.scss'],
})
export class CanceledOrderComponent implements OnInit {
    @Input() order: IGetOrder;

    constructor() {}

    ngOnInit() {}
}
