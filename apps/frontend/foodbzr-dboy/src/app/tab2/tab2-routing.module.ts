import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../onway/track-food/track-food.module').then((m) => m.TrackFoodModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab2PageRoutingModule {}
