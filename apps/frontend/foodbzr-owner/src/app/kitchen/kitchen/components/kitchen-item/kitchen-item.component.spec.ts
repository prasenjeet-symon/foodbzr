import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KitchenItemComponent } from './kitchen-item.component';

describe('KitchenItemComponent', () => {
    let component: KitchenItemComponent;
    let fixture: ComponentFixture<KitchenItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [KitchenItemComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(KitchenItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
