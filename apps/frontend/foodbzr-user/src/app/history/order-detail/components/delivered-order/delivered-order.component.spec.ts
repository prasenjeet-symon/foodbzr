import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeliveredOrderComponent } from './delivered-order.component';

describe('DeliveredOrderComponent', () => {
    let component: DeliveredOrderComponent;
    let fixture: ComponentFixture<DeliveredOrderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DeliveredOrderComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(DeliveredOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
