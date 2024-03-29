import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PendingOrderComponent } from './pending-order.component';

describe('PendingOrderComponent', () => {
    let component: PendingOrderComponent;
    let fixture: ComponentFixture<PendingOrderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PendingOrderComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(PendingOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
