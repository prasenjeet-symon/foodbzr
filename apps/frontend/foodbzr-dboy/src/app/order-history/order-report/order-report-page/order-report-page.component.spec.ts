import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderReportPageComponent } from './order-report-page.component';

describe('OrderReportPageComponent', () => {
    let component: OrderReportPageComponent;
    let fixture: ComponentFixture<OrderReportPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrderReportPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderReportPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
