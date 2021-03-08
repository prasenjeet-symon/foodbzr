import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { OtpTakerPageComponent } from './otp-taker-page/otp-taker-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: OtpTakerPageComponent,
            },
        ]),
    ],
    declarations: [OtpTakerPageComponent],
    providers: [LoadingScreenService],
})
export class OtpTakerModule {}
