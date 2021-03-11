import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { is_active } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { LoadingScreenService } from '../../../loading-screen.service';
import { CreateMenuVariantComponent } from '../components/create-menu-variant/create-menu-variant.component';

@Component({
    selector: 'foodbzr-menu-variant-page',
    templateUrl: './menu-variant-page.component.html',
    styleUrls: ['./menu-variant-page.component.scss'],
})
export class MenuVariantPageComponent implements OnInit, OnDestroy {
    public partner_row_uuid: string;
    public menu_row_uuid: string;
    public menu_profile_picture: string;
    public kitchen_row_uuid: string;
    can_edit_kitchen: is_active = 'no';

    public database = {
        insert_menu_size_variant: FoodbzrDatasource.getInstance().insert_menu_size_variant,
    };

    constructor(private activatedRoute: ActivatedRoute, private ngZone: NgZone, private modal: ModalController, private loading: LoadingScreenService, private platform: Platform) {
        /** extract the partner row uuid from localstorage */
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((param) => {
            if (param.has('menu_row_uuid') && param.has('menu_profile_picture') && param.has('kitchen_row_uuid')) {
                this.menu_profile_picture = param.get('menu_profile_picture');
                this.menu_row_uuid = param.get('menu_row_uuid');
                this.kitchen_row_uuid = param.get('kitchen_row_uuid');

                if (localStorage.getItem(`${this.kitchen_row_uuid}_can_edit`)) {
                    this.can_edit_kitchen = localStorage.getItem(`${this.kitchen_row_uuid}_can_edit`) as is_active;
                }
            }
        });
    }

    ngOnDestroy() {}

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
