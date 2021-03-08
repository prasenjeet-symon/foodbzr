import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { CanceledOrderComponent } from './components/canceled-order/canceled-order.component';
import { DeliveredOrderComponent } from './components/delivered-order/delivered-order.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { PendingOrderComponent } from './components/pending-order/pending-order.component';
import { OrderDetailPageComponent } from './order-detail-page/order-detail-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: OrderDetailPageComponent,
            },
        ]),
    ],
    providers: [LoadingScreenService, CallNumber],
    declarations: [OrderDetailPageComponent, PendingOrderComponent, CanceledOrderComponent, DeliveredOrderComponent, OrderDetailComponent],
})
export class OrderDetailModule {}
