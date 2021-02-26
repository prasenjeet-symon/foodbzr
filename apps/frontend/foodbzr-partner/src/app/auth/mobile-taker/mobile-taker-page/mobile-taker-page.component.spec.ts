import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileTakerPageComponent } from './mobile-taker-page.component';

describe('MobileTakerPageComponent', () => {
    let component: MobileTakerPageComponent;
    let fixture: ComponentFixture<MobileTakerPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MobileTakerPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(MobileTakerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
