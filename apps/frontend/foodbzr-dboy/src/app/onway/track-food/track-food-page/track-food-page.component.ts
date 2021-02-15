import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { google_map_dark_theme } from '@foodbzr/shared/util';
import { ModalController } from '@ionic/angular';
import { FoodbzrDatasource, fetch_order_on_way_dboy } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { IGetOrderOnWay } from '@foodbzr/shared/types';

declare let google: any;

@Component({
    selector: 'foodbzr-track-food-page',
    templateUrl: './track-food-page.component.html',
    styleUrls: ['./track-food-page.component.scss'],
})
export class TrackFoodPageComponent implements OnInit {
    daosLife: DaoLife;
    @ViewChild('map', { static: true }) mapElement: ElementRef<HTMLDivElement>;
    public database = {
        fetch_order_on_way_dboy: FoodbzrDatasource.getInstance().fetch_order_on_way_dboy,
    };

    /** daos */
    fetch_order_on_way_dboy__: fetch_order_on_way_dboy;

    /** datas */
    public allOrdersOnWay: IGetOrderOnWay[] = [];
    public map: any;
    public latitude: number = 25.5941;
    public longitude: number = 85.1376;
    private dboy_row_uuid: string;
    public selectedOrder: IGetOrderOnWay;

    constructor(private modal: ModalController, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
        this.dboy_row_uuid = localStorage.getItem('dboy_row_uuid');
    }

    ngOnInit() {
        /** fetch all on way orders */
        this.fetch_order_on_way_dboy__ = new this.database.fetch_order_on_way_dboy(daoConfig);
        this.fetch_order_on_way_dboy__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allOrdersOnWay = val;
                if (this.allOrdersOnWay.length !== 0) {
                    this.selectedOrder = val[0];
                    this.latitude = this.selectedOrder.latitude;
                    this.longitude = this.selectedOrder.longitude;
                    this.renderMap();
                }
            });
        });
        this.fetch_order_on_way_dboy__.fetch(this.dboy_row_uuid).obsData();
    }

    renderMap() {
        /** manage google map */
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
    }

    updateMap() {
        this.latitude = this.selectedOrder.latitude;
        this.longitude = this.selectedOrder.longitude;
        this.renderMap()
    }
}
