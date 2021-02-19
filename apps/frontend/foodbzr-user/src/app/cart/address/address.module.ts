import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddressPageComponent } from './address-page/address-page.component';
import { SearchLocationComponent } from './components/choose-location/choose-location.component';

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
    entryComponents: [SearchLocationComponent],
    declarations: [AddressPageComponent, SearchLocationComponent],
    exports: [],
})
export class AddressModule {}
