import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoodbzrDatasource, fetch_partner_for_owner, update_partner_commision } from '@foodbzr/datasource';
import { IGetPartner, is_active } from '@foodbzr/shared/types';
import { PopoverController } from '@ionic/angular';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { UpdateCommisionComponent } from '../components/update-commission/update-commission.component';

@Component({
    selector: 'foodbzr-partner-manager-page',
    templateUrl: './partner-manager-page.component.html',
    styleUrls: ['./partner-manager-page.component.scss'],
})
export class PartnerManagerPageComponent implements OnInit, OnDestroy {
    public daosLife: DaoLife;
    public database = {
        fetch_partner_for_owner: FoodbzrDatasource.getInstance().fetch_partner_for_owner,
        update_partner_verification_status: FoodbzrDatasource.getInstance().update_partner_verification_status,
        delete_partner: FoodbzrDatasource.getInstance().delete_partner,
        update_partner_commision: FoodbzrDatasource.getInstance().update_partner_commision,
    };

    /** data */
    public owner_row_uuid: string;
    public allParters: IGetPartner[] = [];
    public verifiedPartners: IGetPartner[] = [];
    public unVerifiedPartners: IGetPartner[] = [];
    public rejectedPartners: IGetPartner[] = [];

    /** daos */
    fetch_partner_for_owner__: fetch_partner_for_owner;

    constructor(private ngZone: NgZone, private popover: PopoverController, private router: Router) {
        this.daosLife = new DaoLife();
        this.owner_row_uuid = localStorage.getItem('owner_row_uuid');
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }

    ngOnInit() {
        this.fetch_partner_for_owner__ = new this.database.fetch_partner_for_owner(daoConfig);
        this.fetch_partner_for_owner__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allParters = val;
                this.sortPartners();
            });
        });
        this.fetch_partner_for_owner__.fetch(this.owner_row_uuid).obsData();
    }

    public sortPartners() {
        this.rejectedPartners = this.allParters.filter((p) => p.is_active === 'no' && p.is_verified === 'no');
        this.verifiedPartners = this.allParters.filter((p) => p.is_active === 'yes' && p.is_verified === 'yes');
        this.unVerifiedPartners = this.allParters.filter((p) => p.is_active === 'yes' && p.is_verified === 'no');
    }

    /** update verification sttaus */
    public updateVerificationStatus(partner: IGetPartner, is_verified: is_active) {
        this.allParters = this.allParters.map((p) => {
            if (p.row_uuid === partner.row_uuid) {
                return { ...p, is_verified: is_verified };
            } else {
                return { ...p };
            }
        });
        this.sortPartners();
        const daoLife = new DaoLife();
        const update_partner_verification_status = new this.database.update_partner_verification_status(daoConfig);
        update_partner_verification_status.observe(daoLife).subscribe((val) => console.log('updated the status'));
        update_partner_verification_status.fetch(is_verified, partner.row_uuid).obsData();
        daoLife.softKill();
    }

    /** update verification sttaus */
    public unVerifyPartner(partner: IGetPartner) {
        this.allParters = this.allParters.map((p) => {
            if (p.row_uuid === partner.row_uuid) {
                return { ...p, is_verified: 'no', is_active: 'no' };
            } else {
                return { ...p };
            }
        });
        this.sortPartners();

        /** inactive = 'yes' */
        const daoLife = new DaoLife();

        const delete_partner = new this.database.delete_partner(daoConfig);
        delete_partner.observe(daoLife).subscribe((val) => console.log('updated the partner'));
        delete_partner.fetch('no', partner.row_uuid).obsData();

        /** unverify */
        const update_partner_verification_status = new this.database.update_partner_verification_status(daoConfig);
        update_partner_verification_status.observe(daoLife).subscribe((val) => console.log('updated the status'));
        update_partner_verification_status.fetch('no', partner.row_uuid).obsData();

        daoLife.softKill();
    }

    /** make the partner active */
    public makePartnerActive(partner: IGetPartner) {
        this.allParters = this.allParters.map((p) => {
            if (p.row_uuid === partner.row_uuid) {
                return { ...p, is_active: 'yes' };
            } else {
                return { ...p };
            }
        });
        this.sortPartners();

        const daoLife = new DaoLife();
        const delete_partner = new this.database.delete_partner(daoConfig);
        delete_partner.observe(daoLife).subscribe((val) => console.log('updated the partner'));
        delete_partner.fetch('yes', partner.row_uuid).obsData();
        daoLife.softKill();
    }

    /** update the partner comm */
    public async updatePartnerCom(partner: IGetPartner) {
        /** open the popover to update the commision */
        const popoverRef = await this.popover.create({
            component: UpdateCommisionComponent,
            componentProps: {
                prev_commision: partner.commission,
            },
            cssClass: 'popover_width',
        });

        await popoverRef.present();

        const { data } = await popoverRef.onWillDismiss();

        if (data) {
            const commission = +data;

            /** update the commission */

            this.allParters = this.allParters.map((p) => {
                if (p.row_uuid === partner.row_uuid) {
                    return { ...p, commission: commission };
                } else {
                    return { ...p };
                }
            });

            const daoLife = new DaoLife();
            const update_partner_commision = new this.database.update_partner_commision(daoConfig);
            update_partner_commision.observe(daoLife).subscribe((val) => console.log('updated the partner commision'));
            update_partner_commision.fetch(commission, partner.row_uuid).obsData();
            daoLife.softKill();
        }
    }

    /** nav to report */
    navToReport(partner: IGetPartner) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs','tab1','report-partner', partner.row_uuid, partner.commission]);
        });
    }

    /** trackers */
    tracker(index: number, value: IGetPartner) {
        return value.row_uuid;
    }
}