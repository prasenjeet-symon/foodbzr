import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoundKitchenPageComponent } from './found-kitchen-page.component';

describe('FoundKitchenPageComponent', () => {
    let component: FoundKitchenPageComponent;
    let fixture: ComponentFixture<FoundKitchenPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FoundKitchenPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FoundKitchenPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
