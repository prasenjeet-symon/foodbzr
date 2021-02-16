import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddToCartComponent } from './add-to-cart.component';

describe('AddToCartComponent', () => {
    let component: AddToCartComponent;
    let fixture: ComponentFixture<AddToCartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddToCartComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(AddToCartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
