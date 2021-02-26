import { Component, NgZone, OnInit } from '@angular/core';
import { FoodbzrDatasource, fetch_delivery_address_of_user } from '@foodbzr/datasource';
import { IGetDeliveryAddress } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { SearchLocationComponent } from '../components/choose-location/choose-location.component';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'foodbzr-address-page',
    templateUrl: './address-page.component.html',
    styleUrls: ['./address-page.component.scss'],
})
export class AddressPageComponent implements OnInit {
    public database = {
        fetch_delivery_address_of_user: FoodbzrDatasource.getInstance().fetch_delivery_address_of_user,
        insert_delivery_address: FoodbzrDatasource.getInstance().insert_delivery_address,
    };

    daosLife: DaoLife;
    private user_row_uuid: string;
    private user_full_name: string;
    private mobile_number: string;

    /** daos */
    fetch_delivery_address_of_user__: fetch_delivery_address_of_user;

    /** data */
    public allAddress: IGetDeliveryAddress[] = [];
    public selectedAddress: IGetDeliveryAddress;
    public kitchen_row_uuid: string;

    constructor(private ngZone: NgZone, private modal: ModalController, private router: Router, private activatedRoute: ActivatedRoute) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
        this.user_full_name = localStorage.getItem('user_full_name');
        this.mobile_number = localStorage.getItem('mobile_number');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.activatedRoute.paramMap.subscribe((param) => {
                if (param.has('kitchen_row_uuid')) {
                    this.kitchen_row_uuid = param.get('kitchen_row_uuid');
                }
            });
        });

        /** fetch the user delivery address */
        this.fetch_delivery_address_of_user__ = new this.database.fetch_delivery_address_of_user(daoConfig);
        this.fetch_delivery_address_of_user__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allAddress = val.map((p) => {
                    return { ...p, is_selected: false };
                });
                if (val.length !== 0) {
                    this.addressSelected(this.allAddress[0]);
                }
            });
        });
        this.fetch_delivery_address_of_user__.fetch(this.user_row_uuid).obsData();
    }

    async chooseAddress() {
        const modalRef = await this.modal.create({
            component: SearchLocationComponent,
        });
        await modalRef.present();

        const { data } = await modalRef.onWillDismiss();
        console.log(data);
        if (data) {
            this.makeNewAddress(data.street, data.city, data.pincode, data.state, data.country, data.lat, data.lng);
        }
    }

    /** make new address */
    public makeNewAddress(street: string, city: string, pincode: string, state: string, country: string, latitude: number, longitude: number) {
        const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const daoLife = new DaoLife();
        const insert_delivery_address = new this.database.insert_delivery_address(daoConfig);
        insert_delivery_address.observe(daoLife).subscribe((val) => console.log('added new address'));
        insert_delivery_address.fetch(this.user_row_uuid, street, pincode, city, state, country, latitude, longitude, date_created, uuid()).obsData();
        daoLife.softKill();
    }

    addressSelected(address: IGetDeliveryAddress) {
        this.ngZone.run(() => {
            this.allAddress = this.allAddress.map((p) => {
                if (p.row_uuid === address.row_uuid) {
                    return { ...p, is_selected: true };
                } else {
                    return { ...p, is_selected: false };
                }
            });

            this.selectedAddress = address;
        });
    }

    tracker(index: number, value: IGetDeliveryAddress) {
        return value.row_uuid;
    }

    /** go to choose pay mode */
    goToPayMode() {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab2', 'pay_mode', this.kitchen_row_uuid, this.selectedAddress.row_uuid]);
        });
    }
}
