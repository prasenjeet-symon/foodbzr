import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../order/order-manager/order-manager.module').then((m) => m.OrderManagerModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
