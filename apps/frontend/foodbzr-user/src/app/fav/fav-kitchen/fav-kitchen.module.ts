import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
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
    providers: [LoadingScreenService],
    declarations: [FavKitchenPageComponent],
})
export class FavKitchenModule {}
