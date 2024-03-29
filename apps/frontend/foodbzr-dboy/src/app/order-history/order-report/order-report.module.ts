import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { OrderReportPageComponent } from './order-report-page/order-report-page.component';
import { SumPositiveNumberPipe } from './pipes/sum-positive-number.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: OrderReportPageComponent,
            },
        ]),
    ],
    declarations: [OrderReportPageComponent, SumPositiveNumberPipe, DateRangeComponent],
    entryComponents: [DateRangeComponent],
    providers: [LoadingScreenService],
})
export class OrderReportModule {}
