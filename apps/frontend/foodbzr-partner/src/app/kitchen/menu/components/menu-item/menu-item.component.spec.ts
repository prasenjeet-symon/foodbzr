import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuItemComponent } from './menu-item.component';

describe('MenuItemComponent', () => {
    let component: MenuItemComponent;
    let fixture: ComponentFixture<MenuItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuItemComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(MenuItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
