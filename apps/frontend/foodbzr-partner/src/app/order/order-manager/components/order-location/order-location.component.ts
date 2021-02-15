import { OnInit, Component, ViewChild, ElementRef, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

declare var google: any;

@Component({
    selector: 'foodbzr-order-location',
    templateUrl: './order-location.component.html',
    styleUrls: ['./order-location.component.scss'],
})
export class OrderLocationComponent implements OnInit {
    @Input() latitude: number;
    @Input() longitude: number;

    private dark_mode_style = [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }],
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }],
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }],
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }],
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }],
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }],
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }],
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }],
        },
    ];

    @ViewChild('map', { static: true }) mapElement: ElementRef<HTMLDivElement>;
    map: any;

    constructor(private modal: ModalController) {}

    ngOnInit() {
        let latLng = new google.maps.LatLng(this.latitude, this.longitude);
        let mapOptions = {
            center: latLng,
            zoom: 10,
            gestureHandling: 'none',
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: this.dark_mode_style,
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        const imageMarker = {
            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
        };

        var marker = new google.maps.Marker({
            position: latLng,
            title: 'User location',
            icon: imageMarker,
        });

        marker.setMap(this.map);
    }

    async dismissModal() {
        await this.modal.dismiss();
    }
}
