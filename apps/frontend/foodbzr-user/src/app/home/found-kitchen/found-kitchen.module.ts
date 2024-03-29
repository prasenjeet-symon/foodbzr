import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicModule } from '@ionic/angular';
import { FcmService } from '../../fcm.service';
import { LoadingScreenService } from '../../loading-screen.service';
import { AskLocationComponent } from './components/ask-location/ask-location.component';
import { SearchLocationComponent } from './components/choose-location/choose-location.component';
import { FoundKitchenPageComponent } from './found-kitchen-page/found-kitchen-page.component';

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: FoundKitchenPageComponent,
            },
        ]),
    ],
    providers: [Geolocation, LoadingScreenService, FcmService],
    entryComponents: [AskLocationComponent, SearchLocationComponent],
    declarations: [FoundKitchenPageComponent, AskLocationComponent, SearchLocationComponent],
    exports: [],
})
export class FoundKitchenModule {}
