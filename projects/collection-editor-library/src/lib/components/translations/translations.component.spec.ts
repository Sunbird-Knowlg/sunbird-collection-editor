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
    component.editorState = mockData.editorState;
    component.editorState.solutions=mockData.editorState;
    component.editorDataHandler(mockData.eventData, 'solution');
    expect(component.editorState).toBeDefined();
  });

  it('#editorDataHandler() should call editorDataHandler for question', () => {
    component.editorState = mockData.editorState;
    component.editorState.solutions=mockData.editorState;
    component.editorDataHandler(mockData.eventData, 'question');
    expect(component.editorState).toBeDefined();
  });

});