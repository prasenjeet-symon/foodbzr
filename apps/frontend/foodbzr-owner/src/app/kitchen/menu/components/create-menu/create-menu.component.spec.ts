import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMenuComponent } from './create-menu.component';

describe('CreateMenuComponent', () => {
    let component: CreateMenuComponent;
    let fixture: ComponentFixture<CreateMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateMenuComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
