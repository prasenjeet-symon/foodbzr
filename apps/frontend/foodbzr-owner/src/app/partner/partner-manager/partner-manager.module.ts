import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PartnerManagerPageComponent } from './partner-manager-page/partner-manager-page.component';
import {UpdateCommisionComponent} from './components/update-commission/update-commission.component'
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: PartnerManagerPageComponent,
            },
        ]),
    ],
    entryComponents:[UpdateCommisionComponent],
    declarations: [PartnerManagerPageComponent, UpdateCommisionComponent],
})
export class PartnerManagerModule {}
