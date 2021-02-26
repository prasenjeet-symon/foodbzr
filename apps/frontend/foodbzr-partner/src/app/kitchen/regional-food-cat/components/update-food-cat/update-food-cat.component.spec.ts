import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateFoodCatComponent } from './update-food-cat.component';

describe('UpdateFoodCatComponent', () => {
    let component: UpdateFoodCatComponent;
    let fixture: ComponentFixture<UpdateFoodCatComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateFoodCatComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateFoodCatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
