import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportPageComponent } from './report-page.component';

describe('ReportPageComponent', () => {
    let component: ReportPageComponent;
    let fixture: ComponentFixture<ReportPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReportPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(ReportPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
