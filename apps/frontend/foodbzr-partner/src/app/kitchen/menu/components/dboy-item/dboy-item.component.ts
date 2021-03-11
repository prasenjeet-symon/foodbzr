import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_dboy_of_kitchen, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetDBoy, is_active } from '@foodbzr/shared/types';
import { is_pure_number } from '@foodbzr/shared/util';
import { Platform, PopoverController } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';
import { InitDboyComponent } from '../init-dboy/init-dboy.component';

@Component({
    selector: 'foodbzr-dboy-item',
    templateUrl: './dboy-item.component.html',
    styleUrls: ['./dboy-item.component.scss'],
})
export class DboyItemComponent implements OnInit, OnDestroy {
    public database = {
        fetch_dboy_of_kitchen: FoodbzrDatasource.getInstance().fetch_dboy_of_kitchen,
        delete_dboy: FoodbzrDatasource.getInstance().delete_dboy,
        update_dboy_verify: FoodbzrDatasource.getInstance().update_dboy_verify,
        insert_dboy_from_partner: FoodbzrDatasource.getInstance().insert_dboy_from_partner,
    };
    @Input() kitchen_row_uuid: string;
    @Input() can_edit_kitchen: is_active;

    allDboys: IGetDBoy[] = [];
    daosLife: DaoLife;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private pop: PopoverController, private ngZone: NgZone, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
    }

    /** daos */
    fetch_dboy_of_kitchen__: fetch_dboy_of_kitchen;

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
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        this.daosLife.softKill();
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            if (can_show_loading) {
                this.loading.showLoadingScreen().then((ref) => {
                    this.fetch_dboy_of_kitchen__ = new this.database.fetch_dboy_of_kitchen(daoConfig);
                    this.fetch_dboy_of_kitchen__.observe(this.daosLife).subscribe((val) => {
                        if (ref.isConnected) {
                            ref.dismiss();
                        }

                        this.ngZone.run(() => {
                            this.allDboys = val;
                        });
                    });
                    this.fetch_dboy_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
                });
            } else {
                this.fetch_dboy_of_kitchen__ = new this.database.fetch_dboy_of_kitchen(daoConfig);
                this.fetch_dboy_of_kitchen__.observe(this.daosLife).subscribe((val) => {
                    this.ngZone.run(() => {
                        this.allDboys = val;
                    });
                });
                this.fetch_dboy_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
            }
        });
    }

    /** verify the dboy */
    public verifyDboy(dboy: IGetDBoy) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_dboy_verify__ = new this.database.update_dboy_verify(daoConfig);
            update_dboy_verify__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            this.loading.showLoadingScreen().then(() => {
                update_dboy_verify__.fetch(dboy.row_uuid, 'yes').obsData();
            });
            daoLife.softKill();
        });
    }

    public unverifyDboy(dboy: IGetDBoy) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const update_dboy_verify__ = new this.database.update_dboy_verify(daoConfig);
            update_dboy_verify__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            this.loading.showLoadingScreen().then(() => {
                update_dboy_verify__.fetch(dboy.row_uuid, 'no').obsData();
            });
            daoLife.softKill();
        });
    }

    /** delete the dboy */
    public inActiveDboy(dboy: IGetDBoy) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_dboy__ = new this.database.delete_dboy(daoConfig);
            delete_dboy__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                delete_dboy__.fetch('no', dboy.row_uuid).obsData();
            });

            daoLife.softKill();
        });
    }

    public activateDboy(dboy: IGetDBoy) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_dboy__ = new this.database.delete_dboy(daoConfig);
            delete_dboy__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            this.loading.showLoadingScreen().then(() => {
                delete_dboy__.fetch('yes', dboy.row_uuid).obsData();
            });
            daoLife.softKill();
        });
    }

    /** insert the dboy */
    public async initDboy() {
        this.platform.ready().then(async () => {
            const dailogRef = await this.pop.create({
                component: InitDboyComponent,
            });

            await dailogRef.present();

            const { data } = await dailogRef.onWillDismiss();

            if (data) {
                /** check the mobile number */
                if (!is_pure_number(data.mobile_number)) {
                    return;
                }

                if (data.mobile_number.toString().length !== 10) {
                    return;
                }

                const mobile_number = data.mobile_number;
                const full_name = data.full_name;

                const daoLife = new DaoLife();
                const insert_dboy_from_partner = new this.database.insert_dboy_from_partner(daoConfig);
                insert_dboy_from_partner.observe(daoLife).subscribe((val) => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });

                this.loading.showLoadingScreen().then(async () => {
                    (await insert_dboy_from_partner.fetch(mobile_number, this.kitchen_row_uuid, full_name)).obsData();
                });
            }
        });
    }
}
