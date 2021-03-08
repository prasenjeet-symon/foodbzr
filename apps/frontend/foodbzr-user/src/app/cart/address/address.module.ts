import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
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
    providers: [NativeGeocoder, LoadingScreenService],
    entryComponents: [SearchLocationComponent],
    declarations: [AddressPageComponent, SearchLocationComponent],
    exports: [],
})
export class AddressModule {}
