import { Component, OnDestroy, OnInit } from '@angular/core';
import { addressFromForAddres } from '@foodbzr/shared/util';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { LoadingScreenService } from '../../../../loading-screen.service';
import { SearchLocationComponent } from '../choose-location/choose-location.component';

declare var google;

@Component({
    selector: 'foodbzr-ask-location',
    templateUrl: './ask-location.component.html',
    styleUrls: ['./ask-location.component.scss'],
})
export class AskLocationComponent implements OnInit, OnDestroy {
    can_click_fetch_loc = true;

    constructor(private modal: ModalController, private modal_2: ModalController, private location: Geolocation, private platform: Platform, private loading: LoadingScreenService) {}

    ngOnInit() {}

    ngOnDestroy() {}

    /** close modal */
    public closeModal(ref: any) {
        this.modal.dismiss(ref);
    }

    /** search the location */
    public async searchLocation() {
        this.platform.ready().then(async () => {
            const modalRef = await this.modal_2.create({
                component: SearchLocationComponent,
            });
            await modalRef.present();

            const { data } = await modalRef.onWillDismiss();
            if (data) {
                /** set the data to localstorage */
                localStorage.setItem('street', data.street);
                localStorage.setItem('city', data.city);
                localStorage.setItem('pincode', data.pincode);
                localStorage.setItem('state', data.state);
                localStorage.setItem('lat', data.lat);
                localStorage.setItem('lng', data.lng);

                this.closeModal(true);
            }
        });
    }

    /** use current location */
    public async useCurrentLocation() {
        this.platform.ready().then(async () => {
            try {
                this.can_click_fetch_loc = false;
                const loc = await this.location.getCurrentPosition();

                if (loc) {
                    const lat = +loc.coords.latitude;
                    const lng = +loc.coords.longitude;

                    const data: any = await this.getReverseGeocodingData(lat, lng);

                    /** set the data to localstorage */
                    localStorage.setItem('street', data.street);
                    localStorage.setItem('city', data.city);
                    localStorage.setItem('pincode', data.pincode);
                    localStorage.setItem('state', data.state);
                    localStorage.setItem('lat', data.lat);
                    localStorage.setItem('lng', data.lng);

                    this.can_click_fetch_loc = true;
                    this.closeModal(true);
                } else {
                    this.can_click_fetch_loc = true;
                }
            } catch (error) {
                this.can_click_fetch_loc = true;
            }
        });
    }

    /** reverse geocoding with api */
    public getReverseGeocodingData(lat: number, lng: number) {
        return new Promise((resolve, reject) => {
            var latlng = new google.maps.LatLng(lat, lng);
            // This is making the Geocode request
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ latLng: latlng }, (results: any, status: any) => {
                if (status !== google.maps.GeocoderStatus.OK) {
                    reject(status);
                }

                var address = results[0].formatted_address;
                const formatted_address = address.trim();
                const add = addressFromForAddres(formatted_address, lat, lng);
                resolve(add);
            });
        });
    }
}
