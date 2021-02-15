import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
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
    declarations: [FoundKitchenPageComponent],
    exports: [],
})
export class FoundKitchenModule {}
