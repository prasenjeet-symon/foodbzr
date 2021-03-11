import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DboyItemComponent } from './dboy-item.component';

describe('DboyItemComponent', () => {
    let component: DboyItemComponent;
    let fixture: ComponentFixture<DboyItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DboyItemComponent],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(DboyItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
