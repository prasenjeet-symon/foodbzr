import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoundKitchenMenuPageComponent } from './found-kitchen-menu-page.component';

describe('FoundKitchenMenuPageComponent', () => {
    let component: FoundKitchenMenuPageComponent;
    let fixture: ComponentFixture<FoundKitchenMenuPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FoundKitchenMenuPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FoundKitchenMenuPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
