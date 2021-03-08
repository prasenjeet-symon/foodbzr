import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_menu_picture_of_menu } from '@foodbzr/datasource';
import { databaseDao, IGetMenuPicture } from '@foodbzr/shared/types';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-menu-pics',
    templateUrl: './menu-pics.component.html',
    styleUrls: ['./menu-pics.component.scss'],
})
export class MenuPicsComponent implements OnInit, OnDestroy {
    @Input() menu_row_uuid: string;

    public database: {
        fetch_menu_picture_of_menu: databaseDao<fetch_menu_picture_of_menu>;
    };
    public daosLife: DaoLife;

    /** data */
    public menuPics: IGetMenuPicture[] = [];

    /** daos */
    fetch_menu_picture_of_menu__: fetch_menu_picture_of_menu;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private photoV: PhotoViewer, private modal: ModalController, private ngZone: NgZone, private loading: LoadingScreenService, private platform: Platform) {
        this.daosLife = new DaoLife();
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

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_menu_picture_of_menu__ = new this.database.fetch_menu_picture_of_menu(daoConfig);
            this.fetch_menu_picture_of_menu__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }

                    this.menuPics = val;
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_menu_picture_of_menu__.fetch(this.menu_row_uuid).obsData();
                });
            } else {
                this.fetch_menu_picture_of_menu__.fetch(this.menu_row_uuid).obsData();
            }
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    /** close the modal */
    closeModal() {
        this.modal.dismiss();
    }

    /** show the pic */
    public showPic(uri: string) {
        this.platform.ready().then(() => {
            this.photoV.show(uri, "Menu's Pics", { share: true });
        });
    }
}
