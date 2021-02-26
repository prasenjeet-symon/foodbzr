import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddFoodCatComponent } from './add-food-cat.component';

describe('AddFoodCatComponent', () => {
    let component: AddFoodCatComponent;
    let fixture: ComponentFixture<AddFoodCatComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddFoodCatComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(AddFoodCatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
