import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CookingInstructionComponent } from './components/cooking-instruction/cooking-instruction.component';
import { FoodCartPageComponent } from './food-cart-page/food-cart-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: FoodCartPageComponent,
            },
        ]),
    ],
    entryComponents: [CookingInstructionComponent],
    declarations: [FoodCartPageComponent, CookingInstructionComponent],
    exports: [FoodCartPageComponent],
})
export class FoodCartModule {}
