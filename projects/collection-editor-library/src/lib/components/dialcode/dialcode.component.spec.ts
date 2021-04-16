import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialcodeComponent } from './dialcode.component';

describe('DialcodeComponent', () => {
  let component: DialcodeComponent;
  let fixture: ComponentFixture<DialcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
