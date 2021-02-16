import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddressPageComponent } from './address-page/address-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: AddressPageComponent,
            },
        ]),
    ],
    declarations: [AddressPageComponent],
    exports: [],
})
export class AddressModule {}
