import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommissionReportComponent } from './components/commission-report/commission-report.component';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { MoneyReportComponent } from './components/money-report/money-report.component';
import { OrderReportComponent } from './components/order-report/order-report.component';
import { PartnerReportPageComponent } from './partner-report-page/partner-report-page.component';
import { SumPositiveNumberPipe } from './pipes/sum-positive-number.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: PartnerReportPageComponent,
            },
        ]),
    ],
    entryComponents:[DateRangeComponent],
    declarations: [PartnerReportPageComponent, DateRangeComponent, CommissionReportComponent, MoneyReportComponent, OrderReportComponent, SumPositiveNumberPipe],
})
export class PartnerReportModule {}
