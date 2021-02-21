import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../history/order-history/order-history.module').then((m) => m.OrderHistoryModule),
    },
    {
        path: 'details/:order_row_uuid',
        loadChildren: () => import('../history/order-detail/order-detail.module').then((m) => m.OrderDetailModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab3PageRoutingModule {}
