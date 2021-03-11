import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_kitchens_of_owner, FoodbzrDatasource } from '@foodbzr/datasource';
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
    public daosLife: DaoLife;
    public database = {
        fetch_kitchens_of_owner: FoodbzrDatasource.getInstance().fetch_kitchens_of_owner,
    };

    /** data */
    private owner_row_uuid: string;
    public allKitchens: IGetKitchen[] = [];

    /** daos */
    fetch_kitchens_of_owner__: fetch_kitchens_of_owner;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
        this.owner_row_uuid = localStorage.getItem('owner_row_uuid');
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
            this.fetch_kitchens_of_owner__ = new this.database.fetch_kitchens_of_owner(daoConfig);
            this.fetch_kitchens_of_owner__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.allKitchens = val;
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_kitchens_of_owner__.fetch(this.owner_row_uuid, 'yes').obsData();
                });
            } else {
                this.fetch_kitchens_of_owner__.fetch(this.owner_row_uuid, 'yes').obsData();
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
            this.router.navigate(['tabs', 'tab3', 'kitchen-report', kitchen.row_uuid]);
        });
    }
}
