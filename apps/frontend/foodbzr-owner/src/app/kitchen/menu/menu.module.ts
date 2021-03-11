import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { DboyItemComponent } from './components/dboy-item/dboy-item.component';
import { InitDboyComponent } from './components/init-dboy/init-dboy.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { UpdateMenuComponent } from './components/update-menu/update-menu.component';
import { MenuPageComponent } from './menu-page/menu-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenuPageComponent,
            },
        ]),
    ],
    providers: [LoadingScreenService],
    entryComponents: [CreateMenuComponent, UpdateMenuComponent],
    declarations: [MenuPageComponent, DboyItemComponent, MenuItemComponent, CreateMenuComponent, UpdateMenuComponent, InitDboyComponent],
})
export class MenuModule {}
