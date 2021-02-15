import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../orders/pending-order/pending-order.module').then((m) => m.PendingOrderModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
