import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CameraResultType, Plugins } from '@capacitor/core';
import { fetch_menu_picture_of_menu, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetMenuPicture } from '@foodbzr/shared/types';
import { PhotoViewer, PhotoViewerOptions } from '@ionic-native/photo-viewer/ngx';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { from } from 'rxjs';
import { LoadingScreenService } from '../../../../loading-screen.service';
const { Camera } = Plugins;
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Component({
    selector: 'foodbzr-food-picture',
    templateUrl: './food-picture.component.html',
    styleUrls: ['./food-picture.component.scss'],
})
export class FoodPictureComponent implements OnInit, OnDestroy {
    @Input() menu_row_uuid: string;
    @Input() partner_row_uuid: string;

    daosLife: DaoLife;
    /** data */
    allPics: IGetMenuPicture[] = [];

    public database = {
        fetch_menu_picture_of_menu: FoodbzrDatasource.getInstance().fetch_menu_picture_of_menu,
        uplaod_image_to_cloud: FoodbzrDatasource.getInstance().uplaod_image_to_cloud,
    };

    constructor(private photoViewer: PhotoViewer, private ngZone: NgZone, private platform: Platform, private imagePicker: ImagePicker, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
    }

    /** daos */
    fetch_menu_picture_of_menu__: fetch_menu_picture_of_menu;

    /**  subscriptions */
    public networkSubscription: any;

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
            if (can_show_loading) {
                this.loading.showLoadingScreen().then((ref) => {
                    /** fetch all the menus picture */
                    this.fetch_menu_picture_of_menu__ = new this.database.fetch_menu_picture_of_menu(daoConfig);
                    this.fetch_menu_picture_of_menu__.observe(this.daosLife).subscribe((val) => {
                        if (ref.isConnected) {
                            ref.dismiss();
                        }

                        this.ngZone.run(() => {
                            this.allPics = val;
                        });
                    });

                    this.fetch_menu_picture_of_menu__.fetch(this.menu_row_uuid).obsData();
                });
            } else {
                /** fetch all the menus picture */
                this.fetch_menu_picture_of_menu__ = new this.database.fetch_menu_picture_of_menu(daoConfig);
                this.fetch_menu_picture_of_menu__.observe(this.daosLife).subscribe((val) => {
                    this.ngZone.run(() => {
                        this.allPics = val;
                    });
                });

                this.fetch_menu_picture_of_menu__.fetch(this.menu_row_uuid).obsData();
            }
        });
    }

    viewImage(url: string) {
        const options: PhotoViewerOptions = {
            share: true,
        };

        this.platform.ready().then(() => {
            this.photoViewer.show(url, 'Menu Picture', options);
        });
    }

    tracker(index: number, value: IGetMenuPicture) {
        return value.row_uuid;
    }

    /** upload the mneu pics */

    /** take the camera pics */
    public async takePicture() {
        const has_permission = await this.imagePicker.hasReadPermission();
        if (!has_permission) {
            // request the permission
            await this.imagePicker.requestReadPermission();
            return;
        }

        /** there is permission */
        const images = await this.imagePicker.getPictures({ quality: 70, outputType: 1 });

        console.log(images, 'HEY');
    }
}
