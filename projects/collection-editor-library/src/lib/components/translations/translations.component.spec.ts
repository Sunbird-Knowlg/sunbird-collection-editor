import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationsComponent } from './translations.component';
import { mockData } from './translations.component.spec.data';

describe('TranslationsComponent', () => {
  let component: TranslationsComponent;
  let fixture: ComponentFixture<TranslationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranslationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationsComponent);
    component = fixture.componentInstance;
    component.editorState = mockData.editorState;
    component.editorState.solutions=mockData.editorState;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#editorDataHandler() should call editorDataHandler for question', () => {
    component.editorState = mockData.editorState;
    component.editorState.question=mockData.editorState;
    component.editorDataHandler(mockData.eventData, 'question');
    expect(component.editorState).toBeDefined();
  });
  it('#editorDataHandler() should call editorDataHandler for solution', () => {
    spyOn(component,'editorDataHandler').and.callThrough();
    component.editorState.solutions=mockData.editorState;
    component.editorDataHandler(mockData.eventData, 'solution');
    expect(component.editorDataHandler).toHaveBeenCalledWith(mockData.eventData, 'solution');
  });

  it('#editorDataHandler() should call editorDataHandler for question', () => {
    spyOn(component,'editorDataHandler').and.callThrough();
    component.editorDataHandler(mockData.eventData, 'question');
    expect(component.editorDataHandler).toHaveBeenCalledWith(mockData.eventData, 'question');
    expect(component.editorState.question).toBe(mockData.eventData.body);
  });

  it('#editorDataHandler() should call editorDataHandler without type', () => {
    spyOn(component,'editorDataHandler').and.callThrough();
    component.editorDataHandler(mockData.eventData);
    expect(component.editorDataHandler).toHaveBeenCalledWith(mockData.eventData);
  });

});