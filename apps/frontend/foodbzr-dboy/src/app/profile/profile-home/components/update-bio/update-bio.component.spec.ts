import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateBioComponent } from './update-bio.component';

describe('UpdateBioComponent', () => {
    let component: UpdateBioComponent;
    let fixture: ComponentFixture<UpdateBioComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateBioComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateBioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
