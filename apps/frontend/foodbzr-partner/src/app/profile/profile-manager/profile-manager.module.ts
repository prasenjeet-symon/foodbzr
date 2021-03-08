import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { UpdateBioComponent } from './components/update-bio/update-bio.component';
import { UpdateGenderComponent } from './components/update-gender/update-gender.component';
import { UpdateNameComponent } from './components/update-name/update-name.component';
import { ProfileManagerPage } from './profile-manager-page/profile-manager-page.component';

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProfileManagerPage,
            },
        ]),
    ],
    entryComponents: [UpdateBioComponent, UpdateNameComponent, UpdateGenderComponent],
    declarations: [ProfileManagerPage, UpdateBioComponent, UpdateNameComponent, UpdateGenderComponent],
    providers: [LoadingScreenService],
})
export class ProfileManagerModule {}
