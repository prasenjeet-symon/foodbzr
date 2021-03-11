import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { OnwayOrderComponent } from './onway-order.component';

describe('OnwayOrderComponent', () => {
    let component: OnwayOrderComponent;
    let fixture: ComponentFixture<OnwayOrderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OnwayOrderComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OnwayOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
