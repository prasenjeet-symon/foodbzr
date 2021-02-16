import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderHistoryPageComponent } from './order-history-page/order-history-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: OrderHistoryPageComponent,
            },
        ]),
    ],
    declarations: [OrderHistoryPageComponent],
})
export class OrderHistoryModule {}
