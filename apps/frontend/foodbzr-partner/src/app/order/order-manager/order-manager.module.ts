import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChooseDboyComponent } from './components/choose-dboy/choose-dboy.component';
import { OrderLocationComponent } from './components/order-location/order-location.component';
import { PendingOrderComponent } from './components/pending-order/pending-order.component';
import { OrderManagerPageComponent } from './order-manager-page/order-manager-page.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: OrderManagerPageComponent,
            },
        ]),
    ],
    entryComponents: [OrderLocationComponent, ChooseDboyComponent],
    declarations: [OrderManagerPageComponent, PendingOrderComponent, OrderLocationComponent, ChooseDboyComponent],
    exports: [OrderManagerPageComponent],
})
export class OrderManagerModule {}
