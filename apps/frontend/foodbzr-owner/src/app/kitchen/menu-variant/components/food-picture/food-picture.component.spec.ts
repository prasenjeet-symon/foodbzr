import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodPictureComponent } from './food-picture.component';

describe('FoodPictureComponent', () => {
    let component: FoodPictureComponent;
    let fixture: ComponentFixture<FoodPictureComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FoodPictureComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FoodPictureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
