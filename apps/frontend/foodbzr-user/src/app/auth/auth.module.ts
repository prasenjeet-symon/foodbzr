import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                loadChildren: () => import('./mobile-taker/mobile-taker.module').then((m) => m.MobileTakerModule),
            },
            {
                path: 'otp/:user_row_uuid/:mobile_number',
                loadChildren: () => import('./otp-taker/otp-taker.module').then((m) => m.OtpTakerModule),
            },
        ]),
    ],
    declarations: [],
})
export class AuthModule {}
