import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CanceledOrderComponent } from './canceled-order.component';

describe('CanceledOrderComponent', () => {
    let component: CanceledOrderComponent;
    let fixture: ComponentFixture<CanceledOrderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CanceledOrderComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(CanceledOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
