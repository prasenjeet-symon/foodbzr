import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavKitchenPageComponent } from './fav-kitchen-page.component';

describe('FavKitchenPageComponent', () => {
    let component: FavKitchenPageComponent;
    let fixture: ComponentFixture<FavKitchenPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FavKitchenPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FavKitchenPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
