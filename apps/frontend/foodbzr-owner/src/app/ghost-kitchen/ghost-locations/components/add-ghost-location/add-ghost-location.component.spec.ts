import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddGhostLocationComponent } from './add-ghost-location.component';

describe('AddGhostLocationComponent', () => {
    let component: AddGhostLocationComponent;
    let fixture: ComponentFixture<AddGhostLocationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddGhostLocationComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(AddGhostLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
