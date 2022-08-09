import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityParamsModalComponent } from './quality-params-modal.component';

describe('QualityParamsModalComponent', () => {
  let component: QualityParamsModalComponent;
  let fixture: ComponentFixture<QualityParamsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityParamsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityParamsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
