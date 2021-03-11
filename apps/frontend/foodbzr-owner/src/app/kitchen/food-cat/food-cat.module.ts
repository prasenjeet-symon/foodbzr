import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { AddFoodCatComponent } from './components/add-food-cat/add-food-cat.component';
import { UpdateFoodCatComponent } from './components/update-food-cat/update-food-cat.component';
import { FoodCatPageComponent } from './food-cat-page/food-cat-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: FoodCatPageComponent,
            },
        ]),
    ],
    entryComponents: [AddFoodCatComponent, UpdateFoodCatComponent],
    declarations: [FoodCatPageComponent, AddFoodCatComponent, UpdateFoodCatComponent],
    providers: [LoadingScreenService],
})
export class FoodCatModule {}
