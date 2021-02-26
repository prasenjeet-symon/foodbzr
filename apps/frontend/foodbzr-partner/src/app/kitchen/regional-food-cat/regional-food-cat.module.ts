import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddFoodCatComponent } from './components/add-food-cat/add-food-cat.component';
import { UpdateFoodCatComponent } from './components/update-food-cat/update-food-cat.component';
import { RegionalFoodCatPageComponent } from './regional-food-cat-page/regional-food-cat-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: RegionalFoodCatPageComponent,
            },
        ]),
    ],
    entryComponents: [AddFoodCatComponent, UpdateFoodCatComponent],
    declarations: [RegionalFoodCatPageComponent, AddFoodCatComponent, UpdateFoodCatComponent],
})
export class RegionalFoodCatModule {}
