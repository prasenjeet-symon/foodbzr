import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateGenderComponent } from './update-gender.component';

describe('UpdateGenderComponent', () => {
    let component: UpdateGenderComponent;
    let fixture: ComponentFixture<UpdateGenderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateGenderComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateGenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
