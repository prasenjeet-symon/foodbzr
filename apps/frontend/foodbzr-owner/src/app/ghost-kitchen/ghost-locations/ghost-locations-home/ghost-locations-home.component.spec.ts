import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GhostLocationsHomeComponent } from './ghost-locations-home.component';

describe('GhostLocationsHomeComponent', () => {
    let component: GhostLocationsHomeComponent;
    let fixture: ComponentFixture<GhostLocationsHomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GhostLocationsHomeComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(GhostLocationsHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
