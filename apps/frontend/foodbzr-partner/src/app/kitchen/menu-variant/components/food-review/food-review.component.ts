import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FoodbzrDatasource, fetch_menu_reviews_of_menu } from '@foodbzr/datasource';
import { IGetMenuReview } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-food-review',
    templateUrl: './food-review.component.html',
    styleUrls: ['./food-review.component.scss'],
})
export class FoodReviewComponent implements OnInit {
    @Input() menu_row_uuid: string;
    @Input() partner_row_uuid: string;
    daosLife: DaoLife;
    public database = {
        fetch_menu_reviews_of_menu: FoodbzrDatasource.getInstance().fetch_menu_reviews_of_menu,
    };

    /** data */
    allReviews: IGetMenuReview[] = [];

    constructor(private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    /** daos */
    fetch_menu_reviews_of_menu__: fetch_menu_reviews_of_menu;

    ngOnInit() {
        /** fetch all reviews */
        this.fetch_menu_reviews_of_menu__ = new this.database.fetch_menu_reviews_of_menu(daoConfig);
        this.fetch_menu_reviews_of_menu__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allReviews = val;
            });
        });
        this.fetch_menu_reviews_of_menu__.fetch(this.menu_row_uuid).obsData();
    }

    /** list tracker */
    tracker(index: number, value: IGetMenuReview) {
        return value.row_uuid;
    }
}
