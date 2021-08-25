import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerDateComponent } from './answer-date.component';

describe('AnswerDateComponent', () => {
  let component: AnswerDateComponent;
  let fixture: ComponentFixture<AnswerDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
