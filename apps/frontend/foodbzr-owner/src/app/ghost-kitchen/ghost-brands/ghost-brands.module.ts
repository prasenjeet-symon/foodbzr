import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { weekMakerPipe } from './pipes/week-maker.pipe';
import { GhostBrandsHomeComponent } from './ghost-brands-home/ghost-brands-home.component';

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: GhostBrandsHomeComponent,
            },
        ]),
    ],
    declarations: [GhostBrandsHomeComponent, weekMakerPipe],
    exports: [],
})
export class GhostBrandsHomeModule {}
