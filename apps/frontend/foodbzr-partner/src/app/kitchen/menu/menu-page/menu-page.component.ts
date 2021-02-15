import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreateMenuComponent } from '../components/create-menu/create-menu.component';
import { UpdateMenuComponent } from '../components/update-menu/update-menu.component';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetMenu } from '@foodbzr/shared/types';

@Component({
    selector: 'foodbzr-menu-page',
    styleUrls: ['./menu-page.component.scss'],
    templateUrl: './menu-page.component.html',
})
export class MenuPageComponent implements OnInit {
    public kitchen_row_uuid: string;
    public kitchen_profile_picture: string;
    public partner_row_uuid: string;

    public database = {
        fetch_regional_food_category_of_partner: FoodbzrDatasource.getInstance().fetch_regional_food_category_of_partner,
        fetch_food_category_of_partner: FoodbzrDatasource.getInstance().fetch_food_category_of_partner,
        insert_menu: FoodbzrDatasource.getInstance().insert_menu,
        update_menu: FoodbzrDatasource.getInstance().update_menu,
        update_menu_category: FoodbzrDatasource.getInstance().update_menu_category,
        update_menu_offers: FoodbzrDatasource.getInstance().update_menu_offers,
    };

    constructor(private modal: ModalController, private activatedRoute: ActivatedRoute, private ngZone: NgZone) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
    }

    ngOnInit() {
        this.ngZone.run(() => {
            this.activatedRoute.paramMap.subscribe((param) => {
                if (param.has('kitchen_row_uuid') && param.has('profile_picture')) {
                    this.kitchen_row_uuid = param.get('kitchen_row_uuid');
                    this.kitchen_profile_picture = param.get('profile_picture');
                }
            });
        });
    }

    async createMenu() {
        const modalRef = await this.modal.create({
            component: CreateMenuComponent,
            componentProps: {
                partner_row_uuid: this.partner_row_uuid,
                database: this.database,
                kitchen_row_uuid: this.kitchen_row_uuid,
            },
        });

        await modalRef.present();
    }

    async updateMenu(menu: IGetMenu) {
        const modalRef = await this.modal.create({
            component: UpdateMenuComponent,
            componentProps: {
                partner_row_uuid: this.partner_row_uuid,
                database: this.database,
                menu: menu,
            },
        });

        await modalRef.present();
    }
}
