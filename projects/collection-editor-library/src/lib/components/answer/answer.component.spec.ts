import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerComponent } from './answer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AnswerComponent', () => {
  let component: AnswerComponent;
  let fixture: ComponentFixture<AnswerComponent>;
  let eventData =  {
    question: 'This is the multiple choice question',
    answer: "<p>Yes</p>",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnswerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.editorState = eventData;
    spyOn(component, 'editorDataHandler');
    component.ngOnInit();
    expect(component.editorDataHandler).toHaveBeenCalled();
  });
  it('should call editorDataHandler ', () => {
    spyOn(component, 'prepareAnwserData');
    const data = {
      answer: "<p>Yes</p>",
      editorState: { answer: "<p>Yes</p>" },
      name: "Subjective Question",
      primaryCategory: "Subjective Question",
      qType: "SA",
    };
    spyOn(component.editorDataOutput, 'emit').and.returnValue(data);
    component.editorDataHandler({ body: data.answer });
    expect(component.editorDataOutput.emit).toHaveBeenCalledWith({ body: undefined, mediaobj: undefined });
  });
  it('should call prepareAnwserData', () => {
    spyOn(component, 'prepareAnwserData');
    component.prepareAnwserData({body: eventData});
    expect(component.prepareAnwserData).toHaveBeenCalled();
  });
});
