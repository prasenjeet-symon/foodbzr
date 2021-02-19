import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource, fetch_menu_search, fetch_kitchen_search } from '@foodbzr/datasource';
import { IGetMenuSearchResult, IGetKitchenSearchResult } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
    public database = {
        fetch_menu_search: FoodbzrDatasource.getInstance().fetch_menu_search,
        fetch_kitchen_search: FoodbzrDatasource.getInstance().fetch_kitchen_search,
    };
    daosLife: DaoLife;

    /** data */
    menuResults: IGetMenuSearchResult[] = [];
    kitchenResult: IGetKitchenSearchResult[] = [];

    /** daos */
    public fetch_menu_search__: fetch_menu_search;
    public fetch_kitchen_search__: fetch_kitchen_search;

    constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        /** fetch the menu result */
        this.fetch_menu_search__ = new this.database.fetch_menu_search(daoConfig);
        this.fetch_menu_search__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.menuResults = val;
                console.log(this.menuResults, 'heeo');
            });
        });

        /** fetch the kitchen search result */
        this.fetch_kitchen_search__ = new this.database.fetch_kitchen_search(daoConfig);
        this.fetch_kitchen_search__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.kitchenResult = val;
                console.log(this.kitchenResult);
            });
        });
    }

    search(search_term: string) {
        if (search_term) {
            /** search the menu */
            this.fetch_kitchen_search__.fetch(`%${search_term}%`).obsData();
            this.fetch_menu_search__.fetch(`%${search_term}%`).obsData();
        }
    }
}
