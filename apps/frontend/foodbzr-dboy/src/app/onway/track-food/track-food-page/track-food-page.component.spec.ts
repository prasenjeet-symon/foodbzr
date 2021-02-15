import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TrackFoodPageComponent } from './track-food-page.component';

describe('TrackFoodPageComponent', () => {
    let component: TrackFoodPageComponent;
    let fixture: ComponentFixture<TrackFoodPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackFoodPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(TrackFoodPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
