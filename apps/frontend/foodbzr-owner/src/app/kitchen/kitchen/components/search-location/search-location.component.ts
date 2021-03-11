import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { addressFromForAddres } from '@foodbzr/shared/util';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonSearchbar, ModalController, Platform } from '@ionic/angular';

declare let google: any;

@Component({
    selector: 'foodbzr-search-location',
    templateUrl: './search-location.component.html',
    styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit, AfterContentInit {
    @ViewChild('googleMap', { static: true }) googleMap: ElementRef<HTMLDivElement>;
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef<IonSearchbar>;
    public formatted_address: string;
    public lat: number;
    public lng: number;

    constructor(private modal: ModalController, private location: Geolocation, private platform: Platform) {}

    ngOnInit() {}

    ngAfterContentInit() {
        this.platform.ready().then(() => {
            this.initMap();
        });
    }

    public async initMap() {
        const map = new google.maps.Map(this.googleMap.nativeElement, {
            center: { lat: 25.5941, lng: 85.1376 },
            zoom: 13,
        });

        const options = {
            componentRestrictions: { country: 'in' },
            fields: ['formatted_address', 'geometry', 'name', 'adr_address'],
            origin: map.getCenter(),
            strictBounds: false,
            types: ['establishment'],
        };

        const nativeSearchBar = await (this.searchInput as any).getInputElement();
        const autocomplete = new google.maps.places.Autocomplete(nativeSearchBar, options);

        /** bind the autocomplete to map */
        autocomplete.bindTo('bounds', map);

        /** create the info wind */
        const infowindowContent = document.getElementById('infowindow-content') as HTMLElement;
        const infowindow = new google.maps.InfoWindow();
        infowindow.setContent(infowindowContent);

        /** marker */
        const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29),
        });

        autocomplete.addListener('place_changed', () => {
            infowindow.close();
            marker.setVisible(false);

            const place = autocomplete.getPlace();
            this.formatted_address = place.formatted_address;

            if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();

            console.log(place);

            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = place.formatted_address;

            infowindow.open(map, marker);
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

    /** get the current location */
    public async getCurrentLocation() {
        try {
            /** fetch the cuttent location */
            const loc = await this.location.getCurrentPosition();
            this.lat = loc.coords.latitude;
            this.lng = loc.coords.longitude;

            const add = await this.getReverseGeocodingData(this.lat, this.lng);
            this.modal.dismiss(add);
        } catch (error) {
            this.modal.dismiss(null);
        }
    }

    /** Close the modal  */
    closeModal(should_emit_data: boolean) {
        if (should_emit_data) {
            /** make proper address */
            this.formatted_address = this.formatted_address.trim();
            const add = addressFromForAddres(this.formatted_address, this.lat, this.lng);
            this.modal.dismiss(add);
        } else {
            this.modal.dismiss(null);
        }
    }
}
