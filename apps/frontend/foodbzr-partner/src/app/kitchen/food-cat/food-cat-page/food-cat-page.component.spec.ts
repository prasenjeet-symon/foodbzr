import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodCatPageComponent } from './food-cat-page.component';

describe('FoodCatPageComponent', () => {
    let component: FoodCatPageComponent;
    let fixture: ComponentFixture<FoodCatPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FoodCatPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FoodCatPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
