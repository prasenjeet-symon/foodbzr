import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { KitchenPageComponent } from './kitchen-page/kitchen-page.component';

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: KitchenPageComponent,
            },
        ]),
    ],
    providers: [LoadingScreenService],
    declarations: [KitchenPageComponent],
    exports: [],
})
export class KitchenModule {}
