import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_food_category_of_partner, fetch_regional_food_category_of_partner, update_menu, update_menu_category, update_menu_offers } from '@foodbzr/datasource';
import { databaseDao, IGetFoodCategory, IGetMenu, IGetRegionalFoodCategory } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-update-menu',
    templateUrl: './update-menu.component.html',
    styleUrls: ['./update-menu.component.scss'],
})
export class UpdateMenuComponent implements OnInit, OnDestroy {
    @Input() database: {
        update_menu: databaseDao<update_menu>;
        fetch_regional_food_category_of_partner: databaseDao<fetch_regional_food_category_of_partner>;
        fetch_food_category_of_partner: databaseDao<fetch_food_category_of_partner>;
        update_menu_category: databaseDao<update_menu_category>;
        update_menu_offers: databaseDao<update_menu_offers>;
    };
    @Input() partner_row_uuid: string;
    @Input() menu: IGetMenu;
    can_show_save_button_main_detail = false;
    can_show_save_button_food_cat = false;
    can_show_save_button_food_offer = false;
    daosLife: DaoLife;

    /** datas */
    foodCategory: IGetFoodCategory[] = [];
    regionalFoodCategory: IGetRegionalFoodCategory[] = [];

    constructor(private modal: ModalController, private ngZone: NgZone, private platform: Platform, private loading: LoadingScreenService) {}

    /** choosen profile pic */
    profile_picture: string = 'https://i.ibb.co/SsFQzdp/ti8wzfbbvdspxo8dg1ci.jpg';

    /** menu main details */
    public menu_name: string;
    public menu_bio: string;

    /** food category */
    public food_category: IGetFoodCategory;
    public regional_food_category: IGetRegionalFoodCategory;

    /** offers details */
    offer_percentage: number;
    offer_start_date: string;
    offer_start_time: string;
    offer_end_date: string;
    offer_end_time: string;

    /** daos */
    fetch_regional_food_category_of_partner__: fetch_regional_food_category_of_partner;
    fetch_food_category_of_partner__: fetch_food_category_of_partner;

    /** subscriptions */
    public networkSubscription: any;

    ngOnInit() {
        this.initScreen();
        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    ngOnDestroy() {
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        this.daosLife.softKill();
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.profile_picture = this.menu.profile_picture;
            /** assign the default data */
            this.menu_name = this.menu.menu_name;
            this.menu_bio = this.menu.bio;

            /** offer data */
            this.offer_percentage = this.menu.offer_percentage;
            this.offer_start_date = moment(new Date(this.menu.offer_start_datetime)).toLocaleString();
            this.offer_start_time = moment(new Date(this.menu.offer_start_datetime)).toLocaleString();
            this.offer_end_date = moment(new Date(this.menu.offer_end_datetime)).toLocaleString();
            this.offer_end_time = moment(new Date(this.menu.offer_end_datetime)).toLocaleString();

            /** daos */
            this.fetch_food_category_of_partner__ = new this.database.fetch_food_category_of_partner(daoConfig);
            this.fetch_regional_food_category_of_partner__ = new this.database.fetch_regional_food_category_of_partner(daoConfig);

            const combinedLates$$ = combineLatest(this.fetch_food_category_of_partner__.observe(this.daosLife), this.fetch_regional_food_category_of_partner__.observe(this.daosLife));
            combinedLates$$.subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.foodCategory = val[0];
                    this.regionalFoodCategory = val[1];

                    /** set the default data */
                    this.food_category = this.foodCategory.find((val) => val.row_uuid === this.menu.food_category_row_uuid);
                    this.regional_food_category = this.regionalFoodCategory.find((val) => val.row_uuid === this.menu.regional_food_category_row_uuid);
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    /** fetch the initial result */
                    this.fetch_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
                    this.fetch_regional_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
                });
            } else {
                this.fetch_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
                this.fetch_regional_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
            }
        });
    }

    closeModal() {
        this.modal.dismiss();
    }

    /** updateMainDetails */
    updateMenuDetails() {
        if (!(this.menu_name && this.menu_bio)) {
            return;
        }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_menu__ = new this.database.update_menu(daoConfig);
            update_menu__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                update_menu__.fetch(this.menu.row_uuid, this.menu_name, this.menu_bio).obsData();
            });

            daoLife.softKill();
            this.can_show_save_button_main_detail = false;
        });
    }

    mainDetailFocused() {
        this.can_show_save_button_main_detail = true;
    }

    /** update food cat */
    updateFoodCat() {
        if (!(this.food_category && this.regional_food_category)) {
            return;
        }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_menu_category__ = new this.database.update_menu_category(daoConfig);
            update_menu_category__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                update_menu_category__.fetch(this.regional_food_category.row_uuid, this.food_category.row_uuid, this.menu.row_uuid).obsData();
            });

            daoLife.softKill();

            this.can_show_save_button_food_cat = false;
        });
    }

    foodCatFocused() {
        this.can_show_save_button_food_cat = true;
    }

    updateMenuOffer() {
        if (!(this.offer_percentage && this.offer_end_date && this.offer_end_time && this.offer_start_date && this.offer_start_time)) {
            return;
        }

        const offer_start_datetime = `${moment(new Date(this.offer_start_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_start_time)).format('HH:mm:ss')}`;
        const offer_end_datetime = `${moment(new Date(this.offer_end_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_end_time)).format('HH:mm:ss')}`;

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_menu_offers__ = new this.database.update_menu_offers(daoConfig);
            update_menu_offers__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            this.loading.showLoadingScreen().then(() => {
                update_menu_offers__.fetch(this.offer_percentage, offer_start_datetime, offer_end_datetime, this.menu.row_uuid).obsData();
            });
            daoLife.softKill();
        });

        this.can_show_save_button_food_offer = false;
    }

    foodOfferFocused() {
        this.can_show_save_button_food_offer = true;
    }
}
