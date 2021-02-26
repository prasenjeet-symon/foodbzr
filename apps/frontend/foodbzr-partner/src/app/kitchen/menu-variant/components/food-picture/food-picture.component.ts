import { Component, Input, NgZone, OnInit } from '@angular/core';
import { PhotoViewer, PhotoViewerOptions } from '@ionic-native/photo-viewer/ngx';
import { fetch_menu_picture_of_menu, FoodbzrDatasource } from '@foodbzr/datasource';
import { DaoLife, daoConfig } from '@sculify/node-room-client';
import { IGetMenuPicture } from '@foodbzr/shared/types';
import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;

@Component({
    selector: 'foodbzr-food-picture',
    templateUrl: './food-picture.component.html',
    styleUrls: ['./food-picture.component.scss'],
})
export class FoodPictureComponent implements OnInit {
    @Input() menu_row_uuid: string;
    @Input() partner_row_uuid: string;
    daosLife: DaoLife;
    /** data */
    allPics: IGetMenuPicture[] = [];

    public database = {
        fetch_menu_picture_of_menu: FoodbzrDatasource.getInstance().fetch_menu_picture_of_menu,
        uplaod_image_to_cloud: FoodbzrDatasource.getInstance().uplaod_image_to_cloud,
    };

    constructor(private photoViewer: PhotoViewer, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }
    /** daos */
    fetch_menu_picture_of_menu__: fetch_menu_picture_of_menu;

    ngOnInit() {
        /** fetch all the menus picture */
        this.fetch_menu_picture_of_menu__ = new this.database.fetch_menu_picture_of_menu(daoConfig);
        this.fetch_menu_picture_of_menu__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allPics = val;
            });
        });
        this.fetch_menu_picture_of_menu__.fetch(this.menu_row_uuid).obsData();
    }

    viewImage(url: string) {
        const options: PhotoViewerOptions = {
            share: true,
        };
        this.photoViewer.show(url, 'Menu Picture', options);
    }

    tracker(index: number, value: IGetMenuPicture) {
        return value.row_uuid;
    }

    /** upload the mneu pics */

    /** take the camera pics */
    public async takePicture() {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Base64,
        });

        // image.webPath will contain a path that can be set as an image src.
        // You can access the original file using image.path, which can be
        // passed to the Filesystem API to read the raw data of the image,
        // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
        const base64 = image.base64String;

        /** upload to cloud */
    }
}
