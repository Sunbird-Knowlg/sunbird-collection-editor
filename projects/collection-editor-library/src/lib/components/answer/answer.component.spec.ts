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
  it('#ngOnInit() should call editorDataHandler on ngOnInit', () => {
    component.editorState = eventData;
    spyOn(component, 'editorDataHandler');
    component.ngOnInit();
    expect(component.editorDataHandler).toHaveBeenCalled();
  });
  it('#editorDataHandler() should call editorDataHandler and emit propfer question metadata', () => {
    spyOn(component.editorDataOutput, 'emit');
    const data = {
      answer: "<p>Yes</p>",
      editorState: { answer: "<p>Yes</p>" },
      name: "Subjective Question",
      primaryCategory: "Subjective Question",
      qType: "SA",
    };
    const metaData =  component.prepareAnwserData(data);
    component.editorDataHandler(data);
    expect(component.editorDataOutput.emit).toHaveBeenCalledWith({ body: metaData, mediaobj: undefined });
  });
  it('#prepareAnwserData() should call prepareAnwserData and prepare profer answer data', () => {
    const questionBody = {
      answer: "<p>Yes</p>",
      editorState: { answer: "<p>Yes</p>" },
      name: "Subjective Question",
      primaryCategory: "Subjective Question",
      qType: "SA",
    };
    const data = component.prepareAnwserData({body: eventData.answer});
    expect(data).toEqual(questionBody);
  });
});
