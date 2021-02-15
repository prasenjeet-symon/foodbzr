import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KitchenPageComponent } from './kitchen-page.component';

describe('KitchenPageComponent', () => {
    let component: KitchenPageComponent;
    let fixture: ComponentFixture<KitchenPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [KitchenPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(KitchenPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
