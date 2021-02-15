import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PendingOrderPageComponent } from './pending-order-page/pending-order-page.component';

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: PendingOrderPageComponent,
            },
        ]),
    ],
    declarations: [PendingOrderPageComponent],
    exports: [],
})
export class PendingOrderModule {}
