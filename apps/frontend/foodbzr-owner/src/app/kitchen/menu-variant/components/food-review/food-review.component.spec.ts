import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodReviewComponent } from './food-review.component';

describe('FoodReviewComponent', () => {
    let component: FoodReviewComponent;
    let fixture: ComponentFixture<FoodReviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FoodReviewComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FoodReviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
