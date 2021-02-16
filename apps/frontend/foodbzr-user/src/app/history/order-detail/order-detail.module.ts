import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderDetailPageComponent } from './order-detail-page/order-detail-page.component';
import { PendingOrderComponent } from './components/pending-order/pending-order.component';
import { CanceledOrderComponent } from './components/canceled-order/canceled-order.component';
import { DeliveredOrderComponent } from './components/delivered-order/delivered-order.component';

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
    declarations: [OrderDetailPageComponent, PendingOrderComponent, CanceledOrderComponent, DeliveredOrderComponent],
})
export class OrderDetailModule {}
