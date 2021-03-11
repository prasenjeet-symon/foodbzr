import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../partner/partner-manager/partner-manager.module').then((m) => m.PartnerManagerModule),
    },
    {
        path: 'report-partner/:partner_row_uuid/:commission',
        loadChildren: () => import('../partner/partner-report/partner-report.module').then((m) => m.PartnerReportModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
