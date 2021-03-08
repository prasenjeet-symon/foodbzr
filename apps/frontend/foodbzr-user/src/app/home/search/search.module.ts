import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';
import { CommonModule } from '@angular/common';
import { LoadingScreenService } from '../../loading-screen.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: SearchPageComponent,
            },
        ]),
    ],
    declarations: [SearchPageComponent],
    providers: [LoadingScreenService],
})
export class SearchModule {}
