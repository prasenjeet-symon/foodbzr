import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderLocationComponent } from './order-location.component';

describe('OrderLocationComponent', () => {
    let component: OrderLocationComponent;
    let fixture: ComponentFixture<OrderLocationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrderLocationComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
