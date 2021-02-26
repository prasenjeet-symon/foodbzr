import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommissionReportComponent } from './commission-report.component';

describe('CommissionReportComponent', () => {
    let component: CommissionReportComponent;
    let fixture: ComponentFixture<CommissionReportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommissionReportComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(CommissionReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
