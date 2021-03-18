import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateCommissionComponent } from './update-commission.component';

describe('UpdateCommissionComponent', () => {
    let component: UpdateCommissionComponent;
    let fixture: ComponentFixture<UpdateCommissionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateCommissionComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateCommissionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
