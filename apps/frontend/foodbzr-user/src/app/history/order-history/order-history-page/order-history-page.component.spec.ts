import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderHistoryPageComponent } from './order-history-page.component';

describe('OrderHistoryPageComponent', () => {
    let component: OrderHistoryPageComponent;
    let fixture: ComponentFixture<OrderHistoryPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrderHistoryPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderHistoryPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
