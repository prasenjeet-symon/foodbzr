import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../cart/food-cart/food-cart.module').then((m) => m.FoodCartModule),
    },
    {
        path: 'address/:kitchen_row_uuid',
        loadChildren: () => import('../cart/address/address.module').then((m) => m.AddressModule),
    },
    {
        path: 'pay_mode/:kitchen_row_uuid/:delivery_address_row_uuid',
        loadChildren: () => import('../cart/pay-mode/pay-mode.module').then((m) => m.PayModeModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab2PageRoutingModule {}
