import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonicModule } from '@ionic/angular';
import { FcmService } from '../../fcm.service';
import { ChooseDboyComponent } from './components/choose-dboy/choose-dboy.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderLocationComponent } from './components/order-location/order-location.component';
import { PendingOrderComponent } from './components/pending-order/pending-order.component';
import { OrderManagerPageComponent } from './order-manager-page/order-manager-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: OrderManagerPageComponent,
            },
        ]),
    ],
    providers: [FcmService, CallNumber],
    entryComponents: [OrderLocationComponent, ChooseDboyComponent, OrderDetailComponent],
    declarations: [OrderManagerPageComponent, PendingOrderComponent, OrderLocationComponent, ChooseDboyComponent, OrderDetailComponent],
    exports: [],
})
export class OrderManagerModule {}
