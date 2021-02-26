import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MobileTakerPageComponent } from './mobile-taker-page/mobile-taker-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: MobileTakerPageComponent,
            },
        ]),
    ],
    declarations: [MobileTakerPageComponent],
})
export class MobileTakerModule {}
