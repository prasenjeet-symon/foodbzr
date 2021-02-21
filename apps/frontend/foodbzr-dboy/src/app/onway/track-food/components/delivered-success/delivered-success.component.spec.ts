import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeliveredSuccessComponent } from './delivered-success.component';

describe('DeliveredSuccessComponent', () => {
    let component: DeliveredSuccessComponent;
    let fixture: ComponentFixture<DeliveredSuccessComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DeliveredSuccessComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(DeliveredSuccessComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
