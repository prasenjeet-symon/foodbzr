import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CookingInstructionComponent } from './cooking-instruction.component';

describe('CookingInstructionComponent', () => {
    let component: CookingInstructionComponent;
    let fixture: ComponentFixture<CookingInstructionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CookingInstructionComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(CookingInstructionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
