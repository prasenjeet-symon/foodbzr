import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../kitchen/kitchen/kitchen.module').then((m) => m.KitchenModule),
    },
    {
        path: 'kitchen-menu/:kitchen_row_uuid/:profile_picture',
        loadChildren: () => import('../kitchen/menu/menu.module').then((m) => m.MenuModule),
    },
    {
        path: 'kitchen-menu-variant/:menu_row_uuid/:menu_profile_picture',
        loadChildren: () => import('../kitchen/menu-variant/menu-variant.module').then((m) => m.MenuVariantModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab2PageRoutingModule {}
