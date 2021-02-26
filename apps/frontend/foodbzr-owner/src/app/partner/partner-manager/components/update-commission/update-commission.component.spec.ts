import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateCommisionComponent } from './update-commission.component';

describe('UpdateCommisionComponent', () => {
    let component: UpdateCommisionComponent;
    let fixture: ComponentFixture<UpdateCommisionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateCommisionComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateCommisionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
