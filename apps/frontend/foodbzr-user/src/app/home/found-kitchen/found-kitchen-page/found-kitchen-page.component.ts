import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource, fetch_kitchen_in_range, fetch_menu_trending } from '@foodbzr/datasource';
import { IGetKitchen, IGetMenuTrending } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { AskLocationComponent } from '../components/ask-location/ask-location.component';

@Component({
    selector: 'foodbzr-found-kitchen-page',
    templateUrl: './found-kitchen-page.component.html',
    styleUrls: ['./found-kitchen-page.component.scss'],
})
export class FoundKitchenPageComponent implements OnInit {
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

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private ngZone: NgZone, private modal: ModalController) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        
        /** fetch the found result in range */
        this.fetch_kitchen_in_range__ = new this.database.fetch_kitchen_in_range(daoConfig);
        this.fetch_kitchen_in_range__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.foundKitchens = val;
            });
        });

        /** fetch the trending menus */
        this.fetch_menu_trending__ = new this.database.fetch_menu_trending(daoConfig);
        this.fetch_menu_trending__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.trendingMenus = val;
            });
        });

        this.askLocation();
    }

    navKitchenPage(kitchen: IGetKitchen) {
        this.router.navigate(['kitchen', kitchen.row_uuid, kitchen.profile_picture, kitchen.partner_row_uuid, kitchen.kitchen_name], { relativeTo: this.activatedRoute });
    }

    navSearch() {
        this.router.navigate(['tabs', 'tab1', 'search']);
    }

    navToKitchenSearchPage(menu: IGetMenuTrending) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab1', 'found_kitchen_menu', menu.menu_name]);
        });
    }

    /** ask for the location */
    public async askLocation() {
        const prev_location = localStorage.getItem('lng');
        if (prev_location) {
            /** set the prev location */
            const street = localStorage.getItem('street') ? localStorage.getItem('street') : '';
            const city = localStorage.getItem('city') ? localStorage.getItem('city') : '';
            const state = localStorage.getItem('state') ? localStorage.getItem('state') : '';
            const pincode = localStorage.getItem('pincode') ? localStorage.getItem('pincode') : '';
            const country = localStorage.getItem('country') ? localStorage.getItem('country') : '';
            const lat = localStorage.getItem('lat') ? localStorage.getItem('lat') : '';
            const lng = localStorage.getItem('lng') ? localStorage.getItem('lng') : '';

            this.deliveryLocation = `${street}, ${city}, ${pincode}, ${state}, ${country}`;

            this.latitude = +lat;
            this.longitude = +lng;
            this.fetch_kitchen_in_range__.fetch(this.latitude, this.longitude).obsData();
            this.fetch_menu_trending__.fetch(this.latitude, this.longitude).obsData();
            return;
        }

        const dailogRef = await this.modal.create({
            component: AskLocationComponent,
        });

        await dailogRef.present();
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
