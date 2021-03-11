import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { fetch_delivery_address_of_user, fetch_user_single, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetDeliveryAddress, IGetUser } from '@foodbzr/shared/types';
import { addressFromForAddres } from '@foodbzr/shared/util';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { LoadingScreenService } from '../../../loading-screen.service';
import { SearchLocationComponent } from '../components/choose-location/choose-location.component';
const { Geolocation } = Plugins;

declare var google;

@Component({
    selector: 'foodbzr-address-page',
    templateUrl: './address-page.component.html',
    styleUrls: ['./address-page.component.scss'],
})
export class AddressPageComponent implements OnInit, OnDestroy {
    public database = {
        fetch_delivery_address_of_user: FoodbzrDatasource.getInstance().fetch_delivery_address_of_user,
        insert_delivery_address: FoodbzrDatasource.getInstance().insert_delivery_address,
        fetch_user_single: FoodbzrDatasource.getInstance().fetch_user_single,
    };
    public daosLife: DaoLife;

    /** daos */
    fetch_delivery_address_of_user__: fetch_delivery_address_of_user;
    fetch_user_single__: fetch_user_single;

    /** data */
    public allAddress: IGetDeliveryAddress[] = [];
    public selectedAddress: IGetDeliveryAddress;
    public userDetail: IGetUser;
    public kitchen_row_uuid: string;
    private user_row_uuid: string;
    private user_full_name: string;
    private mobile_number: string;
    public lat: number;
    public lng: number;
    public areWeUsingGps = false;

    /** subscriptions */
    public networkSubscription: any;
    public combineLatestSubs: any;

    constructor(
        private loadingScreen: LoadingScreenService,
        private platform: Platform,
        private toast: ToastController,
        private nativeGeocoder: NativeGeocoder,
        private ngZone: NgZone,
        private modal: ModalController,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.daosLife = new DaoLife();
        this.user_row_uuid = localStorage.getItem('user_row_uuid');
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        if (this.combineLatestSubs) {
            this.combineLatestSubs.unsubscribe();
        }
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((param) => {
            if (param.has('kitchen_row_uuid')) {
                this.kitchen_row_uuid = param.get('kitchen_row_uuid');
            }
        });

        this.daosLife.softKill();
        this.initScreen();
        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val && !this.areWeUsingGps) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            /** fetch the user delivery address */
            this.fetch_delivery_address_of_user__ = new this.database.fetch_delivery_address_of_user(daoConfig);
            this.fetch_user_single__ = new this.database.fetch_user_single(daoConfig);

            const combinedLatestObs$ = combineLatest([this.fetch_delivery_address_of_user__.observe(this.daosLife), this.fetch_user_single__.observe(this.daosLife)]);
            this.combineLatestSubs = combinedLatestObs$.subscribe((val) => {
                if (this.loadingScreen.dailogRef.isConnected) {
                    this.loadingScreen.dailogRef.dismiss();
                }

                /** address */
                const address = val[0];
                if (!this.selectedAddress) {
                    this.allAddress = address.map((p) => {
                        return { ...p, is_selected: false };
                    });

                    /** choose the first list */
                    if (address.length !== 0) {
                        this.addressSelected(this.allAddress[0]);
                    }
                } else {
                    this.allAddress = address.map((p) => {
                        if (p.row_uuid === this.selectedAddress.row_uuid) {
                            return { ...p, is_selected: true };
                        } else {
                            return { ...p, is_selected: false };
                        }
                    });
                }

                /** user info */
                const userInfo = val[1];
                if (userInfo.length !== 0) {
                    this.userDetail = userInfo[0];
                    this.user_full_name = this.userDetail.full_name;
                    this.mobile_number = this.userDetail.mobile_number;
                }
            });

            if (can_show_loading) {
                this.loadingScreen.showLoadingScreen().then(() => {
                    this.fetch_delivery_address_of_user__.fetch(this.user_row_uuid).obsData();
                    this.fetch_user_single__.fetch(this.user_row_uuid).obsData();
                });
            } else {
                this.fetch_delivery_address_of_user__.fetch(this.user_row_uuid).obsData();
                this.fetch_user_single__.fetch(this.user_row_uuid).obsData();
            }
        });
    }

    /** get the current location */
    async getCurrentPosition() {
        this.platform.ready().then(async () => {
            this.areWeUsingGps = true;

            try {
                await Geolocation.requestPermissions();

                const coordinates = await Geolocation.getCurrentPosition();
                if (coordinates) {
                    this.areWeUsingGps = false;

                    const lat = coordinates.coords.latitude;
                    const lng = coordinates.coords.longitude;
                    this.lat = lat;
                    this.lng = lng;

                    const add: any = await this.getReverseGeocodingData(this.lat, this.lng);

                    this.makeNewAddress(add.street, add.city, add.pincode, add.state, add.country, lat, lng);
                }
            } catch (error) {
                console.error(error);
            }
        });
    }

    /** reverse geocoding with api */
    public getReverseGeocodingData(lat: number, lng: number) {
        return new Promise((resolve, reject) => {
            var latlng = new google.maps.LatLng(lat, lng);
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ latLng: latlng }, (results: any, status: any) => {
                if (status !== google.maps.GeocoderStatus.OK) {
                    this.printMessage(status);
                    reject(status);
                }

                var address = results[0].formatted_address;
                const formatted_address = address.trim();
                const add = addressFromForAddres(formatted_address, lat, lng);
                resolve(add);
            });
        });
    }

    /** choose the new address manually */
    public async chooseAddress() {
        const modalRef = await this.modal.create({
            component: SearchLocationComponent,
        });
        await modalRef.present();

        const { data } = await modalRef.onWillDismiss();
        if (data) {
            this.makeNewAddress(data.street, data.city, data.pincode, data.state, data.country, data.lat, data.lng);
        }
    }

    /** make new address */
    public makeNewAddress(street: string, city: string, pincode: string, state: string, country: string, latitude: number, longitude: number) {
        this.platform.ready().then(() => {
            this.loadingScreen.showLoadingScreen().then((ref) => {
                const date_created: string = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
                const daoLife = new DaoLife();
                const insert_delivery_address = new this.database.insert_delivery_address(daoConfig);
                insert_delivery_address.observe(daoLife).subscribe((val) => {
                    if (ref.isConnected) {
                        ref.dismiss();
                    }
                });
                insert_delivery_address.fetch(this.user_row_uuid, street, pincode, city, state, country, latitude, longitude, date_created, uuid()).obsData();
                daoLife.softKill();
            });
        });
    }

    /** address is selcting */
    addressSelected(address: IGetDeliveryAddress) {
        if (!address) {
            return;
        }

        this.ngZone.run(() => {
            if (address.is_selected) {
                // remove the item
                this.selectedAddress = null;
            } else {
                this.selectedAddress = address;
            }

            this.allAddress = this.allAddress.map((p) => {
                if (p.row_uuid === address.row_uuid) {
                    return { ...p, is_selected: !address.is_selected };
                } else {
                    return { ...p, is_selected: false };
                }
            });
        });
    }

    /** trackers */
    tracker(index: number, value: IGetDeliveryAddress) {
        return value.row_uuid;
    }

    /** go to choose pay mode */
    public goToPayMode() {
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab2', 'pay_mode', this.kitchen_row_uuid, this.selectedAddress.row_uuid]);
        });
    }

    /** print the messgae */
    private async printMessage(message: string) {
        const dailogRef = await this.toast.create({
            header: message,
            duration: 2000,
        });

        await dailogRef.present();
    }
}
