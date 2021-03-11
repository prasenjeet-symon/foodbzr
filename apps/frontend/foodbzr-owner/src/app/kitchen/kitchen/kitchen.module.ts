import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { CreateKitchenComponent } from './components/create-kitchen/create-kitchen.component';
import { KitchenItemComponent } from './components/kitchen-item/kitchen-item.component';
import { KitchenMoreMenuComponent } from './components/kitchen-more-menu/kitchen-more-menu.component';
import { SearchLocationComponent } from './components/search-location/search-location.component';
import { UpdateKitchenComponent } from './components/update-kitchen/update-kitchen.component';
import { KitchenPageComponent } from './kitchen-page/kitchen-page.component';
import { weekMakerPipe } from './pipes/week-maker.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: KitchenPageComponent,
            },
        ]),
    ],
    providers: [LoadingScreenService, Geolocation],
    entryComponents: [CreateKitchenComponent, UpdateKitchenComponent, SearchLocationComponent, KitchenMoreMenuComponent],
    declarations: [KitchenPageComponent, CreateKitchenComponent, UpdateKitchenComponent, KitchenItemComponent, weekMakerPipe, SearchLocationComponent, KitchenMoreMenuComponent],
})
export class KitchenModule {}
