import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodCartPageComponent } from './food-cart-page.component';

describe('FoodCartPageComponent', () => {
    let component: FoodCartPageComponent;
    let fixture: ComponentFixture<FoodCartPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FoodCartPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FoodCartPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
