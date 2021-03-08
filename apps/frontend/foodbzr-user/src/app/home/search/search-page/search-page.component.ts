import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_kitchen_search, fetch_menu_search, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetKitchenSearchResult, IGetMenuSearchResult } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';

@Component({
    selector: 'foodbzr-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit, OnDestroy {
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
    public is_first_time_search = true;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private platform: Platform, private loading: LoadingScreenService, private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.is_first_time_search = true;
        this.initScreen();
        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            /** fetch the menu result */
            this.fetch_menu_search__ = new this.database.fetch_menu_search(daoConfig);
            this.fetch_menu_search__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    this.is_first_time_search = false;
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.menuResults = val;
                });
            });

            /** fetch the kitchen search result */
            this.fetch_kitchen_search__ = new this.database.fetch_kitchen_search(daoConfig);
            this.fetch_kitchen_search__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    this.is_first_time_search = false;
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.kitchenResult = val;
                });
            });
        });
    }

    search(search_term: string) {
        if (search_term || search_term !== '') {
            /** search the menu */
            this.platform.ready().then(() => {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_kitchen_search__.fetch(`%${search_term}%`).obsData();
                    this.fetch_menu_search__.fetch(`%${search_term}%`).obsData();
                });
            });
        }
    }

    /** nav to kitchen page */
    navKitchen(kitchen: IGetKitchenSearchResult) {
        this.router.navigate(['tabs', 'tab1', 'kitchen', kitchen.row_uuid, kitchen.profile_picture, kitchen.partner_row_uuid, kitchen.kitchen_name, kitchen.address]);
    }

    /** nav to kitchens with menus */
    public navKitchenMenu(menu: IGetMenuSearchResult) {
        this.router.navigate(['tabs', 'tab1', 'found_kitchen_menu', menu.name]);
    }
}
