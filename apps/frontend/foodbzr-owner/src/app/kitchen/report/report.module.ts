import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReportPageComponent } from './report-page/report-page.component';
import { OrderReportComponent } from './components/order-report/order-report.component';
import { SumPositiveNumberPipe } from './pipes/sum-positive-number.pipe';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { MoneyReportComponent } from './components/money-report/money-report.component';
import { LoadingScreenService } from '../../loading-screen.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ReportPageComponent,
            },
        ]),
    ],
    providers: [LoadingScreenService],
    entryComponents: [DateRangeComponent],
    declarations: [ReportPageComponent, OrderReportComponent, SumPositiveNumberPipe, DateRangeComponent, MoneyReportComponent],
})
export class ReportModule {}
