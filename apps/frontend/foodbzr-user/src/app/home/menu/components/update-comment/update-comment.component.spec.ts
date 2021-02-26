import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateCommentComponent } from './update-comment.component';

describe('UpdateCommentComponent', () => {
    let component: UpdateCommentComponent;
    let fixture: ComponentFixture<UpdateCommentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateCommentComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateCommentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
