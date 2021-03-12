import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_kitchens_of_partner, fetch_kitchen_for_new_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetKitchen, IGetPartner } from '@foodbzr/shared/types';
import { is_pure_number } from '@foodbzr/shared/util';
import { Platform, PopoverController } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { combineLatest } from 'rxjs';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-update-commision',
    templateUrl: './update-commission.component.html',
    styleUrls: ['./update-commission.component.scss'],
})
export class UpdateCommisionComponent implements OnInit, OnDestroy {
    @Input() partner: IGetPartner;
    public daosLife: DaoLife;
    public database = {
        fetch_kitchen_for_new_partner: FoodbzrDatasource.getInstance().fetch_kitchen_for_new_partner,
        update_partner_permission: FoodbzrDatasource.getInstance().update_partner_permission,
        update_kitchen_partner_ref: FoodbzrDatasource.getInstance().update_kitchen_partner_ref,
        fetch_kitchens_of_partner: FoodbzrDatasource.getInstance().fetch_kitchens_of_partner,
        update_partner_commision: FoodbzrDatasource.getInstance().update_partner_commision,
    };

    /** data */
    public freeKitchens: IGetKitchen[] = [];
    public selectedKitchens: IGetKitchen[] = [];
    public commision: number;
    public canEditMenu = false;

    constructor(private popover: PopoverController, private loadingScreen: LoadingScreenService, private platform: Platform, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    /** daos */
    fetch_kitchen_for_new_partner__: fetch_kitchen_for_new_partner;
    fetch_kitchens_of_partner__: fetch_kitchens_of_partner;

    /** subscriptions */
    public networkSubs: any;
    public combineLatestSubs: any;

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubs) {
            this.networkSubs.unsubscribe();
        }
        if (this.combineLatestSubs) {
            this.combineLatestSubs.unsubscribe();
        }
    }

    ngOnInit() {
        this.commision = +this.partner.commission;
        this.daosLife.softKill();
        this.initScreen();
        this.networkSubs = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            /** fetch the partner kit */
            this.fetch_kitchens_of_partner__ = new this.database.fetch_kitchens_of_partner(daoConfig);
            this.fetch_kitchen_for_new_partner__ = new this.database.fetch_kitchen_for_new_partner(daoConfig);

            const combineLatest$$ = combineLatest([this.fetch_kitchens_of_partner__.observe(this.daosLife), this.fetch_kitchen_for_new_partner__.observe(this.daosLife)]);
            this.combineLatestSubs = combineLatest$$.subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loadingScreen.dailogRef.isConnected) {
                        this.loadingScreen.dailogRef.dismiss();
                    }

                    const kitchensOfPartners = val[0];
                    const freeKitchens = val[1];
                    this.freeKitchens = freeKitchens;
                    this.selectedKitchens = kitchensOfPartners;
                    const found = this.selectedKitchens.filter((p) => p.can_edit_partner === 'yes');
                    this.canEditMenu = found.length === this.selectedKitchens.length ? true : false;
                });
            });

            if (can_show_loading) {
                this.loadingScreen.showLoadingScreen().then(() => {
                    this.fetch_kitchen_for_new_partner__.fetch().obsData();
                    this.fetch_kitchens_of_partner__.fetch(this.partner.row_uuid, 'yes').obsData();
                });
            } else {
                this.fetch_kitchen_for_new_partner__.fetch().obsData();
                this.fetch_kitchens_of_partner__.fetch(this.partner.row_uuid, 'yes').obsData();
            }
        });
    }

    /** add commision of the partner */
    public updateCommision(commision: number) {
        if (!commision) {
            return;
        }

        if (!is_pure_number(commision)) {
            return;
        }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_partner_commision = new this.database.update_partner_commision(daoConfig);
            update_partner_commision.observe(daoLife).subscribe((val) => {
                if (this.loadingScreen.dailogRef.isConnected) {
                    this.loadingScreen.dailogRef.dismiss();
                }
            });

            this.loadingScreen.showLoadingScreen().then(() => {
                update_partner_commision.fetch(commision, this.partner.row_uuid).obsData();
            });

            daoLife.softKill();
        });
    }

    /** remove the kitchen from the partner */
    public removeKitchenFromPartner(kitchen: IGetKitchen) {
        if (!kitchen) {
            return;
        }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_kitchen_partner_ref = new this.database.update_kitchen_partner_ref(daoConfig);
            update_kitchen_partner_ref.observe(daoLife).subscribe((val) => {
                if (this.loadingScreen.dailogRef.isConnected) {
                    this.loadingScreen.dailogRef.dismiss();
                }
            });

            this.loadingScreen.showLoadingScreen().then(() => {
                update_kitchen_partner_ref.fetch(null, kitchen.can_edit_partner, [kitchen.row_uuid]).obsData();
            });

            daoLife.softKill();
        });
    }

    /** assing the kitchen to partner  */
    public addKitchenToPartner(kitchen: IGetKitchen) {
        if (!kitchen) {
            return;
        }

        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_kitchen_partner_ref = new this.database.update_kitchen_partner_ref(daoConfig);
            update_kitchen_partner_ref.observe(daoLife).subscribe((val) => {
                if (this.loadingScreen.dailogRef.isConnected) {
                    this.loadingScreen.dailogRef.dismiss();
                }
            });

            this.loadingScreen.showLoadingScreen().then(() => {
                update_kitchen_partner_ref.fetch(this.partner.row_uuid, kitchen.can_edit_partner, [kitchen.row_uuid]).obsData();
            });
            daoLife.softKill();
        });
    }

    /** update can edit menu */
    public updateCanEditMenu(checked: boolean) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_kitchen_partner_ref = new this.database.update_kitchen_partner_ref(daoConfig);
            update_kitchen_partner_ref.observe(daoLife).subscribe((val) => {
                if (this.loadingScreen.dailogRef.isConnected) {
                    this.loadingScreen.dailogRef.dismiss();
                }
            });

            this.loadingScreen.showLoadingScreen().then(() => {
                update_kitchen_partner_ref
                    .fetch(
                        this.partner.row_uuid,
                        checked ? 'yes' : 'no',
                        this.selectedKitchens.map((p) => p.row_uuid)
                    )
                    .obsData();
            });

            daoLife.softKill();
        });
    }

    /**  add partner update */
    public updateCanAddKitchen(checked: boolean) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_partner_permission__ = new this.database.update_partner_permission(daoConfig);
            update_partner_permission__.observe(daoLife).subscribe((val) => {
                if (this.loadingScreen.dailogRef.isConnected) {
                    this.loadingScreen.dailogRef.dismiss();
                }
            });

            this.loadingScreen.showLoadingScreen().then(() => {
                update_partner_permission__.fetch(checked ? 'yes' : 'no', this.partner.row_uuid).obsData();
            });

            daoLife.softKill();
        });
    }

    tracker(index: number, value: IGetKitchen) {
        return value.row_uuid;
    }
}
