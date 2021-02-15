import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'foodbzr-kitchen-page',
    templateUrl: './kitchen-page.component.html',
    styleUrls: ['./kitchen-page.component.scss'],
})
export class KitchenPageComponent implements OnInit {

    reg_food = new Array(10).fill(null)

    constructor() {}

    ngOnInit() {}
}
