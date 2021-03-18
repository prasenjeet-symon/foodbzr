import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodbzrDatasource, fetch_kitchen_location_of_kitchen } from '@foodbzr/datasource';
import { IGetKitchenLocation, is_active } from '@foodbzr/shared/types';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { DaoLife, daoConfig, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';
import { ChoosePartnerComponent } from '../components/choose-partner/choose-partner.component';
import { UpdateCommissionComponent } from '../components/update-commission/update-commission.component';

@Component({
    selector: 'foodbzr-ghost-locations-home',
    templateUrl: './ghost-locations-home.component.html',
    styleUrls: ['./ghost-locations-home.component.scss'],
})
export class GhostLocationsHomeComponent implements OnInit, OnDestroy {
    /** database */
    public database = {
        fetch_kitchen_location_of_kitchen: FoodbzrDatasource.getInstance().fetch_kitchen_location_of_kitchen,
        update_kitchen_location_partner: FoodbzrDatasource.getInstance().update_kitchen_location_partner,
        delete_kitchen_location_partner_relation: FoodbzrDatasource.getInstance().delete_kitchen_location_partner_relation,
        update_kitchen_location_commission: FoodbzrDatasource.getInstance().update_kitchen_location_commission,
        fetch_partner_for_owner: FoodbzrDatasource.getInstance().fetch_partner_for_owner,
    };
    public daosLife: DaoLife;

    /** networkSubs */
    public networkSubs: any;

    /** data */
    public kitchen_row_uuid: string;
    public allGhostLocations: IGetKitchenLocation[] = [];
    public isActiveStatus: is_active = 'yes';

    /** daos */
    fetch_kitchen_location_of_kitchen__: fetch_kitchen_location_of_kitchen;

    constructor(
        private popover: PopoverController,
        private modal: ModalController,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private platform: Platform,
        private ngZone: NgZone,
        private loading: LoadingScreenService
    ) {
        this.daosLife = new DaoLife();
    }

    ngOnDestroy() {
        if (this.networkSubs) {
            this.networkSubs.unsubscribe();
        }
        this.daosLife.softKill();
    }

    ngOnInit() {
        this.networkSubs = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });

        this.activatedRoute.paramMap.subscribe((param) => {
            if (param.has('kitchen_row_uuid')) {
                this.kitchen_row_uuid = param.get('kitchen_row_uuid');
                this.daosLife.softKill();
                this.initScreen();
            }
        });
    }

    private initScreen(can_show_loading = true) {
        this.fetch_kitchen_location_of_kitchen__ = new this.database.fetch_kitchen_location_of_kitchen(daoConfig);
        this.fetch_kitchen_location_of_kitchen__.observe(this.daosLife).subscribe((val) => {
            if (this.loading.dailogRef.isConnected) {
                this.loading.dailogRef.dismiss();
            }
            this.ngZone.run(() => {
                this.allGhostLocations = val;
            });
        });

        this.platform.ready().then(() => {
            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_kitchen_location_of_kitchen__.fetch(this.kitchen_row_uuid, this.isActiveStatus).obsData();
                });
            } else {
                this.fetch_kitchen_location_of_kitchen__.fetch(this.kitchen_row_uuid, this.isActiveStatus).obsData();
            }
        });
    }

    /** tracker */
    public tracker(index: number, value: IGetKitchenLocation) {
        return value.row_uuid;
    }

    public activeStatusChange() {
        this.platform.ready().then(() => {
            this.loading.showLoadingScreen().then(() => {
                this.fetch_kitchen_location_of_kitchen__.fetch(this.kitchen_row_uuid, this.isActiveStatus).obsData();
            });
        });
    }

    /** Choose the partner */
    public chooseNewPartner(kitchen_location_row_uuid: string) {
        this.platform.ready().then(async () => {
            const dailogRef = await this.modal.create({
                component: ChoosePartnerComponent,
                componentProps: {
                    database: this.database,
                    kitchen_location_row_uuid,
                },
            });
            await dailogRef.present();
        });
    }

    /** remove the partner assocoation */
    public removeThePartner(kitchen_location_row_uuid: string) {
        this.platform.ready().then(() => {
            this.loading.showLoadingScreen().then((ref) => {
                const daoLife = new DaoLife();
                const delete_kitchen_location_partner_relation__ = new this.database.delete_kitchen_location_partner_relation(daoConfig);
                delete_kitchen_location_partner_relation__.observe(daoLife).subscribe((val) => {
                    if (ref.isConnected) {
                        ref.dismiss();
                    }
                    console.log('deleted the association');
                });
                delete_kitchen_location_partner_relation__.fetch(kitchen_location_row_uuid).obsData();
                daoLife.softKill();
            });
        });
    }

    /** update the commision */
    public updateCommission(kitchen_location_row_uuid: string, commission: number) {
        this.platform.ready().then(async () => {
            const dailogRef = await this.popover.create({
                component: UpdateCommissionComponent,
                componentProps: {
                    database: this.database,
                    kitchen_location_row_uuid,
                    commission,
                },
            });

            await dailogRef.present();
        });
    }
}
