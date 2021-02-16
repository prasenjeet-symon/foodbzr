import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PayModePageComponent } from './pay-mode-page.component';

describe('PayModePageComponent', () => {
    let component: PayModePageComponent;
    let fixture: ComponentFixture<PayModePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PayModePageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(PayModePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
