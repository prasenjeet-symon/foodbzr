import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_menu_reviews_of_menu, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetMenuReview, is_active } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-food-review',
    templateUrl: './food-review.component.html',
    styleUrls: ['./food-review.component.scss'],
})
export class FoodReviewComponent implements OnInit, OnDestroy {
    @Input() menu_row_uuid: string;
    @Input() partner_row_uuid: string;
    daosLife: DaoLife;
    public database = {
        fetch_menu_reviews_of_menu: FoodbzrDatasource.getInstance().fetch_menu_reviews_of_menu,
    };

    @Input() can_edit_kitchen: is_active;
    /** data */
    allReviews: IGetMenuReview[] = [];

    constructor(private ngZone: NgZone, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
    }

    /** daos */
    fetch_menu_reviews_of_menu__: fetch_menu_reviews_of_menu;

    /** subscriptions */
    public networkSubscription: any;

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
            if (can_show_loading) {
                this.loading.showLoadingScreen().then((ref) => {
                    /** fetch all reviews */
                    this.fetch_menu_reviews_of_menu__ = new this.database.fetch_menu_reviews_of_menu(daoConfig);
                    this.fetch_menu_reviews_of_menu__.observe(this.daosLife).subscribe((val) => {
                        if (ref.isConnected) {
                            ref.dismiss();
                        }

                        this.ngZone.run(() => {
                            this.allReviews = val;
                        });
                    });

                    this.fetch_menu_reviews_of_menu__.fetch(this.menu_row_uuid).obsData();
                });
            } else {
                /** fetch all reviews */
                this.fetch_menu_reviews_of_menu__ = new this.database.fetch_menu_reviews_of_menu(daoConfig);
                this.fetch_menu_reviews_of_menu__.observe(this.daosLife).subscribe((val) => {
                    this.ngZone.run(() => {
                        this.allReviews = val;
                    });
                });

                this.fetch_menu_reviews_of_menu__.fetch(this.menu_row_uuid).obsData();
            }
        });
    }

    /** list tracker */
    tracker(index: number, value: IGetMenuReview) {
        return value.row_uuid;
    }
}
