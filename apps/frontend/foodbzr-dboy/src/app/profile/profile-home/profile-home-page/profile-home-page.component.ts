import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { IGetDBoy } from '@foodbzr/shared/types';
import { FoodbzrDatasource, fetch_dboy_single } from '@foodbzr/datasource';
import { DaoLife, daoConfig } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-profile-home-page',
    templateUrl: './profile-home-page.component.html',
    styleUrls: ['./profile-home-page.component.scss'],
})
export class ProfileHomePageComponent implements OnInit, OnDestroy {
    public daosLife: DaoLife;
    public database = {
        fetch_dboy_single: FoodbzrDatasource.getInstance().fetch_dboy_single,
    };

    /** data */
    public dboyDetails: IGetDBoy;
    public dboy_row_uuid: string;

    /** daos */
    fetch_dboy_single__: fetch_dboy_single;

    constructor(private ngZone: NgZone) {
        this.daosLife = new DaoLife();
        this.dboy_row_uuid = localStorage.getItem('dboy_row_uuid');
    }

    ngOnInit() {
        /** fetch the dboy profile info */
        this.fetch_dboy_single__ = new this.database.fetch_dboy_single(daoConfig);
        this.fetch_dboy_single__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                if (val.length !== 0) {
                    this.dboyDetails = val[0];
                }
            });
        });
        this.fetch_dboy_single__.fetch(this.dboy_row_uuid).obsData();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }
}
