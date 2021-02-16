import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PayModePageComponent } from './pay-mode-page/pay-mode-page.component';
import { OrderDoneComponent } from './components/order-done/order-done.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: PayModePageComponent,
            },
        ]),
    ],
    entryComponents: [OrderDoneComponent],
    declarations: [PayModePageComponent, OrderDoneComponent],
})
export class PayModeModule {}
