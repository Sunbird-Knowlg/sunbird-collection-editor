import { QuestionService } from './../../services/question/question.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuestionComponent } from './question.component';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player/player.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { EditorCursor } from '../../collection-editor-cursor.service';
import { TreeService } from '../../services/tree/tree.service';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { collectionHierarchyMock, mockData, readQuestionMock, mockTreeService, leafFormConfigMock, sourcingSettingsMock } from './question.component.spec.data';
import { of } from 'rxjs';

const mockEditorService = {
  editorConfig: {
    config: {
      hierarchy: {
        level1: {
          name: 'Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {}
        }
      }
    }
  },
  selectedChildren: {
    primaryCategory: "Text",
    label: "Text",
    interactionType: "text"
},
  getToolbarConfig: () => { },
  fetchCollectionHierarchy: (questionSetId) => { }
};

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionComponent, TelemetryInteractDirective],
      imports: [HttpClientTestingModule, SuiModule],
      providers: [EditorTelemetryService, QuestionService, ToasterService,
        PlayerService, { provide: EditorService, useValue: mockEditorService }, { provide: Router, useClass: RouterStub }, EditorCursor,
        { provide: TreeService, useValue: mockTreeService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    component.questionInput = {
      "questionSetId": "do_11330102570702438417",
      "questionId": "do_11330103476396851218"
    };
    let editorService: EditorService = TestBed.inject(EditorService);
    let telemetryService: EditorTelemetryService = TestBed.inject(EditorTelemetryService);
    spyOn(telemetryService, 'impression').and.callFake(() => { });
    spyOn(component, 'initialize').and.callThrough();
    spyOn(editorService, 'getToolbarConfig').and.returnValue({ title: 'abcd', showDialcode: 'No', showPreview: '' });
    spyOn(editorService, 'fetchCollectionHierarchy').and.returnValue(of(collectionHierarchyMock));
    let questionService: QuestionService = TestBed.inject(QuestionService);
    spyOn(questionService, 'readQuestion').and.returnValue(of(readQuestionMock));
    // component.leafFormConfig=leafFormConfigMock;
    // component.sourcingSettings=sourcingSettingsMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // xit('should call populateFormData ', () => {
  //   component.leafFormConfig = mockData.childMetadata;
  //   component.questionMetaData = mockData.questionMetaData;
  //   component.populateFormData();
  //   expect(component.questionMetaData).toBe(mockData.questionMetaData);
  //   expect(component.leafFormConfig).toBe(mockData.childMetadata);
  // });
  // it('should call previewFormData ', () => {
  //   component.leafFormConfig = leafFormConfigMock;
  //   component.initialLeafFormConfig=leafFormConfigMock;
  //   component.previewFormData(true);
  //   expect(component.leafFormConfig).toEqual(leafFormConfigMock);
  // });
  it('should call valueChanges', () => {
    component.valueChanges(mockData.formData);
    expect(component.childFormData).toEqual(mockData.formData);
  });
  it('should call validateFormFields', () => {
    component.leafFormConfig = leafFormConfigMock;
    component.childFormData = mockData.formData;
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.validateFormFields();
    expect(component.showFormError).toBeFalsy();
  });
  it('#populateFrameworkData() should call populateFrameworkData and set leafFormConfig values ', () => {
    component.frameworkDetails.frameworkData = mockData.frameWorkDetails.frameworkData;
    component.leafFormConfig = mockData.formData;
    component.populateFrameworkData();
    expect(component.leafFormConfig).toBeDefined();
  });
  it('#outputData() should call outputData', () => {
    spyOn(component, 'output');
    component.output('');
    expect(component.output).toHaveBeenCalled();
  });
  it('#onStatusChanges() should call onStatusChanges', () => {
    spyOn(component, 'onStatusChanges');
    component.onStatusChanges('');
    expect(component.onStatusChanges).toHaveBeenCalled();
  });
  xit('#ngAfterViewInit() should call ngAfterViewInit and emit telemetry impression event', () => {
    const data = { type: 'edit', pageid: undefined, uri: undefined, duration: 0 };
    spyOn(component.telemetryService, 'impression');
    component.ngAfterViewInit();
    expect(component.telemetryService.impression).toHaveBeenCalled();
  });
  it('#toolbarEventListener() should call toolbarEventListener for saveContent', () => {
    const data = { button: 'saveContent' };
    spyOn(component, 'saveContent');
    component.toolbarEventListener(data);
    expect(component.saveContent).toHaveBeenCalled();
  });
  it('#toolbarEventListener() should call toolbarEventListener for cancelContent', () => {
    const data = { button: 'cancelContent' };
    spyOn(component, 'handleRedirectToQuestionset');
    component.toolbarEventListener(data);
    expect(component.handleRedirectToQuestionset).toHaveBeenCalled();
  });
  it('#toolbarEventListener() should call toolbarEventListener for backContent', () => {
    const data = { button: 'backContent' };
    spyOn(component, 'handleRedirectToQuestionset');
    component.toolbarEventListener(data);
    expect(component.handleRedirectToQuestionset).toHaveBeenCalled();
  });
  it('#toolbarEventListener() should call toolbarEventListener for previewContent', () => {
    const data = { button: 'previewContent' };
    spyOn(component, 'previewContent');
    component.toolbarEventListener(data);
    expect(component.previewContent).toHaveBeenCalled();
  });
  it('#toolbarEventListener() should call toolbarEventListener for editContent', () => {
    const data = { button: 'editContent' };
    spyOn(component, 'previewFormData');
    component.toolbarEventListener(data);
    expect(component.previewFormData).toHaveBeenCalledWith(true);
    expect(component.showPreview).toBeFalsy();
    expect(component.toolbarConfig.showPreview).toBeFalsy();
  });
  it('#toolbarEventListener() should call toolbarEventListener for default case', () => {
    const data = { button: '' };
    spyOn(component, 'toolbarEventListener');
    component.toolbarEventListener(data);
    expect(component.toolbarEventListener).toHaveBeenCalledWith(data);
  });
  it('#handleRedirectToQuestionset() should call handleRedirectToQuestionset and redirectToQuestionset to be called ', () => {
    component.questionId = 'do_11326368076523929611';
    spyOn(component, 'redirectToQuestionset');
    component.handleRedirectToQuestionset();
    expect(component.showConfirmPopup).toBeFalsy();
    expect(component.redirectToQuestionset).toHaveBeenCalled();
  });
  it('redirectToQuestionset should call handleRedirectToQuestionset and set showConfirmPopup', () => {
    component.questionId = undefined;
    spyOn(component, 'redirectToQuestionset');
    component.handleRedirectToQuestionset();
    expect(component.showConfirmPopup).toBeTruthy();
  });
  it('#saveContent() should call saveContent and set showFormError ', () => {
    spyOn(component, 'validateQuestionData');
    spyOn(component, 'validateFormFields');
    spyOn(component, 'saveQuestion');
    component.showFormError = false;
    component.saveContent();
    expect(component.showFormError).toBeFalsy();
    expect(component.saveQuestion).toHaveBeenCalled();
  });
  it('#redirectToQuestionset() should call redirectToQuestionset and set showConfirmPopup', () => {
    spyOn(component.questionEmitter, 'emit');
    component.redirectToQuestionset();
    expect(component.showConfirmPopup).toBeFalsy();
  });
  it('#editorDataHandler() should call editorDataHandler for not any type', () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData);
    expect(component.editorState).toBeDefined();
  });
  it('#editorDataHandler() should call editorDataHandler for question', () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData, 'question');
    expect(component.editorState).toBeDefined();
  });
  it('#editorDataHandler() should call editorDataHandler for solution', () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData, 'solution');
    expect(component.editorState).toBeDefined();
  });
  it('#editorDataHandler() should call editorDataHandler for media', () => {
    component.editorState = mockData.editorState;
    mockData.eventData.mediaobj = { id: '1234' };
    spyOn(component, 'setMedia');
    component.editorDataHandler(mockData.eventData);
    expect(component.editorState).toBeDefined();
    expect(component.setMedia).toHaveBeenCalledWith(mockData.eventData.mediaobj);
  });
  it('#setMedia should call setMedia and set media arry', () => {
    component.editorState = mockData.editorState;
    component.mediaArr = [{ id: '6789' }];
    component.setMedia({ id: '1234' });
    expect(component.mediaArr).toBeDefined();
  });
  it('#saveQuestion() should call saveQuestion for updateQuestion', () => {
    component.editorState = mockData.editorState;
    component.questionId = 'do_11326368076523929611';
    spyOn(component, 'updateQuestion');
    component.saveQuestion();
    expect(component.updateQuestion).toHaveBeenCalled();
  });
  it('#deleteSolution() should call deleteSolution and set showSolutionDropDown value', () => {
    component.editorState = mockData.editorState;
    component.deleteSolution();
    expect(component.showSolutionDropDown).toBeTruthy();
  });
  it('#deleteSolution() should call deleteSolution and define mediaArr for video type', () => {
    component.editorState = mockData.editorState;
    component.selectedSolutionType = 'video';
    component.deleteSolution();
    expect(component.mediaArr).toBeDefined();
  });
  it('#validateQuestionData() should call validateQuestionData and question is undefined', () => {
    component.editorState = mockData.editorState;
    component.editorState.question = undefined;
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });
  it('#validateQuestionData() should call validateQuestionData and questionInteractionType is default', () => {
    component.sourcingSettings=sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = '<p> Hi how are you </p>';
    component.questionInteractionType = 'default';
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });
  it('#validateQuestionData() should call validateQuestionData and questionInteractionType is default', () => {
    component.sourcingSettings=sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = '<p> Hi how are you </p>';
    component.editorState.answer = '';
    component.questionInteractionType = 'default';
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });
  it('#validateQuestionData() should call validateQuestionData and questionInteractionType is default', () => {
    component.sourcingSettings=sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = '<p> Hi how are you </p>';
    component.editorState.answer = '';
    component.questionInteractionType = 'choice';
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });
  it('#videoDataOutput() should call videoDataOutput and event data is empty', () => {
    const event = '';
    spyOn(component, 'deleteSolution');
    component.videoDataOutput(event);
    expect(component.deleteSolution).toHaveBeenCalled();
  });
  it('#videoDataOutput() should call videoDataOutput and event data is not  empty', () => {
    const event = { name: 'event name', identifier: '1234' };
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
  it('#videoDataOutput() should call videoDataOutput for thumbnail', () => {
    const event = { name: 'event name', identifier: '1234', thumbnail: 'sample data' };
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
  it('#videoDataOutput() should call videoDataOutput for thumbnail', () => {
    const event = { name: 'event name', identifier: '1234', thumbnail: 'sample data' };
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
  it('#subMenuChange() should set the sub-menu value ', () => {
    component.subMenus =  mockData.subMenus;
    spyOn(component, 'subMenuChange').and.callThrough();
    component.subMenuChange({index:1,value:'test'})
    expect(component.subMenus[1].value).toBe('test');
  })
  it('#dependentQuestions() should return dependentQuestions ', () => {
    component.subMenus =  mockData.subMenus;
    spyOn(component, 'dependentQuestions').and.callThrough();
    expect( component.dependentQuestions.length).toBe(1)
  })
});
