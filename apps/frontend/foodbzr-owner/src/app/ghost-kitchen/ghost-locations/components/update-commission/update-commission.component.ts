import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { update_kitchen_location_commission } from '@foodbzr/datasource';
import { databaseDao } from '@foodbzr/shared/types';
import { Platform, PopoverController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-update-commission',
    templateUrl: './update-commission.component.html',
    styleUrls: ['./update-commission.component.scss'],
})
export class UpdateCommissionComponent implements OnInit, OnDestroy {
    @Input() database: {
        update_kitchen_location_commission: databaseDao<update_kitchen_location_commission>;
    };
    @Input() kitchen_location_row_uuid: string;
    @Input() commission: number;

    constructor(private popover: PopoverController, private platform: Platform, private loading: LoadingScreenService, private ngZone: NgZone) {}

    /** close th emodal */
    public closeModal() {
        this.popover.dismiss();
    }

    ngOnDestroy() {}

    ngOnInit() {
        console.log(this.commission, 'jkoi');
    }

    /** update the commission */
    public updateCommission(commission: number) {
        if (!commission) {
            return;
        }

        this.platform.ready().then(() => {
            this.loading.showLoadingScreen().then(() => {
                const daoLife = new DaoLife();
                const update_kitchen_location_commission__ = new this.database.update_kitchen_location_commission(daoConfig);
                update_kitchen_location_commission__.observe(daoLife).subscribe((val) => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                    console.log('inserted the commission');
                    this.closeModal();
                });
                update_kitchen_location_commission__.fetch(commission, this.kitchen_location_row_uuid).obsData();
                daoLife.softKill();
            });
        });
    }
}
