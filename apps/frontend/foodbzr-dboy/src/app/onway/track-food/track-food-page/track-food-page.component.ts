import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fetch_order_on_way_dboy, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrderOnWay } from '@foodbzr/shared/types';
import { google_map_dark_theme } from '@foodbzr/shared/util';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../loading-screen.service';
import { DeliverNowComponent } from '../components/deliver-now/deliver-now.component';
import { DeliveredSuccessComponent } from '../components/delivered-success/delivered-success.component';

declare let google: any;

@Component({
    selector: 'foodbzr-track-food-page',
    templateUrl: './track-food-page.component.html',
    styleUrls: ['./track-food-page.component.scss'],
})
export class TrackFoodPageComponent implements OnInit, OnDestroy {
    mapElement: ElementRef<HTMLDivElement>;
    @ViewChild('map', { static: false })
    set appShark(mapElement: ElementRef<HTMLDivElement>) {
        if (mapElement) {
            this.mapElement = mapElement;
            this.renderMap();
        }
    }

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
    public can_show_map = false;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private platform: Platform, private loading: LoadingScreenService, private modal: ModalController, private ngZone: NgZone, private toast: ToastController, private call: CallNumber) {
        this.daosLife = new DaoLife();
        this.dboy_row_uuid = localStorage.getItem('dboy_row_uuid');
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.initScreen();

        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            /** fetch all on way orders */
            this.fetch_order_on_way_dboy__ = new this.database.fetch_order_on_way_dboy(daoConfig);
            this.fetch_order_on_way_dboy__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.allOrdersOnWay = val;
                    if (this.allOrdersOnWay.length !== 0) {
                        this.selectedOrder = val[0];
                        this.can_show_map = true;
                        this.latitude = this.selectedOrder.latitude;
                        this.longitude = this.selectedOrder.longitude;
                    } else {
                        this.can_show_map = false;
                        this.selectedOrder = null;
                    }
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_on_way_dboy__.fetch(this.dboy_row_uuid).obsData();
                });
            } else {
                this.fetch_order_on_way_dboy__.fetch(this.dboy_row_uuid).obsData();
            }
        });
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
    public async deliverOrderNow() {
        const dailogRef = await this.modal.create({
            component: DeliverNowComponent,
            componentProps: {},
        });

        await dailogRef.present();

        const { data } = await dailogRef.onWillDismiss();

        if (data) {
            const OTP = data;

            if (+OTP !== +this.selectedOrder.otp) {
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
            this.loading.showLoadingScreen().then(async () => {
                const daoLife = new DaoLife();
                const update_t_order_lifecycle__ = new this.database.update_t_order_lifecycle(daoConfig);
                update_t_order_lifecycle__.observe(daoLife).subscribe((val) => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });
                (await update_t_order_lifecycle__.fetch('order delivered', this.selectedOrder.row_uuid)).obsData();
                daoLife.softKill();

                await this.orderDone();
            });
        }
    }

    /** order delivered success */
    public async orderDone() {
        const dailogRef = await this.modal.create({
            component: DeliveredSuccessComponent,
        });

        await dailogRef.present();
    }

    /** call the number */
    public callNumber(number: string) {
        if (this.call.isCallSupported) {
            this.call.callNumber(number, true);
        }
    }
}
