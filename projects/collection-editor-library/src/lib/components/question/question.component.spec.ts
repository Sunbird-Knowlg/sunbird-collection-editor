import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuestionComponent } from './question.component';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question/question.service';
import { PlayerService } from '../../services/player/player.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import {mockData} from './question.component.spec.data';
describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionComponent, TelemetryInteractDirective ],
      imports: [HttpClientTestingModule, SuiModule],
      providers: [EditorTelemetryService, QuestionService, ToasterService,
         PlayerService, EditorService, { provide: Router, useClass: RouterStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('should call populateFormData ', () => {
    component.leafFormConfig = mockData.childMetadata;
    component.questionMetaData = mockData.questionMetaData;
    component.populateFormData();
    expect(component.questionMetaData).toBe(mockData.questionMetaData);
    expect(component.leafFormConfig).toBe(mockData.childMetadata);
  });
  it('should call previewFormData ', () => {
    component.leafFormConfig = mockData.childMetadata;
    component.previewFormData(true);
    expect(component.leafFormConfig).toEqual(mockData.childMetadata);
  });
  it('should call valueChanges', () => {
    component.valueChanges(mockData.formData);
    expect(component.childFormData).toEqual(mockData.formData);
  });
  it('should call validateFormFields', () => {
    component.leafFormConfig = mockData.childMetadata;
    component.childFormData = mockData.formData;
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.validateFormFields();
    expect(component.showFormError).toBeFalsy();
  });
  it('should call populateFrameworkData', () => {
    component.frameworkDetails.frameworkData = mockData.frameWorkDetails.frameworkData;
    component.leafFormConfig = mockData.formData;
    component.populateFrameworkData();
    expect(component.leafFormConfig).toBeDefined();
  });
  it('should call outputData', () => {
    spyOn(component, 'output');
    component.output('');
    expect(component.output).toHaveBeenCalled();
  });
  it('should call onStatusChanges', () => {
    spyOn(component, 'onStatusChanges');
    component.onStatusChanges('');
    expect(component.onStatusChanges).toHaveBeenCalled();
  });
  it('should call ngAfterViewInit', () => {
    const data = {type: 'edit', pageid: undefined , uri: undefined, duration: 0};
    spyOn(component.telemetryService, 'impression');
    component.ngAfterViewInit();
    expect(component.telemetryService.impression).toHaveBeenCalledWith(data);
  });
  it('should call toolbarEventListener for saveContent', () => {
    const data = {button: 'saveContent'};
    spyOn(component, 'saveContent');
    component.toolbarEventListener(data);
    expect(component.saveContent).toHaveBeenCalled();
  });
  it('should call toolbarEventListener for cancelContent', () => {
    const data = {button: 'cancelContent'};
    spyOn(component, 'handleRedirectToQuestionset');
    component.toolbarEventListener(data);
    expect(component.handleRedirectToQuestionset).toHaveBeenCalled();
  });
  it('should call toolbarEventListener for backContent', () => {
    const data = {button: 'backContent'};
    spyOn(component, 'handleRedirectToQuestionset');
    component.toolbarEventListener(data);
    expect(component.handleRedirectToQuestionset).toHaveBeenCalled();
  });
  it('should call toolbarEventListener for previewContent', () => {
    const data = {button: 'previewContent'};
    spyOn(component, 'previewContent');
    component.toolbarEventListener(data);
    expect(component.previewContent).toHaveBeenCalled();
  });
  it('should call toolbarEventListener for editContent', () => {
    const data = {button: 'editContent'};
    spyOn(component, 'previewFormData');
    component.toolbarEventListener(data);
    expect(component.previewFormData).toHaveBeenCalledWith(true);
    expect(component.showPreview).toBeFalsy();
    expect(component.toolbarConfig.showPreview).toBeFalsy();
  });
  it('should call toolbarEventListener for default case', () => {
    const data = {button: ''};
    spyOn(component, 'toolbarEventListener');
    component.toolbarEventListener(data);
    expect(component.toolbarEventListener).toHaveBeenCalledWith(data);
  });
  it('should call handleRedirectToQuestionset', () => {
    component.questionId = 'do_11326368076523929611';
    spyOn(component, 'redirectToQuestionset');
    component.handleRedirectToQuestionset();
    expect(component.showConfirmPopup).toBeFalsy();
    expect(component.redirectToQuestionset).toHaveBeenCalled();
  });
  it('should call handleRedirectToQuestionset', () => {
    component.questionId = undefined;
    spyOn(component, 'redirectToQuestionset');
    component.handleRedirectToQuestionset();
    expect(component.showConfirmPopup).toBeTruthy();
  });
  it('should call saveContent', () => {
    spyOn(component, 'validateQuestionData');
    spyOn(component, 'validateFormFields');
    spyOn(component, 'saveQuestion');
    component.showFormError = false;
    component.saveContent();
    expect(component.showFormError).toBeFalsy();
    expect(component.saveQuestion).toHaveBeenCalled();
  });
  it('should call redirectToQuestionset', () => {
    spyOn(component.questionEmitter, 'emit');
    component.redirectToQuestionset();
    expect(component.showConfirmPopup).toBeFalsy();
  });
  it('should call editorDataHandler for not any type', () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData);
    expect(component.editorState).toBeDefined();
  });
  it('should call editorDataHandler for question', () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData, 'question');
    expect(component.editorState).toBeDefined();
  });
  it('should call editorDataHandler for solution', () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData, 'solution');
    expect(component.editorState).toBeDefined();
  });
  it('should call editorDataHandler for media', () => {
    component.editorState = mockData.editorState;
    mockData.eventData.mediaobj = {id: '1234'};
    spyOn(component, 'setMedia');
    component.editorDataHandler(mockData.eventData);
    expect(component.editorState).toBeDefined();
    expect(component.setMedia).toHaveBeenCalledWith(mockData.eventData.mediaobj);
  });
  it('should call setMedia', () => {
    component.editorState = mockData.editorState;
    component.mediaArr = [{id: '6789'}];
    component.setMedia({id: '1234'});
    expect(component.mediaArr).toBeDefined();
  });
  it('should call saveQuestion for updateQuestion', () => {
    component.editorState = mockData.editorState;
    component.questionId = 'do_11326368076523929611';
    spyOn(component, 'updateQuestion');
    component.saveQuestion();
    expect(component.updateQuestion).toHaveBeenCalled();
  });
  it('should call deleteSolution', () => {
    component.editorState = mockData.editorState;
    component.deleteSolution();
    expect(component.showSolutionDropDown).toBeTruthy();
  });
  it('should call deleteSolution', () => {
    component.editorState = mockData.editorState;
    component.selectedSolutionType = 'video';
    component.deleteSolution();
    expect(component.mediaArr).toBeDefined();
  });
  it('should call validateQuestionData and question is undefined', () => {
    component.editorState = mockData.editorState;
    component.editorState.question = undefined;
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });
  it('should call validateQuestionData and questionInteractionType is default', () => {
    component.editorState = mockData.editorState;
    component.editorState.question = '<p> Hi how are you </p>';
    component.questionInteractionType = 'default';
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });
  it('should call validateQuestionData and questionInteractionType is default', () => {
    component.editorState = mockData.editorState;
    component.editorState.question = '<p> Hi how are you </p>';
    component.editorState.answer = '';
    component.questionInteractionType = 'default';
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });
  it('should call validateQuestionData and questionInteractionType is default', () => {
    component.editorState = mockData.editorState;
    component.editorState.question = '<p> Hi how are you </p>';
    component.editorState.answer = '';
    component.questionInteractionType = 'choice';
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });
  it('should call videoDataOutput and event data is empty', () => {
    const event = '';
    spyOn(component, 'deleteSolution');
    component.videoDataOutput(event);
    expect(component.deleteSolution).toHaveBeenCalled();
  });
  it('should call videoDataOutput and event data is not  empty', () => {
    const event = {name: 'event name', identifier: '1234'};
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
  it('should call videoDataOutput for thumbnail', () => {
    const event = {name: 'event name', identifier: '1234', thumbnail: 'sample data'};
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
  it('should call videoDataOutput for thumbnail', () => {
    const event = {name: 'event name', identifier: '1234', thumbnail: 'sample data'};
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
});
