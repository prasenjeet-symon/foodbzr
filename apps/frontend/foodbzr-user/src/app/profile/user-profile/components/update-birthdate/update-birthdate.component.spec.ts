import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateBirthdateComponent } from './update-birthdate.component';

describe('UpdateBirthdateComponent', () => {
    let component: UpdateBirthdateComponent;
    let fixture: ComponentFixture<UpdateBirthdateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateBirthdateComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateBirthdateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
