import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegionalFoodCatPageComponent } from './regional-food-cat-page.component';

describe('RegionalFoodCatPageComponent', () => {
    let component: RegionalFoodCatPageComponent;
    let fixture: ComponentFixture<RegionalFoodCatPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegionalFoodCatPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(RegionalFoodCatPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
