import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoadingScreenService } from '../../loading-screen.service';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { AddToCartComponent } from './components/add-to-cart/add-to-cart.component';
import { CommentsComponent } from './components/comments/comments.component';
import { MenuPicsComponent } from './components/menu-pics/menu-pics.component';
import { UpdateCommentComponent } from './components/update-comment/update-comment.component';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: MenuPageComponent,
            },
        ]),
    ],
    providers: [LoadingScreenService, PhotoViewer],
    entryComponents: [AddToCartComponent, MenuPicsComponent, CommentsComponent, AddCommentComponent, UpdateCommentComponent],
    declarations: [MenuPageComponent, AddToCartComponent, MenuPicsComponent, CommentsComponent, AddCommentComponent, UpdateCommentComponent],
    exports: [MenuPageComponent],
})
export class MenuModule {}
