import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DateRangeComponent } from './date-range.component';

describe('DateRangeComponent', () => {
    let component: DateRangeComponent;
    let fixture: ComponentFixture<DateRangeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DateRangeComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(DateRangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
