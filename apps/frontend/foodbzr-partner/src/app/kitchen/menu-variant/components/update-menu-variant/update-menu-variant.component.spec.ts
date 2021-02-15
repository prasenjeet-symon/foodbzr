import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateMenuVariantComponent } from './update-menu-variant.component';

describe('UpdateMenuVariantComponent', () => {
    let component: UpdateMenuVariantComponent;
    let fixture: ComponentFixture<UpdateMenuVariantComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateMenuVariantComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(UpdateMenuVariantComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
