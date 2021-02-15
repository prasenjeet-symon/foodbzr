import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { DboyItemComponent } from './components/dboy-item/dboy-item.component';
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
    entryComponents: [CreateMenuComponent, UpdateMenuComponent],
    declarations: [MenuPageComponent, DboyItemComponent, MenuItemComponent, CreateMenuComponent, UpdateMenuComponent],
})
export class MenuModule {}
