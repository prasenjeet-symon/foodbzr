import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UpdateBioComponent } from './components/update-bio/update-bio.component';
import { UpdateGenderComponent } from './components/update-gender/update-gender.component';
import { UpdateNameComponent } from './components/update-name/update-name.component';
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
    entryComponents: [UpdateBioComponent, UpdateNameComponent, UpdateGenderComponent],
    declarations: [ProfileHomePageComponent, UpdateBioComponent, UpdateNameComponent, UpdateGenderComponent],
})
export class ProfileHomeModule {}
