import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { addressFromForAddres } from '@foodbzr/shared/util';
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
    public map: any;
    public marker: any;

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    ngAfterContentInit() {
        this.initMap();
    }

    public async initMap() {
        this.map = new google.maps.Map(this.googleMap.nativeElement, {
            center: { lat: 25.5941, lng: 85.1376 },
            zoom: 13,
        });

        const options = {
            componentRestrictions: { country: 'in' },
            fields: ['formatted_address', 'geometry', 'name', 'adr_address'],
            origin: this.map.getCenter(),
            strictBounds: false,
            types: ['establishment'],
        };

        const nativeSearchBar = await (this.searchInput as any).getInputElement();
        const autocomplete = new google.maps.places.Autocomplete(nativeSearchBar, options);

        /** bind the autocomplete to map */
        autocomplete.bindTo('bounds', this.map);

        /** create the info wind */
        const infowindowContent = document.getElementById('infowindow-content') as HTMLElement;
        const infowindow = new google.maps.InfoWindow();
        infowindow.setContent(infowindowContent);

        /** marker */
        this.marker = new google.maps.Marker({
            map: this.map,
            anchorPoint: new google.maps.Point(0, -29),
        });

        autocomplete.addListener('place_changed', () => {
            infowindow.close();
            this.marker.setVisible(false);

            const place = autocomplete.getPlace();
            this.formatted_address = place.formatted_address;

            if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            if (place.geometry.viewport) {
                this.map.fitBounds(place.geometry.viewport);
            } else {
                this.map.setCenter(place.geometry.location);
                this.map.setZoom(17);
            }
            this.marker.setPosition(place.geometry.location);
            this.marker.setVisible(true);
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();

            console.log(place);

            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = place.formatted_address;

            infowindow.open(this.map, this.marker);
        });
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
