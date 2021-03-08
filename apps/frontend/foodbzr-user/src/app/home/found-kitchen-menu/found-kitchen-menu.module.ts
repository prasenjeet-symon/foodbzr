import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { FoundKitchenMenuPageComponent } from './found-kitchen-menu-page/found-kitchen-menu-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: FoundKitchenMenuPageComponent,
            },
        ]),
    ],
    providers: [LoadingScreenService],
    declarations: [FoundKitchenMenuPageComponent],
})
export class FoundKitchenMenuModule {}
