import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
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
    declarations: [TrackFoodPageComponent],
    exports: [],
    entryComponents: [],
})
export class TrackFoodModule {}
