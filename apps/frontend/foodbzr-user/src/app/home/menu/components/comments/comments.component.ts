import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { delete_menu_review, fetch_menu_reviews_of_menu, insert_menu_review, update_menu_review } from '@foodbzr/datasource';
import { databaseDao, IGetMenuReview } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { UpdateCommentComponent } from '../update-comment/update-comment.component';

@Component({
    selector: 'foodbzr-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy {
    @Input() menu_row_uuid: string;

    public database: {
        fetch_menu_reviews_of_menu: databaseDao<fetch_menu_reviews_of_menu>;
        insert_menu_review: databaseDao<insert_menu_review>;
        update_menu_review: databaseDao<update_menu_review>;
        delete_menu_review: databaseDao<delete_menu_review>;
    };

    public daosLife: DaoLife;

    /** data */
    public comments: IGetMenuReview[] = [];
    public visibleReviews: IGetMenuReview[] = [];
    public user_row_uuid: string;
    public option_value = 'all';

    /** daos */
    fetch_menu_reviews_of_menu__: fetch_menu_reviews_of_menu;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private modal: ModalController, private modal_1: ModalController, private platform: Platform, private loading: LoadingScreenService) {
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
        this.daosLife = new DaoLife();
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
            this.fetch_menu_reviews_of_menu__ = new this.database.fetch_menu_reviews_of_menu(daoConfig);
            this.fetch_menu_reviews_of_menu__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.comments = val;
                    this.changeCommnets(this.option_value);
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_menu_reviews_of_menu__.fetch(this.menu_row_uuid).obsData();
                });
            } else {
                this.fetch_menu_reviews_of_menu__.fetch(this.menu_row_uuid).obsData();
            }
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    /** tracker */
    public tracker(index: number, value: IGetMenuReview) {
        return value.row_uuid;
    }

    /** close the modal */
    closeModal() {
        this.modal.dismiss();
    }

    /** delete comment */
    public deleteComment(comment: IGetMenuReview) {
        this.platform.ready().then(() => {
            this.loading.showLoadingScreen().then(() => {
                const daoLife = new DaoLife();
                const delete_menu_review = new this.database.delete_menu_review(daoConfig);
                delete_menu_review.observe(daoLife).subscribe((val) => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });
                delete_menu_review.fetch('no', comment.row_uuid).obsData();
                daoLife.softKill();
            });
        });
    }

    /** comments options changing */
    public changeCommnets(value: any) {
        if (value === 'all') {
            this.visibleReviews = [...this.comments];
        } else {
            this.visibleReviews = this.comments.filter((p) => p.user_row_uuid === this.user_row_uuid);
        }
    }

    /** update comment */
    public async updateComment(comment: IGetMenuReview) {
        const dailogRef = await this.modal_1.create({
            component: UpdateCommentComponent,
            componentProps: {
                database: this.database,
                menu_review_row_uuid: comment.row_uuid,
                prev_comment: comment.review,
            },
        });

        await dailogRef.present();
    }

    /** create new comment */
    public async createNewCommnt() {
        const dailogRef = await this.modal_1.create({
            component: AddCommentComponent,
            componentProps: {
                database: this.database,
                menu_row_uuid: this.menu_row_uuid,
            },
        });

        await dailogRef.present();
    }
}
