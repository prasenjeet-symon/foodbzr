import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ChoosePartnerComponent } from './components/choose-partner/choose-partner.component';
import { GhostLocationsHomeComponent } from './ghost-locations-home/ghost-locations-home.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: GhostLocationsHomeComponent,
            },
        ]),
    ],
    declarations: [GhostLocationsHomeComponent, ChoosePartnerComponent],
})
export class GhostLocationsModule {
    constructor() {}
}
