import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { SearchHomePageComponent } from './search-home-page/search-home-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: SearchHomePageComponent,
            },
        ]),
    ],
    entryComponents: [OrderDetailComponent],
    declarations: [SearchHomePageComponent, OrderDetailComponent],
})
export class SearchHomeModule {}
