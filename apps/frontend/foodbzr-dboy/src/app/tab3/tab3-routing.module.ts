import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../profile/profile-home/profile-home.module').then((m) => m.ProfileHomeModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Tab3PageRoutingModule {}
