import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProfileHomePageComponent } from './profile-home-page/profile-home-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProfileHomePageComponent,
            },
        ]),
    ],
    declarations: [ProfileHomePageComponent],
    exports: [ProfileHomePageComponent],
})
export class ProfileHomeModule {}
