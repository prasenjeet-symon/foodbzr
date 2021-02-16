import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'foodbzr-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
    public menu_found = new Array(10).fill(null);
    public kitchens_found = new Array(10).fill(null);

    constructor() {}

    ngOnInit() {}
}
