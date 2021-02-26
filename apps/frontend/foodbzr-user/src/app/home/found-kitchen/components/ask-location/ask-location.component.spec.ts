import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AskLocationComponent } from './ask-location.component';

describe('AskLocationComponent', () => {
    let component: AskLocationComponent;
    let fixture: ComponentFixture<AskLocationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AskLocationComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(AskLocationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
