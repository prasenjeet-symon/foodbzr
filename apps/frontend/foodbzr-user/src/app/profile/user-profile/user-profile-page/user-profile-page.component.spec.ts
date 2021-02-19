import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserProfilePageComponent } from './user-profile-page.component';

describe('UserProfilePageComponent', () => {
    let component: UserProfilePageComponent;
    let fixture: ComponentFixture<UserProfilePageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserProfilePageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UserProfilePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
