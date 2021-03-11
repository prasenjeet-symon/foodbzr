import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateMenuVariantComponent } from './create-menu-variant.component';

describe('CreateMenuVariantComponent', () => {
  let component: CreateMenuVariantComponent;
  let fixture: ComponentFixture<CreateMenuVariantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMenuVariantComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMenuVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
