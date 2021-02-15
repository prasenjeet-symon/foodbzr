import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuVariantComponent } from './menu-variant.component';

describe('MenuVariantComponent', () => {
    let component: MenuVariantComponent;
    let fixture: ComponentFixture<MenuVariantComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuVariantComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(MenuVariantComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
