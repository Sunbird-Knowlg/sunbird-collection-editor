import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionOptionSubMenuComponent } from './question-option-sub-menu.component';

describe('QuestionOptionSubMenuComponent', () => {
  let component: QuestionOptionSubMenuComponent;
  let fixture: ComponentFixture<QuestionOptionSubMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionOptionSubMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionOptionSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
