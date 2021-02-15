import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_menus_of_kitchen, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetMenu } from '@foodbzr/shared/types';
import { daoConfig, DaoLife } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
    @Input() kitchen_row_uuid: string;
    private database = {
        fetch_menus_of_kitchen: FoodbzrDatasource.getInstance().fetch_menus_of_kitchen,
        delete_menu: FoodbzrDatasource.getInstance().delete_menu,
    };

    @Output() update_menu: EventEmitter<IGetMenu> = new EventEmitter();
    daosLife: DaoLife;

    fetch_menus_of_kitchen__: fetch_menus_of_kitchen;

    allMenus: IGetMenu[] = [];

    constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute) {
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.fetch_menus_of_kitchen__ = new this.database.fetch_menus_of_kitchen(daoConfig);
        this.fetch_menus_of_kitchen__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.allMenus = val;
            });
        });
        this.fetch_menus_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
    }

    deactivateMenu(menu: IGetMenu) {
        const daoLife = new DaoLife();
        const delete_menu__ = new this.database.delete_menu(daoConfig);
        delete_menu__.observe(daoLife).subscribe((val) => console.log('menu deleted'));
        delete_menu__.fetch('no', menu.row_uuid).obsData();
        daoLife.softKill();
    }

    activateMenu(menu: IGetMenu) {
        const daoLife = new DaoLife();
        const delete_menu__ = new this.database.delete_menu(daoConfig);
        delete_menu__.observe(daoLife).subscribe((val) => console.log('menu activated'));
        delete_menu__.fetch('yes', menu.row_uuid).obsData();
        daoLife.softKill();
    }

    navToMenuVariant(menu: IGetMenu) {
        this.router.navigate(['tabs', 'tab2', 'kitchen-menu-variant', menu.row_uuid, menu.profile_picture]);
    }
}
