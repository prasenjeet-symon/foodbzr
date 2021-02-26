import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
declare let google: any;

@Component({
    selector: 'foodbzr-search-location',
    templateUrl: './choose-location.component.html',
    styleUrls: ['./choose-location.component.scss'],
})
export class SearchLocationComponent implements OnInit, AfterContentInit {
    @ViewChild('googleMap', { static: true }) googleMap: ElementRef<HTMLDivElement>;
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef<IonSearchbar>;
    public formatted_address: string;
    public lat: number;
    public lng: number;

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    ngAfterContentInit() { 
        this.initMap();
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

    /** Close the modal  */
    closeModal(should_emit_data: boolean) {
        if (should_emit_data) {
            /** make proper address */
            this.formatted_address = this.formatted_address.trim();

            const comma_separated = this.formatted_address.split(',');
            const country = comma_separated[comma_separated.length - 1];
            const pincode_state = comma_separated[comma_separated.length - 2].split(' ');
            const pincode = pincode_state[pincode_state.length - 1];
            const state = pincode_state[pincode_state.length - 2];

            const city = comma_separated[comma_separated.length - 3];
            const street = comma_separated.slice(0, comma_separated.length - 3).join(', ');

            this.modal.dismiss({ country, pincode, state, city, street, lat: this.lat, lng: this.lng });
        } else {
            this.modal.dismiss(null);
        }
    }
}
