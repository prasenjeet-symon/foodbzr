import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderManagerPageComponent } from './order-manager-page.component';

describe('OrderManagerPageComponent', () => {
    let component: OrderManagerPageComponent;
    let fixture: ComponentFixture<OrderManagerPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrderManagerPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderManagerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
