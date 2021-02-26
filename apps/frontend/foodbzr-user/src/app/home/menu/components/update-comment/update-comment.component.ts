import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { databaseDao } from '@foodbzr/shared/types';
import { update_menu_review } from '@foodbzr/datasource';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-update-comment',
    templateUrl: './update-comment.component.html',
    styleUrls: ['./update-comment.component.scss'],
})
export class UpdateCommentComponent implements OnInit, OnDestroy {
    /** inputs */
    @Input() menu_review_row_uuid: string;
    @Input() prev_comment: string;

    public database: {
        update_menu_review: databaseDao<update_menu_review>;
    };

    /** data */

    constructor(private modal: ModalController) {}

    ngOnInit() {}
    ngOnDestroy() {}

    /** close modal */
    public closeModal() {
        this.modal.dismiss();
    }

    /** update the comment */
    public updateComment() {
        if (!this.prev_comment) {
            return;
        }

        const daoLife = new DaoLife();
        const update_menu_review = new this.database.update_menu_review(daoConfig);
        update_menu_review.observe(daoLife).subscribe((val) => console.log('updated the comment'));
        update_menu_review.fetch(this.prev_comment, 2, 1, this.menu_review_row_uuid).obsData();
        daoLife.softKill();
    }
}
