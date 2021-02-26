import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FavKitchenPageComponent } from './fav-kitchen-page/fav-kitchen-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: FavKitchenPageComponent,
            },
        ]),
    ],
    declarations: [FavKitchenPageComponent],
})
export class FavKitchenModule {}
