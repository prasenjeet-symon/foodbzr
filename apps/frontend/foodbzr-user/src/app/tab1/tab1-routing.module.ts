import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../home/found-kitchen/found-kitchen.module').then((m) => m.FoundKitchenModule),
    },
    {
        path: 'kitchen',
        loadChildren: () => import('../home/kitchen/kitchen.module').then((m) => m.KitchenModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
