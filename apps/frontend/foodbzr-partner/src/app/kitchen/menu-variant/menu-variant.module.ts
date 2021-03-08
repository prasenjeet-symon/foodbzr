import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { AddReviewComponent } from './components/add-review/add-review.component';
import { CreateMenuVariantComponent } from './components/create-menu-variant/create-menu-variant.component';
import { FoodPictureComponent } from './components/food-picture/food-picture.component';
import { FoodReviewComponent } from './components/food-review/food-review.component';
import { MenuVariantComponent } from './components/menu-variant/menu-variant.component';
import { UpdateMenuVariantComponent } from './components/update-menu-variant/update-menu-variant.component';
import { MenuVariantPageComponent } from './menu-variant-page/menu-variant-page.component';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenuVariantPageComponent,
            },
        ]),
    ],
    entryComponents: [UpdateMenuVariantComponent, CreateMenuVariantComponent, AddReviewComponent],
    providers: [PhotoViewer, LoadingScreenService, ImagePicker],
    declarations: [MenuVariantPageComponent, FoodReviewComponent, FoodPictureComponent, MenuVariantComponent, CreateMenuVariantComponent, UpdateMenuVariantComponent, AddReviewComponent],
})
export class MenuVariantModule {}
