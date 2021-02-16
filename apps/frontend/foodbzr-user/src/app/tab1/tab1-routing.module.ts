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
    {
        path: 'kitchen-menus',
        loadChildren: () => import('../home/menu/menu.module').then((m) => m.MenuModule),
    },
    {
        path: 'search',
        loadChildren: () => import('../home/search/search.module').then((m) => m.SearchModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
