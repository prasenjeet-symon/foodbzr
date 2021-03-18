import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GhostBrandsHomeComponent } from './ghost-brands-home.component';

describe('GhostBrandsHomeComponent', () => {
    let component: GhostBrandsHomeComponent;
    let fixture: ComponentFixture<GhostBrandsHomeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GhostBrandsHomeComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(GhostBrandsHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
