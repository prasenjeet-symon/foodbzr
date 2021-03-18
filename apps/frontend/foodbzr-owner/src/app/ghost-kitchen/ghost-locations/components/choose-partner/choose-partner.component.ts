import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { databaseDao, IGetPartner } from '@foodbzr/shared/types';
import { DaoLife, daoConfig, NetworkManager } from '@sculify/node-room-client';
import { fetch_partner_for_owner, update_kitchen_location_partner } from '@foodbzr/datasource';
import { ModalController, Platform } from '@ionic/angular';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-choose-partner',
    templateUrl: './choose-partner.component.html',
    styleUrls: ['./choose-partner.component.scss'],
})
export class ChoosePartnerComponent implements OnInit, OnDestroy {
    @Input() database: {
        fetch_partner_for_owner: databaseDao<fetch_partner_for_owner>;
        update_kitchen_location_partner: databaseDao<update_kitchen_location_partner>;
    };
    @Input() kitchen_location_row_uuid: string;
    
    public daosLife: DaoLife;

    /** data */
    public allPartners: IGetPartner[] = [];
    public owner_row_uuid: string;

    /** daos */
    public fetch_partner_for_owner__: fetch_partner_for_owner;

    /**  networkSubs */
    public networkSubs: any;

    constructor(private platform: Platform, private loading: LoadingScreenService, private ngZone: NgZone, private modal: ModalController) {
        this.owner_row_uuid = localStorage.getItem('owner_row_uuid');
        this.daosLife = new DaoLife();
    }

    public closeModal(val: any) {
        this.modal.dismiss(val);
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubs) {
            this.networkSubs.unsubscribe();
        }
    }

    ngOnInit() {
        this.daosLife.softKill();
        this.initScreen();
        this.networkSubs = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    private initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_partner_for_owner__ = new this.database.fetch_partner_for_owner(daoConfig);
            this.fetch_partner_for_owner__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
                this.ngZone.run(() => {
                    this.allPartners = val;
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_partner_for_owner__.fetch(this.owner_row_uuid).obsData();
                });
            } else {
                this.fetch_partner_for_owner__.fetch(this.owner_row_uuid).obsData();
            }
        });
    }

    public tracker(index: number, value: IGetPartner) {
        return value.row_uuid;
    }

    /** choose the partner */
    public choosePartner(partner: IGetPartner) {
        this.platform.ready().then(() => {
            this.loading.showLoadingScreen().then((ref) => {
                const daoLife = new DaoLife();
                const update_kitchen_location_partner__ = new this.database.update_kitchen_location_partner(daoConfig);
                update_kitchen_location_partner__.observe(daoLife).subscribe((val) => {
                    if (ref.isConnected) {
                        ref.dismiss();
                    }
                    this.closeModal(null);
                    console.log('updated the partner associations');
                });
                update_kitchen_location_partner__.fetch(partner.row_uuid, this.kitchen_location_row_uuid).obsData();
                daoLife.softKill();
            });
        });
    }
}
