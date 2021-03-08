import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { insert_menu_review } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-add-comment',
    templateUrl: './add-comment.component.html',
    styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit, OnDestroy {
    /** inputs */
    @Input() menu_row_uuid: string;

    public database: {
        insert_menu_review: databaseDao<insert_menu_review>;
    };

    /** data */
    public comment: string;
    public user_row_uuid: string;

    constructor(private modal: ModalController, private platform: Platform, private loading: LoadingScreenService) {
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
    }

    ngOnInit() {}

    ngOnDestroy() {}

    /** close the modal */
    public closeModal() {
        this.modal.dismiss();
    }

    /** add new comments */
    public addComment() {
        this.platform.ready().then(() => {
            if (!this.comment) {
                return;
            }

            const date_created = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const daoLife = new DaoLife();
            const insert_menu_review__ = new this.database.insert_menu_review(daoConfig);
            insert_menu_review__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
                this.closeModal();
            });

            this.loading.showLoadingScreen().then(() => {
                insert_menu_review__.fetch(this.menu_row_uuid, this.user_row_uuid, this.comment, date_created, uuid()).obsData();
            });

            daoLife.softKill();
        });
    }
}
