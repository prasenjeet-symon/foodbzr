import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuVariantPageComponent } from './menu-variant-page.component';

describe('MenuVariantPageComponent', () => {
    let component: MenuVariantPageComponent;
    let fixture: ComponentFixture<MenuVariantPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuVariantPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(MenuVariantPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
