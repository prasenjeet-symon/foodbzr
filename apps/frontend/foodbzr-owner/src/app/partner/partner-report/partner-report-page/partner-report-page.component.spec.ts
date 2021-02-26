import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PartnerReportPageComponent } from './partner-report-page.component';

describe('PartnerReportPageComponent', () => {
    let component: PartnerReportPageComponent;
    let fixture: ComponentFixture<PartnerReportPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PartnerReportPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(PartnerReportPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
