import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateGhostLocationComponent } from './update-ghost-location.component';

describe('UpdateGhostLocationComponent', () => {
    let component: UpdateGhostLocationComponent;
    let fixture: ComponentFixture<UpdateGhostLocationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateGhostLocationComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateGhostLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
