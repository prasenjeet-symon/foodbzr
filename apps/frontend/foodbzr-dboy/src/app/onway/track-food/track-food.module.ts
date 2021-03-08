import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { DeliverNowComponent } from './components/deliver-now/deliver-now.component';
import { DeliveredSuccessComponent } from './components/delivered-success/delivered-success.component';
import { TrackFoodPageComponent } from './track-food-page/track-food-page.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: TrackFoodPageComponent,
            },
        ]),
    ],
    declarations: [TrackFoodPageComponent, DeliverNowComponent, DeliveredSuccessComponent],
    entryComponents: [DeliverNowComponent, DeliveredSuccessComponent],
    providers: [LoadingScreenService, CallNumber],
})
export class TrackFoodModule {}
