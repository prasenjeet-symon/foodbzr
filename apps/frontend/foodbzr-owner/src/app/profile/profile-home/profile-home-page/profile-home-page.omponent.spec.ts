import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileHomePageComponent } from './profile-home-page.omponent';

describe('ProfileHomePageComponent', () => {
    let component: ProfileHomePageComponent;
    let fixture: ComponentFixture<ProfileHomePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProfileHomePageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileHomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
