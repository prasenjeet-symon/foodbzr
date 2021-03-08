import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { PendingOrderPageComponent } from './pending-order-page/pending-order-page.component';
import { CallNumber } from '@ionic-native/call-number/ngx';

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PendingOrderPageComponent,
            },
        ]),
    ],
    providers: [LoadingScreenService, CallNumber],
    declarations: [PendingOrderPageComponent],
    exports: [],
})
export class PendingOrderModule {}
