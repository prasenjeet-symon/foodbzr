import { Component, Input, NgZone, OnInit } from '@angular/core';
import { fetch_dboy_of_kitchen, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetDBoy } from '@foodbzr/shared/types';
import { DaoLife, daoConfig } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-dboy-item',
    templateUrl: './dboy-item.component.html',
    styleUrls: ['./dboy-item.component.scss'],
})
export class DboyItemComponent implements OnInit {
    public database = {
        fetch_dboy_of_kitchen: FoodbzrDatasource.getInstance().fetch_dboy_of_kitchen,
        delete_dboy: FoodbzrDatasource.getInstance().delete_dboy,
        update_dboy_verify: FoodbzrDatasource.getInstance().update_dboy_verify,
    };

    @Input() kitchen_row_uuid: string;

    allDboys: IGetDBoy[] = [];
    daosLife: DaoLife;

    constructor(private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    /** daos */
    fetch_dboy_of_kitchen__: fetch_dboy_of_kitchen;

    ngOnInit() {
        this.fetch_dboy_of_kitchen__ = new this.database.fetch_dboy_of_kitchen(daoConfig);
        this.fetch_dboy_of_kitchen__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allDboys = val;
            });
        });
        this.fetch_dboy_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
    }

    /** verify the dboy */
    public verifyDboy(dboy: IGetDBoy) {
        const daoLife = new DaoLife();

        const update_dboy_verify__ = new this.database.update_dboy_verify(daoConfig);
        update_dboy_verify__.observe(daoLife).subscribe((val) => console.log('updated the verification status'));
        update_dboy_verify__.fetch(dboy.row_uuid, 'yes').obsData();

        daoLife.softKill();
    }

    public unverifyDboy(dboy: IGetDBoy) {
        const daoLife = new DaoLife();

        const update_dboy_verify__ = new this.database.update_dboy_verify(daoConfig);
        update_dboy_verify__.observe(daoLife).subscribe((val) => console.log('updated the verification status'));
        update_dboy_verify__.fetch(dboy.row_uuid, 'no').obsData();

        daoLife.softKill();
    }

    /** delete the dboy */
    public inActiveDboy(dboy: IGetDBoy) {
        const daoLife = new DaoLife();

        const delete_dboy__ = new this.database.delete_dboy(daoConfig);
        delete_dboy__.observe(daoLife).subscribe((val) => console.log('update the delete status'));
        delete_dboy__.fetch('no', dboy.row_uuid).obsData();

        daoLife.softKill();
    }

    public activateDboy(dboy: IGetDBoy) {
        const daoLife = new DaoLife();

        const delete_dboy__ = new this.database.delete_dboy(daoConfig);
        delete_dboy__.observe(daoLife).subscribe((val) => console.log('update the delete status'));
        delete_dboy__.fetch('yes', dboy.row_uuid).obsData();

        daoLife.softKill();
    }
}
