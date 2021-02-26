import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateNameComponent } from './update-name.component';

describe('UpdateNameComponent', () => {
    let component: UpdateNameComponent;
    let fixture: ComponentFixture<UpdateNameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateNameComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
