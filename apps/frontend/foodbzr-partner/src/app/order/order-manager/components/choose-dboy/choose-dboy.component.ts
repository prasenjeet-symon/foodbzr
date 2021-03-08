import { ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_dboy_of_kitchen, update_order_assign_dboy, update_order_remove_dboy } from '@foodbzr/datasource';
import { databaseDao, IGetDBoy } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { Subscription } from 'rxjs';
import { LoadingScreenService } from '../../../../loading-screen.service';

interface SIGetBoy extends IGetDBoy {
    is_selected: boolean;
}

@Component({
    selector: 'foodbzr-choose-dboy',
    templateUrl: './choose-dboy.component.html',
    styleUrls: ['./choose-dboy.component.scss'],
})
export class ChooseDboyComponent implements OnInit, OnDestroy {
    @Input() selected_dboy_row_uuid: string;
    @Input() kitchen_row_uuid: string;
    @Input() order_row_uuid: string;
    @Input() database: {
        fetch_dboy_of_kitchen: databaseDao<fetch_dboy_of_kitchen>;
        update_order_assign_dboy: databaseDao<update_order_assign_dboy>;
        update_order_remove_dboy: databaseDao<update_order_remove_dboy>;
    };

    daosLife: DaoLife;
    allDboys: SIGetBoy[] = [];

    fetch_dboy_of_kitchen__: fetch_dboy_of_kitchen;

    /** subscriptions */
    public networkSubscription: Subscription;

    constructor(private modal: ModalController, private ngZone: NgZone, private changeDetector: ChangeDetectorRef, private loading: LoadingScreenService, private platform: Platform) {
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

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_dboy_of_kitchen__ = new this.database.fetch_dboy_of_kitchen(daoConfig);
            this.fetch_dboy_of_kitchen__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.allDboys = val.map((p) => {
                        if (p.row_uuid === this.selected_dboy_row_uuid) {
                            return { ...p, is_selected: true };
                        } else {
                            return { ...p, is_selected: false };
                        }
                    });
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_dboy_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
                });
            } else {
                this.fetch_dboy_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
            }
        });
    }

    updateDboy(dboy: SIGetBoy) {
        if (dboy.is_selected) {
            this.allDboys = this.allDboys.map((p) => {
                return { ...p, is_selected: false };
            });

            /** remove the dboy from the order */
            this.platform.ready().then(() => {
                const daoLife = new DaoLife();
                const update_order_remove_dboy__ = new this.database.update_order_remove_dboy(daoConfig);
                update_order_remove_dboy__.observe(daoLife).subscribe((val) => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });

                this.loading.showLoadingScreen().then(() => {
                    update_order_remove_dboy__.fetch(this.order_row_uuid).obsData();
                });

                daoLife.softKill();
            });
        } else {
            this.allDboys = this.allDboys.map((p) => {
                if (p.row_uuid === dboy.row_uuid) {
                    return { ...p, is_selected: true };
                } else {
                    return { ...p, is_selected: false };
                }
            });

            this.platform.ready().then(() => {
                /** add the selection */
                const daoLife = new DaoLife();
                const update_order_assign_dboy__ = new this.database.update_order_assign_dboy(daoConfig);
                update_order_assign_dboy__.observe(daoLife).subscribe((val) => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });

                this.loading.showLoadingScreen().then(() => {
                    update_order_assign_dboy__.fetch(dboy.row_uuid, this.order_row_uuid).obsData();
                });

                daoLife.softKill();
            });
        }

        this.dismissModal();
    }

    dismissModal() {
        this.modal.dismiss();
    }

    tracker(index: number, value: SIGetBoy) {
        return value.row_uuid;
    }
}
