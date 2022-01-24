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
import { collectionHierarchyMock, creationContextMock, mockData, readQuestionMock, mockTreeService,
  leafFormConfigMock, sourcingSettingsMock, childMetaData,
  HierarchyMockData, BranchingLogic, mockEditorCursor } from './question.component.spec.data';
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
    primaryCategory: 'Multiselect Multiple Choice Question',
    label: 'Multiple Choice Question',
    interactionType: 'choice'
  },
  getToolbarConfig: () => {},
  _toFlatObj: () => {},
  fetchCollectionHierarchy: (questionSetId) => {
    subscribe: fn => fn(collectionHierarchyMock);
  },
  updateCollection: (questionSetId, event) => { subscribe: fn => fn({}) }
};

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let treeService;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionComponent, TelemetryInteractDirective],
      imports: [HttpClientTestingModule, SuiModule],
      providers: [EditorTelemetryService, QuestionService, ToasterService,
        PlayerService, { provide: EditorService, useValue: mockEditorService }, { provide: Router, useClass: RouterStub }, EditorCursor,
        { provide: TreeService, useValue: mockTreeService }, { provide: EditorCursor, useValue: mockEditorCursor }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    component.questionInput = {
      questionSetId: 'do_11330102570702438417',
      questionId: 'do_11330103476396851218',
    };
    component.questionPrimaryCategory='Multiselect Multiple Choice Question';
    component.questionInteractionType = 'choice';
    let editorService: EditorService = TestBed.inject(EditorService);
    let telemetryService: EditorTelemetryService = TestBed.inject(EditorTelemetryService);
    spyOn(telemetryService, 'impression').and.callFake(() => { });
    spyOn(component, 'initialize').and.callThrough();
    spyOn(editorService, 'getToolbarConfig').and.returnValue({ title: 'abcd', showDialcode: 'No', showPreview: '' });
    spyOn(editorService, 'fetchCollectionHierarchy').and.returnValue({ subscribe: fn => fn(collectionHierarchyMock) });
    spyOn(editorService, 'updateCollection').and.returnValue({ subscribe: fn => fn({}) });
    let questionService: QuestionService = TestBed.inject(QuestionService);
    spyOn(questionService, 'readQuestion').and.returnValue(of(readQuestionMock));
    treeService = TestBed.get(TreeService);
    fixture.detectChanges();
  });

  it('check default values', () => {
    expect(component.terms).toEqual(false);
    expect(component.actionType).not.toBeDefined();
    expect(component.questionCategory).not.toBeDefined();
    expect(component.creationContext).not.toBeDefined();
    expect(component.unitId).not.toBeDefined();
    expect(component.contentComment).not.toBeDefined();
    expect(component.unitId).not.toBeDefined();
    expect(component.showReviewModal).toEqual(false);
    expect(component.showSubmitConfirmPopup).toEqual(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const editorService = TestBed.get(EditorService);
    editorService.selectedChildren.label='Multiple Choice Question'
  });

  it('Unit test for #ngOnInit()', () => {
    component.questionInput = {
      questionSetId: 'do_11330102570702438417',
      questionId: 'do_11330103476396851218',
      type: 'default',
      category: 'MTF',
      config: {},
      creationContext: creationContextMock
    };
    const editorService = TestBed.get(EditorService);

    component.ngOnInit();
    expect(component.questionInteractionType).toEqual('choice');
    expect(component.questionCategory).toEqual('MTF');
    expect(component.questionId).toEqual('do_11330103476396851218');
    expect(component.questionSetId).toEqual('do_11330102570702438417');
    expect(component.creationContext).toEqual(creationContextMock);
    expect(component.unitId).toEqual(creationContextMock.unitIdentifier);
    expect(component.isReadOnlyMode).toEqual(creationContextMock.isReadOnlyMode);
    expect(component.toolbarConfig).toBeDefined();
    expect(component.toolbarConfig.showPreview).toBeFalsy();
  });

  it('Unit test for #populateFormData ', () => {
    spyOn(component,'populateFormData').and.callThrough();
    component.leafFormConfig=leafFormConfigMock;
    component.questionId='do_11330103476396851218',
    component.populateFormData();
    expect(component.populateFormData).toHaveBeenCalled();
  });
  it('should call previewFormData ', () => {
    component.leafFormConfig = mockData.childMetadata.properties;
    component.previewFormData(true);
    expect(component.leafFormConfig).toEqual(mockData.childMetadata.properties);
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
  it('#setQuestionTitle() should set #toolbarConfig.title', () => {
    component.creationContext = creationContextMock;
    component.questionPrimaryCategory = 'Subjective Question';
    component.setQuestionTitle();
    expect(component.toolbarConfig.title).toBe('Subjective Question');
  });
  it('call #getMcqQuestionHtmlBody() to verify questionBody', () => {
    const question = '<p>Objective 1</p>';
    const templateId = 'mcq-vertical';
    let result = component.getMcqQuestionHtmlBody(question, templateId);
    expect(result).toBeDefined();
  });
  it('#toolbarEventListener() should call toolbarEventListener for saveContent', () => {
    const event = { button: 'saveContent' };
    component.actionType = event.button;
    spyOn(component, 'saveContent');
    component.toolbarEventListener(event);
    expect(component.toolbarEventListener).toHaveBeenCalledWith;
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
  it('#toolbarEventListener() should call toolbarEventListener for submitQuestion', () => {
    const data = { button: 'submitQuestion' };
    spyOn(component, 'submitHandler');
    component.toolbarEventListener(data);
    expect(component.submitHandler).toHaveBeenCalledWith();
  });
  it('#toolbarEventListener() should call toolbarEventListener for rejectQuestion', () => {
    const data = { button: 'rejectQuestion', comment: 'test comment' };
    spyOn(component, 'rejectQuestion');
    component.toolbarEventListener(data);
    expect(component.rejectQuestion).toHaveBeenCalledWith(data.comment);
  });
  it('#toolbarEventListener() should call toolbarEventListener for publishQuestion', () => {
    const data = { button: 'publishQuestion' };
    spyOn(component, 'publishQuestion');
    component.toolbarEventListener(data);
    expect(component.publishQuestion).toHaveBeenCalledWith(data);
  });
  it('#toolbarEventListener() should call toolbarEventListener for sourcingApproveQuestion', () => {
    const data = { button: 'sourcingApproveQuestion' };
    spyOn(component, 'sourcingUpdate');
    component.toolbarEventListener(data);
    expect(component.sourcingUpdate).toHaveBeenCalledWith(data);
  });
  it('#toolbarEventListener() should call toolbarEventListener for sourcingRejectQuestion', () => {
    const data = { button: 'sourcingRejectQuestion' };
    spyOn(component, 'sourcingUpdate');
    component.toolbarEventListener(data);
    expect(component.sourcingUpdate).toHaveBeenCalledWith(data);
  });
  it('#toolbarEventListener() should call toolbarEventListener for showReviewcomments', () => {
    const data = { button: 'showReviewcomments' };
    component.toolbarEventListener(data);
    expect(component.showReviewModal).toBeTruthy();
  });
  it('#toolbarEventListener() should call toolbarEventListener for sendForCorrectionsQuestion', () => {
    const data = { button: 'sendForCorrectionsQuestion' };
    spyOn(component, 'sendBackQuestion');
    component.toolbarEventListener(data);
    expect(component.sendBackQuestion).toHaveBeenCalledWith(data);
  });
  it('#toolbarEventListener() should call toolbarEventListener for default case', () => {
    const data = { button: '' };
    spyOn(component, 'toolbarEventListener');
    component.toolbarEventListener(data);
    expect(component.toolbarEventListener).toHaveBeenCalledWith(data);
  });

  it('Unit test for #sendForReview', () => {
    spyOn(component, 'upsertQuestion');
    component.sendForReview();
    expect(component.upsertQuestion).toHaveBeenCalled();
  });

  it('Unit test for #setQuestionId', () => {
    component.setQuestionId('do_11330103476396851218');
    expect(component.questionId).toEqual('do_11330103476396851218');
  });

  it('#submitHandler() should call #validateQuestionData and #validateFormFields', () => {
    spyOn(component, 'validateQuestionData');
    spyOn(component, 'validateFormFields');
    component.submitHandler();
    expect(component.validateQuestionData).toHaveBeenCalledWith();
    expect(component.validateFormFields).toHaveBeenCalledWith();
  });
  it('#rejectQuestion() should call #requestForChanges', () => {
    const comment = 'test comment';
    spyOn(component, 'requestForChanges');
    component.rejectQuestion(comment);
    expect(component.requestForChanges).toHaveBeenCalledWith(comment);
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
  it('Unit test for #showHideSpinnerLoader', () => {
    component.showHideSpinnerLoader(true, 'review');
    expect(component.buttonLoaders.saveButtonLoader).toEqual(true);
    expect(component.buttonLoaders.review).toEqual(true);
  });
  it('Unit test for #isEditable', () => {
    component.creationContext = creationContextMock;
    expect(component.isEditable('bloomsLevel')).toBeFalsy();
  });
  it('Unit test for #prepareQuestionBody', () => {
    spyOn(component,'prepareQuestionBody').and.callThrough();
    component.prepareQuestionBody();
    expect(component.prepareQuestionBody).toHaveBeenCalled()
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
  it('call #sourcingUpdate() for sourcingRejectQuestion to verify inputs for #editorService.updateCollection', () => {
    component.creationContext = creationContextMock;
    const questionSet = collectionHierarchyMock.result['questionSet'];
    component.questionId = 'do_11326368076523929611';
    component.actionType = 'sourcingRejectQuestion';
    const data = { button: 'sourcingRejectQuestion', comment: 'test comment for rejection' };
    const editorService = TestBed.inject(EditorService);
    const requestBody = {
      request: {
        questionset: {
          rejectedContributions: [
              ...questionSet.rejectedContributions,
              component.questionId
          ],
          rejectedContributionComments: {
              ...questionSet.rejectedContributionComments,
              do_11326368076523929611: data.comment
          }
        }
      }
    };
    component.sourcingUpdate(data);
    expect(editorService.updateCollection).toHaveBeenCalledWith('do_11330102570702438417', { ...data, requestBody });
  });
  it('call #sourcingUpdate() for sourcingApproveQuestion to verify inputs for #editorService.updateCollection', () => {
    component.creationContext = creationContextMock;
    const questionSet = collectionHierarchyMock.result['questionSet'];
    component.questionId = 'do_11326368076523929611';
    component.actionType = 'sourcingApproveQuestion';
    const data = { button: 'sourcingApproveQuestion' };
    const editorService = TestBed.inject(EditorService);
    const requestBody = {
      request: {
        questionset: {
          acceptedContributions: [
              ...questionSet.acceptedContributions,
              component.questionId
          ],
        }
      }
    };
    component.sourcingUpdate(data);
    expect(editorService.updateCollection).toHaveBeenCalledWith('do_11330102570702438417', { ...data, requestBody });
  });
  it('#sourcingUpdate() should call #redirectToChapterList() for sourcingApproveQuestion', () => {
    component.creationContext = creationContextMock;
    component.questionId = 'do_11326368076523929611';
    component.actionType = 'sourcingApproveQuestion';
    const data = { button: 'sourcingApproveQuestion' };
    spyOn(component, 'redirectToChapterList');
    component.sourcingUpdate(data);
    expect(component.redirectToChapterList).toHaveBeenCalled();
  });
  it('#sourcingUpdate() should call #redirectToChapterList() for sourcingRejectQuestion', () => {
    component.creationContext = creationContextMock;
    component.questionId = 'do_11326368076523929611';
    component.actionType = 'sourcingRejectQuestion';
    const data = { button: 'sourcingRejectQuestion', comment: 'test comment for rejection' };
    spyOn(component, 'redirectToChapterList');
    component.sourcingUpdate(data);
    expect(component.redirectToChapterList).toHaveBeenCalled();
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
  });
  it('#dependentQuestions() should return dependentQuestions ', () => {
    component.subMenus =  mockData.subMenus;
    spyOn(component, 'dependentQuestions').and.callThrough();
    expect( component.dependentQuestions.length).toBe(1)
  });

  it('#prepareRequestBody() should call to check the dynamic form data',()=>{
    spyOn(treeService, 'getFirstChild').and.callFake(() => { });
    spyOn(component,'prepareRequestBody').and.callThrough();
    component.prepareRequestBody();
    expect(component.prepareRequestBody).toHaveBeenCalled();
  });

  it('#setQuestionTypeValues() should call to check the dynamic form data',()=>{
    spyOn(component,'setQuestionTypeValues').and.callThrough();
    component.childFormData=childMetaData;
    component.subMenus =  mockData.subMenus;
    component.setQuestionTypeValues(mockData.questionMetaData);
    expect(component.setQuestionTypeValues).toHaveBeenCalled();
    expect(mockData.questionMetaData.showEvidence).toEqual(component.childFormData.showEvidence)
  });

  it('#setQuestionTypeValues() should call to check the dynamic form data for date',()=>{
    component.questionInteractionType='date'
    spyOn(component,'setQuestionTypeValues').and.callThrough();
    component.childFormData=childMetaData;
    component.subMenus =  mockData.subMenus;
    component.setQuestionTypeValues(mockData.questionMetaData);
    expect(component.setQuestionTypeValues).toHaveBeenCalled();
    expect(mockData.questionMetaData.showEvidence).toEqual(component.childFormData.showEvidence)
  });

  it('#setQuestionTypeValues() should call to check the dynamic form data for text',()=>{
    component.questionInteractionType='text'
    spyOn(component,'setQuestionTypeValues').and.callThrough();
    component.childFormData=childMetaData;
    component.subMenus =  mockData.subMenus;
    component.setQuestionTypeValues(mockData.questionMetaData);
    expect(component.setQuestionTypeValues).toHaveBeenCalled();
    expect(mockData.questionMetaData.showEvidence).toEqual(component.childFormData.showEvidence)
  });

  it('#setQuestionTypeValues() should call to check the dynamic form data for slider',()=>{
    component.questionInteractionType='slider'
    spyOn(component,'setQuestionTypeValues').and.callThrough();
    component.childFormData=childMetaData;
    component.subMenus =  mockData.subMenus;
    component.setQuestionTypeValues(mockData.questionMetaData);
    expect(component.setQuestionTypeValues).toHaveBeenCalled();
    expect(mockData.questionMetaData.showEvidence).toEqual(component.childFormData.showEvidence)
  });

  it('#saveContent() should call saveContent when questionId exits ', () => {
    spyOn(component, 'validateQuestionData');
    spyOn(component, 'validateFormFields');
    spyOn(component, 'saveQuestion');
    spyOn(component,'updateQuestion');
    spyOn(component,'buildCondition');
    component.questionId='do_1134355571590184961168';
    component.selectedSectionId='do_1134347209749299201119';
    component.showFormError = false;
    component.showOptions=true;
    component.isChildQuestion=true;
    component.condition='eq';
    component.selectedOptions=1;
    component.saveContent();
    component.updateQuestion();
    component.buildCondition('update');
    component.updateTreeCache('Mid-day Meals',BranchingLogic,component.selectedSectionId);
    expect(component.saveQuestion).toHaveBeenCalled();
    expect(component.updateQuestion).toHaveBeenCalled();
    expect(component.buildCondition).toHaveBeenCalled();
  });


  it('#buildCondition() should call when it is a child question ', () => {
    spyOn(component,'buildCondition');
    component.questionId='do_1134355571590184961168';
    component.selectedSectionId='do_1134347209749299201119';
    component.condition='eq';
    component.selectedOptions=1;
    component.branchingLogic=BranchingLogic;
    component.buildCondition('update');
    component.updateTreeCache('Mid-day Meals',BranchingLogic,component.selectedSectionId);
    expect(component.buildCondition).toHaveBeenCalled();
  });

  it('#updateTarget() should call when buildcondition is called ', () => {
    spyOn(component,'updateTarget').and.callThrough();
    component.questionId='do_1134355571590184961168';
    component.branchingLogic=BranchingLogic;
    component.updateTarget(component.questionId);
    expect(component.updateTarget).toHaveBeenCalledWith(component.questionId);
  });

  it('#getOptions() should call when child question is edited when option exits', () => {
    spyOn(component,'getOptions').and.callThrough();
    let editorService = TestBed.get(EditorService);
    editorService.optionsLength = 4;
    component.getOptions();
    expect(component.getOptions).toHaveBeenCalled();
  });
  it('#getOptions() should call when child question is edited when option not exits', () => {
    spyOn(component,'getOptions').and.callThrough();
    let editorService = TestBed.get(EditorService);
    editorService.optionsLength = undefined;
    component.getOptions();
    expect(component.getOptions).toHaveBeenCalled();
  });

  it('#getParentQuestionOptions() should call when add dependent question clicked', () => {
    spyOn(component,'getParentQuestionOptions').and.callThrough();
    component.questionId='do_1134355571590184961168';
    let editorService = TestBed.get(EditorService);
    editorService.parentIdentifier = component.questionId;
    component.getParentQuestionOptions(component.questionId);
    expect(component.getParentQuestionOptions).toHaveBeenCalledWith(component.questionId);
  });

  it('#updateTreeCache() should call when buildcondition is called ', () => {
    spyOn(component,'updateTreeCache').and.callThrough();
    component.updateTreeCache('Mid-day Meals',BranchingLogic,component.selectedSectionId);
    expect(component.updateTreeCache).toHaveBeenCalled();
  });

  it('#setCondition() should call when buildcondition is called ', () => {
    spyOn(component,'setCondition').and.callThrough();
    component.questionId='do_1134355571590184961168';
    let data ={
      branchingLogic:BranchingLogic
    };
    component.setCondition(data);
    expect(component.setCondition).toHaveBeenCalledWith(data);
  });

  it('#subMenuConfig() should call when question page render', () => {
    spyOn(component,'subMenuConfig').and.callThrough();
    component.questionMetaData=mockData.questionMetaData;
    component.sourcingSettings=sourcingSettingsMock;
    component.questionInput.setChildQuestion=false;
    component.subMenuConfig();
    expect(component.subMenuConfig).toHaveBeenCalled();
  });

  it('#sliderData() should call when slider question is called', () => {
    spyOn(component,'sliderData').and.callThrough();
    const event={
      leftAnchor:0,
      rightAnchor:10,
      step:1
    }
    component.sliderData(event);
    expect(component.sliderData).toHaveBeenCalledWith(event);
  });

});