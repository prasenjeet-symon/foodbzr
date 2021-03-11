import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_kitchens_of_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetKitchen } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-kitchen-item',
    templateUrl: './kitchen-item.component.html',
    styleUrls: ['./kitchen-item.component.scss'],
})
export class KitchenItemComponent implements OnInit, OnDestroy {
    @Output() edit_kitchen: EventEmitter<IGetKitchen> = new EventEmitter();

    private partner_row_uuid: string;
    public daosLife: DaoLife;
    public allKitchens: IGetKitchen[] = [];

    database = {
        fetch_kitchens_of_partner: FoodbzrDatasource.getInstance().fetch_kitchens_of_partner,
    };

    fetch_kitchens_of_partner__: fetch_kitchens_of_partner;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
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

    initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            /**  fetch all the created kitchen of the partner */
            this.partner_row_uuid = localStorage.getItem('partner_row_uuid');

            if (this.partner_row_uuid) {
                this.fetch_kitchens_of_partner__ = new this.database.fetch_kitchens_of_partner(daoConfig);
                this.fetch_kitchens_of_partner__.observe(this.daosLife).subscribe((val) => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.ngZone.run(() => {
                        this.allKitchens = val;
                        // set the local storage
                        this.allKitchens.forEach((kit) => {
                            localStorage.setItem(`${kit.row_uuid}_can_edit`, kit.can_edit_partner);
                        });
                    });
                });

                if (can_show_loading) {
                    this.loading.showLoadingScreen().then(() => {
                        this.fetch_kitchens_of_partner__.fetch(this.partner_row_uuid, 'yes').obsData();
                    });
                } else {
                    this.fetch_kitchens_of_partner__.fetch(this.partner_row_uuid, 'yes').obsData();
                }
            }
        });
    }

    trackerKitchen(index: number, value: IGetKitchen) {
        return value.row_uuid;
    }

    navToMenuPage(kitchen: IGetKitchen) {
        this.router.navigate(['kitchen-menu', kitchen.row_uuid, kitchen.profile_picture], { relativeTo: this.activatedRoute });
    }

    navToReportPage(kitchen: IGetKitchen) {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab2', 'kitchen-report', kitchen.row_uuid]);
        });
    }
}
