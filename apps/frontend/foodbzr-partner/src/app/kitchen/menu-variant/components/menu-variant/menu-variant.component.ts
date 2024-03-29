import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fetch_menu_size_variant_of_menu, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetMenuSizeVariant, is_active } from '@foodbzr/shared/types';
import { ModalController, Platform } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { LoadingScreenService } from '../../../../loading-screen.service';
import { UpdateMenuVariantComponent } from '../update-menu-variant/update-menu-variant.component';

@Component({
    selector: 'foodbzr-menu-variant',
    templateUrl: './menu-variant.component.html',
    styleUrls: ['./menu-variant.component.scss'],
})
export class MenuVariantComponent implements OnInit, OnDestroy {
    @Input() menu_row_uuid: string;
    @Input() partner_row_uuid: string;
    @Input() can_edit_kitchen: is_active;
    public daosLife: DaoLife;
    public database = {
        fetch_menu_size_variant_of_menu: FoodbzrDatasource.getInstance().fetch_menu_size_variant_of_menu,
        delete_menu_size_variant: FoodbzrDatasource.getInstance().delete_menu_size_variant,
        update_menu_size_variant: FoodbzrDatasource.getInstance().update_menu_size_variant,
        update_menu_size_variant_offer: FoodbzrDatasource.getInstance().update_menu_size_variant_offer,
    };

    public allMenuVariants: IGetMenuSizeVariant[] = [];

    constructor(private ngZone: NgZone, private modal: ModalController, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
    }

    /** daos */
    fetch_menu_size_variant_of_menu__: fetch_menu_size_variant_of_menu;

    /** unsubscribe */
    public networkSubscription: any;

    ngOnDestroy() {
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        this.daosLife.softKill();
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
            if (can_show_loading) {
                this.loading.showLoadingScreen().then((ref) => {
                    this.fetch_menu_size_variant_of_menu__ = new this.database.fetch_menu_size_variant_of_menu(daoConfig);
                    this.fetch_menu_size_variant_of_menu__.observe(this.daosLife).subscribe((val) => {
                        if (ref.isConnected) {
                            ref.dismiss();
                        }

                        this.ngZone.run(() => {
                            this.allMenuVariants = val;
                        });
                    });

                    this.fetch_menu_size_variant_of_menu__.fetch(this.menu_row_uuid).obsData();
                });
            } else {
                this.fetch_menu_size_variant_of_menu__ = new this.database.fetch_menu_size_variant_of_menu(daoConfig);
                this.fetch_menu_size_variant_of_menu__.observe(this.daosLife).subscribe((val) => {
                    this.ngZone.run(() => {
                        this.allMenuVariants = val;
                    });
                });

                this.fetch_menu_size_variant_of_menu__.fetch(this.menu_row_uuid).obsData();
            }
        });
    }

    /** change the active status */
    public deactivateMenu(menu_variant: IGetMenuSizeVariant) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_menu_size_variant__ = new this.database.delete_menu_size_variant(daoConfig);
            delete_menu_size_variant__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                delete_menu_size_variant__.fetch(menu_variant.row_uuid, 'no').obsData();
            });

            daoLife.softKill();
        });
    }

    public activateMenu(menu_variant: IGetMenuSizeVariant) {
        this.platform.ready().then(() => {
            const daoLife = new DaoLife();
            const delete_menu_size_variant__ = new this.database.delete_menu_size_variant(daoConfig);
            delete_menu_size_variant__.observe(daoLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }
            });

            this.loading.showLoadingScreen().then(() => {
                delete_menu_size_variant__.fetch(menu_variant.row_uuid, 'yes').obsData();
            });

            daoLife.softKill();
        });
    }

    /** open the dailog to update the menu */
    async updateMenu(menu: IGetMenuSizeVariant) {
        const dailogRef = await this.modal.create({
            component: UpdateMenuVariantComponent,
            componentProps: { database: this.database, partner_row_uuid: this.partner_row_uuid, menu_row_uuid: this.menu_row_uuid, menu_variant: menu },
            swipeToClose: true,
        });

        await dailogRef.present();
    }
}
