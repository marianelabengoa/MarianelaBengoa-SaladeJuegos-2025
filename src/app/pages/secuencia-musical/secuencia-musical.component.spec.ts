import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuenciaMusicalComponent } from './secuencia-musical.component';
 
describe('SecuenciaMusicalComponent', () => {
  let component: SecuenciaMusicalComponent;
  let fixture: ComponentFixture<SecuenciaMusicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuenciaMusicalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuenciaMusicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
