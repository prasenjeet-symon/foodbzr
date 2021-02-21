import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../home/found-kitchen/found-kitchen.module').then((m) => m.FoundKitchenModule),
    },
    {
        path: 'kitchen/:kitchen_row_uuid/:profile_picture/:partner_row_uuid/:name',
        loadChildren: () => import('../home/kitchen/kitchen.module').then((m) => m.KitchenModule),
    },
    {
        path: 'kitchen_menus/:kitchen_row_uuid/:partner_row_uuid/:regional_food_category_row_uuid/:profile_picture',
        loadChildren: () => import('../home/menu/menu.module').then((m) => m.MenuModule),
    },
    {
        path: 'search',
        loadChildren: () => import('../home/search/search.module').then((m) => m.SearchModule),
    },
    {
        path: 'found_kitchen_menu/:menu_name',
        loadChildren: () => import('../home/found-kitchen-menu/found-kitchen-menu.module').then((m) => m.FoundKitchenMenuModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
