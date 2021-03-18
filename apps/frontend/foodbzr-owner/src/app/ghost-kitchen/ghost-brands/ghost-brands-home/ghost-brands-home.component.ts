import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FoodbzrDatasource, fetch_kitchen_ghost_brands } from '@foodbzr/datasource';
import { DaoLife, daoConfig, NetworkManager } from '@sculify/node-room-client';
import { IGetKitchen, is_active } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { LoadingScreenService } from '../../../loading-screen.service';
import { Router } from '@angular/router';

@Component({
    selector: 'foodbzr-ghost-brands-home',
    templateUrl: './ghost-brands-home.component.html',
    styleUrls: ['./ghost-brands-home.component.scss'],
})
export class GhostBrandsHomeComponent implements OnInit, OnDestroy {
    /** database */
    public database = {
        fetch_kitchen_ghost_brands: FoodbzrDatasource.getInstance().fetch_kitchen_ghost_brands,
    };
    public daosLife: DaoLife;

    /** data */
    public allGhostBrands: IGetKitchen[] = [];
    public isActiveStatus: is_active = 'yes';

    /** daos */
    fetch_kitchen_ghost_brands__: fetch_kitchen_ghost_brands;

    /** network subscriptions */
    public networkSubs: any;

    constructor(private router: Router, private ngZone: NgZone, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
    }

    initScreen(can_show_loading = true) {
        this.fetch_kitchen_ghost_brands__ = new this.database.fetch_kitchen_ghost_brands(daoConfig);
        this.fetch_kitchen_ghost_brands__.observe(this.daosLife).subscribe((val) => {
            if (this.loading.dailogRef.isConnected) {
                this.loading.dailogRef.dismiss();
            }

            this.ngZone.run(() => {
                this.allGhostBrands = val;
            });
        });

        if (can_show_loading) {
            this.loading.showLoadingScreen().then(() => {
                this.fetch_kitchen_ghost_brands__.fetch(this.isActiveStatus).obsData();
            });
        } else {
            this.fetch_kitchen_ghost_brands__.fetch(this.isActiveStatus).obsData();
        }
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

    /** active status changing */
    public changeActiveStatus(is_active: is_active) {
        this.isActiveStatus = is_active;
        this.loading.showLoadingScreen().then(() => {
            this.fetch_kitchen_ghost_brands__.fetch(this.isActiveStatus).obsData();
        });
    }

    /** tracker */
    tracker(index: number, value: IGetKitchen) {
        return value.row_uuid;
    }

    /** navigate to ghost brand locations */
    public nav_ghost_brand_location(kitchen: IGetKitchen) {
        this.ngZone.run(() => {
            this.router.navigate(['ghost_brand_locations', kitchen.row_uuid]);
        });
    }
}
