import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { InitDboyComponent } from './init-dboy.component';

describe('InitDboyComponent', () => {
    let component: InitDboyComponent;
    let fixture: ComponentFixture<InitDboyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InitDboyComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(InitDboyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
