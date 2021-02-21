import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UpdateBioComponent } from './components/update-bio/update-bio.component';
import { UpdateBirthdateComponent } from './components/update-birthdate/update-birthdate.component';
import { UpdateGenderComponent } from './components/update-gender/update-gender.component';
import { UpdateNameComponent } from './components/update-name/update-name.component';
import { UserProfilePageComponent } from './user-profile-page/user-profile-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: UserProfilePageComponent,
            },
        ]),
    ],
    entryComponents: [UpdateNameComponent, UpdateBioComponent, UpdateBirthdateComponent, UpdateGenderComponent],
    declarations: [UserProfilePageComponent, UpdateNameComponent, UpdateBioComponent, UpdateBirthdateComponent, UpdateGenderComponent],
})
export class UserProfileModule {}
