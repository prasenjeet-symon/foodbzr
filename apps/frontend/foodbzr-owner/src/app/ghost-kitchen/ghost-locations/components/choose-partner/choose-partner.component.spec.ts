import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChoosePartnerComponent } from './choose-partner.component';

describe('ChoosePartnerComponent', () => {
    let component: ChoosePartnerComponent;
    let fixture: ComponentFixture<ChoosePartnerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChoosePartnerComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(ChoosePartnerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
