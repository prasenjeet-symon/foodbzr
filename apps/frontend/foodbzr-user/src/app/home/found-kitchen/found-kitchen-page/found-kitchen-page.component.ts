import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_kitchen_in_range, fetch_menu_trending, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetKitchen, IGetMenuTrending } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';
import { AskLocationComponent } from '../components/ask-location/ask-location.component';

@Component({
    selector: 'foodbzr-found-kitchen-page',
    templateUrl: './found-kitchen-page.component.html',
    styleUrls: ['./found-kitchen-page.component.scss'],
})
export class FoundKitchenPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_kitchen_in_range: FoodbzrDatasource.getInstance().fetch_kitchen_in_range,
        fetch_menu_trending: FoodbzrDatasource.getInstance().fetch_menu_trending,
    };
    daosLife: DaoLife;

    /** data */
    latitude: number = 12;
    longitude: number = 12;
    foundKitchens: IGetKitchen[] = [];
    trendingMenus: IGetMenuTrending[] = [];
    public deliveryLocation: string;

    /** daos */
    fetch_menu_trending__: fetch_menu_trending;
    fetch_kitchen_in_range__: fetch_kitchen_in_range;

    /** subscription */
    public networkSubscription: any;

    constructor(
        private loading: LoadingScreenService,
        private platform: Platform,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ngZone: NgZone,
        private modal: ModalController
    ) {
        this.daosLife = new DaoLife();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.initScreen();
        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            /** fetch the found result in range */
            this.fetch_kitchen_in_range__ = new this.database.fetch_kitchen_in_range(daoConfig);
            this.fetch_kitchen_in_range__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.foundKitchens = val;
                });
            });

            /** fetch the trending menus */
            this.fetch_menu_trending__ = new this.database.fetch_menu_trending(daoConfig);
            this.fetch_menu_trending__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.trendingMenus = val;
                });
            });

            this.askLocation(can_show_loading);
        });
    }

    navKitchenPage(kitchen: IGetKitchen) {
        this.router.navigate(['kitchen', kitchen.row_uuid, kitchen.profile_picture, kitchen.partner_row_uuid, kitchen.kitchen_name, kitchen.address], { relativeTo: this.activatedRoute });
    }

    navSearch() {
        this.router.navigate(['tabs', 'tab1', 'search']);
    }

    navToKitchenSearchPage(menu: IGetMenuTrending) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab1', 'found_kitchen_menu', menu.menu_name]);
        });
    }

    public setLocationLocal() {
        /** set the prev location */
        const street = localStorage.getItem('street') ? localStorage.getItem('street') : '';
        const city = localStorage.getItem('city') ? localStorage.getItem('city') : '';
        const state = localStorage.getItem('state') ? localStorage.getItem('state') : '';
        const pincode = localStorage.getItem('pincode') ? localStorage.getItem('pincode') : '';
        const country = localStorage.getItem('country') ? localStorage.getItem('country') : '';
        const lat = localStorage.getItem('lat') ? localStorage.getItem('lat') : '';
        const lng = localStorage.getItem('lng') ? localStorage.getItem('lng') : '';

        this.ngZone.run(() => {
            this.deliveryLocation = `${street}, ${city}, ${pincode}, ${state}, ${country}`;
        });

        this.latitude = +lat;
        this.longitude = +lng;
    }

    /** ask for the location */
    public async askLocation(can_show_loading = true) {
        const prev_location = localStorage.getItem('lng');
        if (prev_location) {
            this.setLocationLocal();

            this.loading.showLoadingScreen().then(() => {
                this.fetch_kitchen_in_range__.fetch(this.latitude, this.longitude).obsData();
                this.fetch_menu_trending__.fetch(this.latitude, this.longitude).obsData();
            });

            return;
        }

        const dailogRef = await this.modal.create({
            component: AskLocationComponent,
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();

        if (data) {
            this.setLocationLocal();
        }

        if (can_show_loading) {
            this.loading.showLoadingScreen().then(() => {
                this.fetch_kitchen_in_range__.fetch(this.latitude, this.longitude).obsData();
                this.fetch_menu_trending__.fetch(this.latitude, this.longitude).obsData();
            });
        } else {
            this.loading.showLoadingScreen().then(() => {
                this.fetch_kitchen_in_range__.fetch(this.latitude, this.longitude).obsData();
                this.fetch_menu_trending__.fetch(this.latitude, this.longitude).obsData();
            });
        }
    }

    /** change location */
    public async changeLocation() {
        const dailogRef = await this.modal.create({
            component: AskLocationComponent,
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();

        this.askLocation();
    }
}
