import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_food_category_of_partner, fetch_regional_food_category_of_partner, insert_menu } from '@foodbzr/datasource';
import { databaseDao, IGetFoodCategory, IGetRegionalFoodCategory } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-create-menu',
    templateUrl: './create-menu.component.html',
    styleUrls: ['./create-menu.component.scss'],
})
export class CreateMenuComponent implements OnInit, OnDestroy {
    @Input() database: {
        insert_menu: databaseDao<insert_menu>;
        fetch_regional_food_category_of_partner: databaseDao<fetch_regional_food_category_of_partner>;
        fetch_food_category_of_partner: databaseDao<fetch_food_category_of_partner>;
    };
    @Input() partner_row_uuid: string;
    @Input() kitchen_row_uuid: string;

    daosLife: DaoLife;

    /** datas */
    foodCategory: IGetFoodCategory[] = [];
    regionalFoodCategory: IGetRegionalFoodCategory[] = [];

    constructor(private modal: ModalController, private ngZone: NgZone, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
    }

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
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
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
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    /** fetch the initial result */
                    this.fetch_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
                    this.fetch_regional_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
                });
            } else {
                /** fetch the initial result */
                this.fetch_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
                this.fetch_regional_food_category_of_partner__.fetch(this.partner_row_uuid).obsData();
            }
        });
    }

    closeModal() {
        this.modal.dismiss();
    }

    createMenu() {
        if (!(this.menu_name && this.menu_bio && this.offer_end_date && this.offer_end_time && this.offer_start_date && this.offer_start_time && this.offer_percentage)) {
            return;
        }

        if (!(this.regional_food_category && this.food_category)) {
            return;
        }

        const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const offer_start_datetime = `${moment(new Date(this.offer_start_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_start_time)).format('HH:mm:ss')}`;
        const offer_end_datetime = `${moment(new Date(this.offer_end_date)).format('YYYY-MM-DD')} ${moment(new Date(this.offer_end_time)).format('HH:mm:ss')}`;

        this.platform.ready().then(() => {
            /** safe to create the menu */
            const daoLife = new DaoLife();

            const insert_menu__ = new this.database.insert_menu(daoConfig);
            insert_menu__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
                this.closeModal();
            });
            this.loading.showLoadingScreen().then(() => {
                insert_menu__
                    .fetch(
                        this.menu_name,
                        this.profile_picture,
                        this.menu_bio,
                        this.kitchen_row_uuid,
                        this.regional_food_category.row_uuid,
                        this.food_category.row_uuid,
                        this.offer_percentage,
                        offer_start_datetime,
                        offer_end_datetime,
                        date_created,
                        uuid()
                    )
                    .obsData();
            });
            daoLife.softKill();
        });
    }
}
