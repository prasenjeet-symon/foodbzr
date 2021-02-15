import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab3Page } from './tab3.page';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../profile/profile-manager/profile-manager.module').then((m) => m.ProfileManagerModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab3PageRoutingModule {}
