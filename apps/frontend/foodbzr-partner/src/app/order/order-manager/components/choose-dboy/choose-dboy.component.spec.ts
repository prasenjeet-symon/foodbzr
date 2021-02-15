import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseDboyComponent } from './choose-dboy.component';

describe('ChooseDboyComponent', () => {
    let component: ChooseDboyComponent;
    let fixture: ComponentFixture<ChooseDboyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChooseDboyComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(ChooseDboyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
