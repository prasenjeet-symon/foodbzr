import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
    },
    {
        path: 'ghost_brands',
        loadChildren: () => import('./ghost-kitchen/ghost-brands/ghost-brands.module').then((m) => m.GhostBrandsHomeModule),
    },
    {
        path: 'ghost_brand_locations/:kitchen_row_uuid',
        loadChildren: () => import('./ghost-kitchen/ghost-locations/ghost-locations.module').then((m) => m.GhostLocationsModule),
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
