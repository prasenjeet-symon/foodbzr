import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_partner_for_owner, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetPartner } from '@foodbzr/shared/types';
import { Platform, PopoverController } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { Subject } from 'rxjs';
import { FcmService } from '../../../fcm.service';
import { ChoosePartnersComponent } from '../components/choose-partners/choose-partners.component';

@Component({
    selector: 'foodbzr-order-manager-page',
    styleUrls: ['./order-manager-page.component.scss'],
    templateUrl: './order-manager-page.component.html',
})
export class OrderManagerPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_partner_for_owner: FoodbzrDatasource.getInstance().fetch_partner_for_owner,
    };
    public daosLife: DaoLife;
    public owner_row_uuid: string;
    public allPartners: IGetPartner[] = [];
    public selectedPartners: IGetPartner[] = [];
    public visible_table = 'pending';

    /** daos */
    fetch_partner_for_owner__: fetch_partner_for_owner;

    /** subscription */
    public networkSubscription: any;
    public partnerSelected: Subject<IGetPartner[]>;

    constructor(private pop: PopoverController, private fcm: FcmService, private ngZone: NgZone, private platform: Platform, private detectChange: ChangeDetectorRef) {
        this.fcm.initPush();
        this.owner_row_uuid = localStorage.getItem('owner_row_uuid');
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
        if (this.partnerSelected) {
            this.partnerSelected.complete();
        }
        this.partnerSelected = new Subject();

        this.fetch_partner_for_owner__ = new this.database.fetch_partner_for_owner(daoConfig);
        this.fetch_partner_for_owner__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allPartners = val;

                if (localStorage.getItem('selected_partners')) {
                    const already_choosen = JSON.parse(localStorage.getItem('selected_partners'));
                    this.selectedPartners = already_choosen;
                } else {
                    this.selectedPartners = [val[0]];
                }
            });
        });

        this.fetch_partner_for_owner__.fetch(this.owner_row_uuid).obsData();
    }

    async segmentChanged(ev: any) {
        this.platform.ready().then(() => {
            this.ngZone.run(() => {
                this.visible_table = ev.detail.value;
            });
        });
    }

    /** choose the partners */
    public async choosePartner() {
        const dailogRef = await this.pop.create({
            component: ChoosePartnersComponent,
            componentProps: {
                selectedPartners: this.allPartners.filter((p) => this.selectedPartners.some((val) => val.row_uuid === p.row_uuid)),
                partners: this.allPartners,
            },
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();

        if (data) {
            const new_selected_partners: IGetPartner[] = data;
            localStorage.setItem('selected_partners', JSON.stringify(new_selected_partners));

            this.selectedPartners = data;
            this.partnerSelected.next(this.selectedPartners);
        }
    }
}
