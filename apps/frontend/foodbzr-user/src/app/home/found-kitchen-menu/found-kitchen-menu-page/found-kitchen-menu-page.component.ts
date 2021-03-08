import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_kitchen_supported_menus, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetKitchenSearchResultMenu } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';

@Component({
    selector: 'foodbzr-found-kitchen-menu',
    templateUrl: './found-kitchen-menu-page.component.html',
    styleUrls: ['./found-kitchen-menu-page.component.scss'],
})
export class FoundKitchenMenuPageComponent implements OnInit, OnDestroy {
    public daosLife: DaoLife;
    public database = {
        fetch_kitchen_supported_menus: FoodbzrDatasource.getInstance().fetch_kitchen_supported_menus,
    };

    /** data */
    public foundKitchens: IGetKitchenSearchResultMenu[] = [];
    public menu_name: string;

    /** daos */
    fetch_kitchen_supported_menus__: fetch_kitchen_supported_menus;

    /** subscription */
    public networkSubscription: any;

    constructor(private platform: Platform, private loading: LoadingScreenService, private ngZone: NgZone, private activatedRoute: ActivatedRoute, private router: Router) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        /** extract the param from the routes */
        this.activatedRoute.paramMap.subscribe((param) => {
            if (param.has('menu_name')) {
                this.menu_name = param.get('menu_name');
                this.daosLife.softKill();
                this.initScreen();
                this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
                    if (val) {
                        this.daosLife.softKill();
                        this.initScreen(false);
                    }
                });
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
            /** fetch all the kitchens with given menus */
            this.fetch_kitchen_supported_menus__ = new this.database.fetch_kitchen_supported_menus(daoConfig);
            this.fetch_kitchen_supported_menus__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.foundKitchens = val;
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_kitchen_supported_menus__.fetch(`%${this.menu_name}%`).obsData();
                });
            } else {
                this.fetch_kitchen_supported_menus__.fetch(`%${this.menu_name}%`).obsData();
            }
        });
    }

    /** nav to kitchen page */
    navKitchenPage(kitchen: IGetKitchenSearchResultMenu) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab1', 'kitchen', kitchen.row_uuid, kitchen.profile_picture, kitchen.partner_row_uuid, kitchen.kitchen_name, kitchen.address]);
        });
    }
}
