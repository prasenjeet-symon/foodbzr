import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { fetch_menu_picture_of_menu } from '@foodbzr/datasource';
import { databaseDao, IGetMenuPicture } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

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

    constructor(private modal: ModalController, private ngZone: NgZone) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.fetch_menu_picture_of_menu__ = new this.database.fetch_menu_picture_of_menu(daoConfig);
        this.fetch_menu_picture_of_menu__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.menuPics = val;
            });
        });
        this.fetch_menu_picture_of_menu__.fetch(this.menu_row_uuid).obsData();
    }

    ngOnDestroy() {
        this.daosLife.softKill();
    }

    /** close the modal */
    closeModal() {
        this.modal.dismiss();
    }
}
