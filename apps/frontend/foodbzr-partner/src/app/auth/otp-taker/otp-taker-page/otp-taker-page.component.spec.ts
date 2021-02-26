import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtpTakerPageComponent } from './otp-taker-page.component';

describe('OtpTakerPageComponent', () => {
    let component: OtpTakerPageComponent;
    let fixture: ComponentFixture<OtpTakerPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OtpTakerPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OtpTakerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
