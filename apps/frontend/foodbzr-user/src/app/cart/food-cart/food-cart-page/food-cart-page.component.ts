import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'foodbzr-food-cart-page',
    templateUrl: './food-cart-page.component.html',
    styleUrls: ['./food-cart-page.component.scss'],
})
export class FoodCartPageComponent implements OnInit {

    menus_items = new Array(6).fill(null);
    
    constructor() {}

    ngOnInit() {}
}
