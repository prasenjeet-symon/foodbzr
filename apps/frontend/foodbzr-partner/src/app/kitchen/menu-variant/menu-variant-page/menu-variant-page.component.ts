import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreateMenuVariantComponent } from '../components/create-menu-variant/create-menu-variant.component';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import {} from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-menu-variant-page',
    templateUrl: './menu-variant-page.component.html',
    styleUrls: ['./menu-variant-page.component.scss'],
})
export class MenuVariantPageComponent implements OnInit {
    public partner_row_uuid: string;
    public menu_row_uuid: string;
    public menu_profile_picture: string;

    public database = {
        insert_menu_size_variant: FoodbzrDatasource.getInstance().insert_menu_size_variant,
    };

    constructor(private activatedRoute: ActivatedRoute, private ngZone: NgZone, private modal: ModalController) {
        /** extract the partner row uuid from localstorage */
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.activatedRoute.paramMap.subscribe((param) => {
                if (param.has('menu_row_uuid') && param.has('menu_profile_picture')) {
                    this.menu_profile_picture = param.get('menu_profile_picture');
                    this.menu_row_uuid = param.get('menu_row_uuid');
                }
            });
        });
    }

    /** create the menu size variant */
    async createMenuSizeVariant() {
        const dailogRef = await this.modal.create({
            component: CreateMenuVariantComponent,
            componentProps: { database: this.database, partner_row_uuid: this.partner_row_uuid, menu_row_uuid: this.menu_row_uuid, menu_profile_picture: this.menu_profile_picture },
            swipeToClose: true,
        });

        await dailogRef.present();
    }
}
