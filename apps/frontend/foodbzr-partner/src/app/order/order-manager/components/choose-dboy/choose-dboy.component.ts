import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { fetch_dboy_of_kitchen, update_order_assign_dboy, update_order_remove_dboy } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { IGetDBoy } from '@foodbzr/shared/types';
import { databaseDao } from '@foodbzr/shared/types';

interface SIGetBoy extends IGetDBoy {
    is_selected: boolean;
}

@Component({
    selector: 'foodbzr-choose-dboy',
    templateUrl: './choose-dboy.component.html',
    styleUrls: ['./choose-dboy.component.scss'],
})
export class ChooseDboyComponent implements OnInit {
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

    constructor(private modal: ModalController, private ngZone: NgZone, private changeDetector: ChangeDetectorRef) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.fetch_dboy_of_kitchen__ = new this.database.fetch_dboy_of_kitchen(daoConfig);
        this.fetch_dboy_of_kitchen__.observe(this.daosLife).subscribe((val) => {
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

        this.fetch_dboy_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
    }

    updateDboy(dboy: SIGetBoy) {
        this.ngZone.run(() => {
            if (dboy.is_selected) {
                this.allDboys = this.allDboys.map((p) => {
                    return { ...p, is_selected: false };
                });

                /** remove the dboy from the order */
                const daoLife = new DaoLife();
                const update_order_remove_dboy__ = new this.database.update_order_remove_dboy(daoConfig);
                update_order_remove_dboy__.observe(daoLife).subscribe((val) => {
                    console.log('removed the dboy from the order');
                });
                update_order_remove_dboy__.fetch(this.order_row_uuid).obsData();
                daoLife.softKill();
            } else {
                this.allDboys = this.allDboys.map((p) => {
                    if (p.row_uuid === dboy.row_uuid) {
                        return { ...p, is_selected: true };
                    } else {
                        return { ...p, is_selected: false };
                    }
                });
                /** add the selection */
                const daoLife = new DaoLife();
                const update_order_assign_dboy__ = new this.database.update_order_assign_dboy(daoConfig);
                update_order_assign_dboy__.observe(daoLife).subscribe((val) => {
                    console.log('added the dboy to the order');
                });
                update_order_assign_dboy__.fetch(dboy.row_uuid, this.order_row_uuid).obsData();
                daoLife.softKill();
            }
        });
    }

    dismissModal() {
        this.modal.dismiss();
    }

    tracker(index: number, value: SIGetBoy) {
        return value.row_uuid;
    }
}
