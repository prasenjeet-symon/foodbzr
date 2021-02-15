import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateKitchenComponent } from './update-kitchen.component';

describe('UpdateKitchenComponent', () => {
    let component: UpdateKitchenComponent;
    let fixture: ComponentFixture<UpdateKitchenComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateKitchenComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateKitchenComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
