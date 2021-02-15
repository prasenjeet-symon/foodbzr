import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PendingOrderPageComponent } from './pending-order-page.component';

describe('PendingOrderPageComponent', () => {
    let component: PendingOrderPageComponent;
    let fixture: ComponentFixture<PendingOrderPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PendingOrderPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(PendingOrderPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
