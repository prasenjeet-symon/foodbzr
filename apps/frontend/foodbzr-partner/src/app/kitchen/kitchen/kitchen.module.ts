import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitchenPageComponent } from './kitchen-page/kitchen-page.component';
import { KitchenItemComponent } from './components/kitchen-item/kitchen-item.component';
import { RouterModule } from '@angular/router';
import { CreateKitchenComponent } from './components/create-kitchen/create-kitchen.component';
import { UpdateKitchenComponent } from './components/update-kitchen/update-kitchen.component';
import { weekMakerPipe } from './pipes/week-maker.pipe';
import { SearchLocationComponent } from './components/search-location/search-location.component';

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
    providers: [],
    entryComponents: [CreateKitchenComponent, UpdateKitchenComponent, SearchLocationComponent],
    declarations: [KitchenPageComponent, CreateKitchenComponent, UpdateKitchenComponent, KitchenItemComponent, weekMakerPipe, SearchLocationComponent],
})
export class KitchenModule {}
