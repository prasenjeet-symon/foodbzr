import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuPicsComponent } from './menu-pics.component';

describe('MenuPicsComponent', () => {
    let component: MenuPicsComponent;
    let fixture: ComponentFixture<MenuPicsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuPicsComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(MenuPicsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
