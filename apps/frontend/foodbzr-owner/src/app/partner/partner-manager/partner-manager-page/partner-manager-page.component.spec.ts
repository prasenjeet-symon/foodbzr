import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PartnerManagerPageComponent } from './partner-manager-page.component';

describe('PartnerManagerPageComponent', () => {
    let component: PartnerManagerPageComponent;
    let fixture: ComponentFixture<PartnerManagerPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PartnerManagerPageComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(PartnerManagerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
