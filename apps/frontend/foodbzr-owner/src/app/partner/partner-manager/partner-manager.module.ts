import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonicModule } from '@ionic/angular';
import { FcmService } from '../../fcm.service';
import { LoadingScreenService } from '../../loading-screen.service';
import { UpdateCommisionComponent } from './components/update-commission/update-commission.component';
import { PartnerManagerPageComponent } from './partner-manager-page/partner-manager-page.component';

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
    providers: [FcmService, LoadingScreenService, CallNumber],
    entryComponents: [UpdateCommisionComponent],
    declarations: [PartnerManagerPageComponent, UpdateCommisionComponent],
})
export class PartnerManagerModule {}
