import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateMenuComponent } from './update-menu.component';

describe('UpdateMenuComponent', () => {
    let component: UpdateMenuComponent;
    let fixture: ComponentFixture<UpdateMenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateMenuComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
