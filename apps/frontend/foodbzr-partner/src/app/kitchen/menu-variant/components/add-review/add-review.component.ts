import { Component, Input, OnInit } from '@angular/core';
import { insert_menu_review } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-add-review',
    templateUrl: './add-review.component.html',
    styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent implements OnInit {
    public database: {
        insert_menu_review: databaseDao<insert_menu_review>;
    };
    @Input() menu_row_uuid: string;
    @Input() partner_row_uuid: string;

    constructor() {}
    /** daos */
    insert_menu_review__: insert_menu_review;

    ngOnInit() {}

    /** add new review */
    addReview() {
        /** */
        //TODO: pending to add the insert from the kitchen owner
    }
}
