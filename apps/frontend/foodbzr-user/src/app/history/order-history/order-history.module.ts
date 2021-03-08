import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { DateRangeComponent } from './components/date-range/date-range.component';
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
    providers: [LoadingScreenService],
    declarations: [OrderHistoryPageComponent, DateRangeComponent],
})
export class OrderHistoryModule {}
