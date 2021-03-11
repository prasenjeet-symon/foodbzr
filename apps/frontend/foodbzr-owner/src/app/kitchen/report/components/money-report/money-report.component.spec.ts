import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MoneyReportComponent } from './money-report.component';

describe('MoneyReportComponent', () => {
    let component: MoneyReportComponent;
    let fixture: ComponentFixture<MoneyReportComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MoneyReportComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(MoneyReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
