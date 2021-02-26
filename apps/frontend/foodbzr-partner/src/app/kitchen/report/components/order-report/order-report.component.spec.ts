import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderReportComponent } from './order-report.component';

describe('OrderReportComponent', () => {
    let component: OrderReportComponent;
    let fixture: ComponentFixture<OrderReportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrderReportComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
