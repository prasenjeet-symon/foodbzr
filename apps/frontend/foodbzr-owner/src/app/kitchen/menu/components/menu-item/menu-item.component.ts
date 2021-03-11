import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fetch_menus_of_kitchen, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetMenu } from '@foodbzr/shared/types';
import { Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';

@Component({
    selector: 'foodbzr-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit, OnDestroy {
    @Input() kitchen_row_uuid: string;
    @Output() update_menu: EventEmitter<IGetMenu> = new EventEmitter();
    public database = {
        fetch_menus_of_kitchen: FoodbzrDatasource.getInstance().fetch_menus_of_kitchen,
        delete_menu: FoodbzrDatasource.getInstance().delete_menu,
    };
    public daosLife: DaoLife;

    /** daos */
    fetch_menus_of_kitchen__: fetch_menus_of_kitchen;

    /** data */
    allMenus: IGetMenu[] = [];

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute, private platform: Platform, private loading: LoadingScreenService) {
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

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            if (can_show_loading) {
                this.loading.showLoadingScreen().then((ref) => {
                    this.fetch_menus_of_kitchen__ = new this.database.fetch_menus_of_kitchen(daoConfig);
                    this.fetch_menus_of_kitchen__.observe(this.daosLife).subscribe((val) => {
                        if (ref.isConnected) {
                            ref.dismiss();
                        }

                        this.ngZone.run(() => {
                            this.allMenus = val;
                        });
                    });

                    this.fetch_menus_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
                });
            } else {
                this.fetch_menus_of_kitchen__ = new this.database.fetch_menus_of_kitchen(daoConfig);
                this.fetch_menus_of_kitchen__.observe(this.daosLife).subscribe((val) => {
                    this.ngZone.run(() => {
                        this.allMenus = val;
                    });
                });

                this.fetch_menus_of_kitchen__.fetch(this.kitchen_row_uuid).obsData();
            }
        });
    }

    deactivateMenu(menu: IGetMenu) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_menu__ = new this.database.delete_menu(daoConfig);
            delete_menu__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            this.loading.showLoadingScreen().then(() => {
                delete_menu__.fetch('no', menu.row_uuid).obsData();
            });
            daoLife.softKill();
        });
    }

    activateMenu(menu: IGetMenu) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_menu__ = new this.database.delete_menu(daoConfig);
            delete_menu__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });
            this.loading.showLoadingScreen().then(() => {
                delete_menu__.fetch('yes', menu.row_uuid).obsData();
            });
            daoLife.softKill();
        });
    }

    navToMenuVariant(menu: IGetMenu) {
        this.router.navigate(['tabs', 'tab3', 'kitchen-menu-variant', menu.row_uuid, menu.profile_picture]);
    }

    /** trackrer */
    public trackr(index: number, value: any) {
        return value.row_uuid;
    }
}
