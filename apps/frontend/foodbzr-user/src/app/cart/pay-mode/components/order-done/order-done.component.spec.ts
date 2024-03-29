import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderDoneComponent } from './order-done.component';

describe('OrderDoneComponent', () => {
    let component: OrderDoneComponent;
    let fixture: ComponentFixture<OrderDoneComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrderDoneComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderDoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
