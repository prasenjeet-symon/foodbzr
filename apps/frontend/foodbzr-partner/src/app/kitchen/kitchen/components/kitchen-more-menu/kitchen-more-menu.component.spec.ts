import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KitchenMoreMenuComponent } from './kitchen-more-menu.component';

describe('KitchenMoreMenuComponent', () => {
    let component: KitchenMoreMenuComponent;
    let fixture: ComponentFixture<KitchenMoreMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [KitchenMoreMenuComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(KitchenMoreMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
