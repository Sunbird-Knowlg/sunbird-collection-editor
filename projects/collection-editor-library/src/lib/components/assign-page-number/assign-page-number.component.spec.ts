import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPageNumberComponent } from './assign-page-number.component';

describe('AssignPageNumberComponent', () => {
  let component: AssignPageNumberComponent;
  let fixture: ComponentFixture<AssignPageNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPageNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPageNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
