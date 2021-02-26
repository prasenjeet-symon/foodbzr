import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { google_map_dark_theme } from '@foodbzr/shared/util';
import { ModalController, ToastController } from '@ionic/angular';
import { FoodbzrDatasource, fetch_order_on_way_dboy } from '@foodbzr/datasource';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
import { IGetOrderOnWay } from '@foodbzr/shared/types';
import { DeliverNowComponent } from '../components/deliver-now/deliver-now.component';
import { DeliveredSuccessComponent } from '../components/delivered-success/delivered-success.component';

declare let google: any;

@Component({
    selector: 'foodbzr-track-food-page',
    templateUrl: './track-food-page.component.html',
    styleUrls: ['./track-food-page.component.scss'],
})
export class TrackFoodPageComponent implements OnInit {
    /** dom selector */
    @ViewChild('map', { static: true }) mapElement: ElementRef<HTMLDivElement>;

    /** database */
    public daosLife: DaoLife;
    public database = {
        fetch_order_on_way_dboy: FoodbzrDatasource.getInstance().fetch_order_on_way_dboy,
        update_t_order_lifecycle: FoodbzrDatasource.getInstance().update_t_order_lifecycle,
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

    constructor(private modal: ModalController, private ngZone: NgZone, private toast: ToastController) {
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
                } else {
                    this.selectedOrder = null;
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
        this.renderMap();
    }

    /** deliver the order now */
    public deliverOrderNow() {
        this.ngZone.run(async () => {
            const dailogRef = await this.modal.create({
                component: DeliverNowComponent,
                componentProps: {},
            });

            await dailogRef.present();

            const { data } = await dailogRef.onWillDismiss();

            if (data) {
                const OTP = data;

                if (OTP !== this.selectedOrder.otp) {
                    const toastRef = await this.toast.create({
                        header: 'Wrong OTP',
                        message: 'Entered OTP is wrong please check the otp',
                        position: 'bottom',
                        color: 'danger',
                        buttons: [
                            {
                                text: 'Done',
                                role: 'cancel',
                                handler: () => {
                                    console.log('Cancel clicked');
                                },
                            },
                        ],
                    });
                    await toastRef.present();
                    return;
                }

                /** verify the otp and deliver */
                const daoLife = new DaoLife();
                const update_t_order_lifecycle__ = new this.database.update_t_order_lifecycle(daoConfig);
                update_t_order_lifecycle__.observe(daoLife).subscribe((val) => {
                    console.log('update the order lifecycle');
                });
                (await update_t_order_lifecycle__.fetch('order delivered', this.selectedOrder.row_uuid)).obsData();
                daoLife.softKill();

                await this.orderDone();
            }
        });
    }

    /** order delivered success */
    public async orderDone() {
        const dailogRef = await this.modal.create({
            component: DeliveredSuccessComponent,
        });

        await dailogRef.present();
    }
}
