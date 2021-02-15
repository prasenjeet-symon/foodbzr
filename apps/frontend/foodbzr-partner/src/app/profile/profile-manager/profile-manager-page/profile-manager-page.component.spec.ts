import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileManagerPage } from './profile-manager-page.component';

describe('ProfileManagerPage', () => {
    let component: ProfileManagerPage;
    let fixture: ComponentFixture<ProfileManagerPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProfileManagerPage],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileManagerPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
