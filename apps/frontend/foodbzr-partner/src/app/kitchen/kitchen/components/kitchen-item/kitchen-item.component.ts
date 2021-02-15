import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { IGetKitchen } from '@foodbzr/shared/types';
import { fetch_kitchens_of_partner, FoodbzrDatasource } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'foodbzr-kitchen-item',
    templateUrl: './kitchen-item.component.html',
    styleUrls: ['./kitchen-item.component.scss'],
})
export class KitchenItemComponent implements OnInit {
    @Output() edit_kitchen: EventEmitter<IGetKitchen> = new EventEmitter();

    private partner_row_uuid: string;
    public daosLife: DaoLife;
    public allKitchens: IGetKitchen[] = [];

    database = {
        fetch_kitchens_of_partner: FoodbzrDatasource.getInstance().fetch_kitchens_of_partner,
    };

    fetch_kitchens_of_partner__: fetch_kitchens_of_partner;

    constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        /**  fetch all the created kitchen of the partner */
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');

        if (this.partner_row_uuid) {
            this.fetch_kitchens_of_partner__ = new this.database.fetch_kitchens_of_partner(daoConfig);
            this.fetch_kitchens_of_partner__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    this.allKitchens = val;
                });
            });
            this.fetch_kitchens_of_partner__.fetch(this.partner_row_uuid, 'yes').obsData();
        }
    }

    trackerKitchen(index: number, value: IGetKitchen) {
        return value.row_uuid;
    }

    navToMenuPage(kitchen: IGetKitchen) {
        this.router.navigate(['kitchen-menu', kitchen.row_uuid, kitchen.profile_picture], { relativeTo: this.activatedRoute });
    }
}
