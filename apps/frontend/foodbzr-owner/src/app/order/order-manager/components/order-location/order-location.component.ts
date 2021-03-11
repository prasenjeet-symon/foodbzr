import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { google_map_dark_theme } from '@foodbzr/shared/util';
import { ModalController, Platform } from '@ionic/angular';
import { LoadingScreenService } from '../../../../loading-screen.service';

declare var google: any;

@Component({
    selector: 'foodbzr-order-location',
    templateUrl: './order-location.component.html',
    styleUrls: ['./order-location.component.scss'],
})
export class OrderLocationComponent implements OnInit {
    @ViewChild('map', { static: true }) mapElement: ElementRef<HTMLDivElement>;
    @Input() latitude: number;
    @Input() longitude: number;

    map: any;

    constructor(private modal: ModalController, private platform: Platform, private loading: LoadingScreenService) {}

    ngOnInit() {
        this.platform.ready().then(() => {
            let latLng = new google.maps.LatLng(this.latitude, this.longitude);
            let mapOptions = {
                center: latLng,
                zoom: 10,
                gestureHandling: 'none',
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: google_map_dark_theme,
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
        });
    }

    async dismissModal() {
        await this.modal.dismiss();
    }
}
