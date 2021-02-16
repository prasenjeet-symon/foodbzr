import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
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
    entryComponents: [AddToCartComponent],
    declarations: [MenuPageComponent, AddToCartComponent],
    exports: [MenuPageComponent],
})
export class MenuModule {}
