import { EditorService } from './../../services/editor/editor.service';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TreeService } from '../../services/tree/tree.service';
import {
  editorConfig, editorConfig_question, toolbarConfig_question,
  nativeElement, getCategoryDefinitionResponse, hierarchyResponse,
  categoryDefinition, categoryDefinitionData, csvExport, hirearchyGet,
  SelectedNodeMockData, outcomeDeclarationData, observationAndRubericsField,
  questionsetRead, questionsetHierarchyRead, nodesModifiedData, treeNodeData,
  questionSetEditorConfig,
  mockOutcomeDeclaration,
  frameworkData} from './editor.component.spec.data';
import { ConfigService } from '../../services/config/config.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { DialcodeService } from '../../services/dialcode/dialcode.service';
import { treeData } from './../fancy-tree/fancy-tree.component.spec.data';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { FrameworkService } from '../../services/framework/framework.service';
import { HelperService } from '../../services/helper/helper.service';
import { ToasterService } from '../../services/toaster/toaster.service';

describe('EditorComponent', () => {
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default,
    categoryConfig: (categoryConfig as any).default
  };

  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let toasterService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [EditorComponent, TelemetryInteractDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [EditorTelemetryService, EditorService, DialcodeService, ToasterService,
        { provide: ConfigService, useValue: configStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.get(ToasterService);
    // tslint:disable-next-line:no-string-literal
    editorConfig.context['targetFWIds'] = ['nit_k12'];
    // tslint:disable-next-line:no-string-literal
    editorConfig.context['correctionComments'] = 'change description';
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default value of variables', () => {
    expect(component.questionComponentInput).toEqual({});
    expect(component.selectedNodeData).toEqual({});
    expect(component.showConfirmPopup).toBeFalsy();
    expect(component.terms).toBeFalsy();
    expect(component.pageId).toBeUndefined();
    expect(component.pageStartTime).toBeUndefined();
    expect(component.rootFormConfig).toBeUndefined();
    expect(component.unitFormConfig).toBeUndefined();
    expect(component.searchFormConfig).toBeUndefined();
    expect(component.leafFormConfig).toBeUndefined();
    expect(component.showLibraryPage).toBeFalsy();
    expect(component.libraryComponentInput).toEqual({});
    expect(component.questionlibraryInput).toEqual({});
    expect(component.isQumlPlayer).toBeUndefined();
    expect(component.showQuestionTemplatePopup).toBeFalsy();
    expect(component.showDeleteConfirmationPopUp).toBeFalsy();
    expect(component.showPreview).toBeFalsy();
    expect(component.buttonLoaders.previewButtonLoader).toBeFalsy();
    expect(component.buttonLoaders.saveAsDraftButtonLoader).toBeFalsy();
    expect(component.buttonLoaders.addFromLibraryButtonLoader).toBeFalsy();
    expect(component.buttonLoaders.showReviewComment).toBeFalsy();
    expect(component.csvDropDownOptions).toEqual({});
    expect(component.showCsvUploadPopup).toBeFalsy();
    expect(component.isCreateCsv).toBeTruthy();
    expect(component.isStatusReviewMode).toBeFalsy();
    expect(component.ishierarchyConfigSet).toBeFalsy();
    expect(component.isComponenetInitialized).toBeFalsy();
  });

  it('#ngOnInit() should call all methods inside it (for objectType Collection)', () => {
    component.editorConfig = editorConfig;
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'initialize').and.callThrough();
    const treeService = TestBed.inject(TreeService);
    spyOn(treeService, 'initialize').and.callThrough();
    const configService = TestBed.inject(ConfigService);
    component.configService = configService;
    spyOn(editorService, 'getToolbarConfig').and.returnValue({ title: 'abcd', showDialcode: 'No' });
    spyOn(component, 'isReviewMode').and.returnValue(true);
    spyOn(component, 'mergeCollectionExternalProperties').and.returnValue(of(hierarchyResponse));
    spyOn(component, 'initializeFrameworkAndChannel').and.callFake(() => {});
    spyOn(editorService, 'getCategoryDefinition').and.returnValue(of(getCategoryDefinitionResponse));
    const telemetryService = TestBed.inject(EditorTelemetryService);
    spyOn(telemetryService, 'initializeTelemetry').and.callFake(() => { });
    spyOn(telemetryService, 'start').and.callFake(() => { });
    spyOn(editorService, 'getshowLibraryPageEmitter').and.returnValue(of({}));
    spyOn(component, 'showLibraryComponentPage').and.callFake(() => {});
    spyOn(editorService, 'getshowQuestionLibraryPageEmitter').and.returnValue(of({}));
    spyOn(component, 'showQuestionLibraryComponentPage').and.callFake(() => {});
    component.ngOnInit();
    expect(editorService.initialize).toHaveBeenCalledWith(editorConfig);
    expect(editorService.editorMode).toEqual('edit');
    expect(component.editorMode).toEqual('edit');
    expect(treeService.initialize).toHaveBeenCalledWith(editorConfig);
    expect(component.collectionId).toBeDefined();
    expect(editorService.getToolbarConfig).toHaveBeenCalled();
    expect(component.isObjectTypeCollection).toBeTruthy();
    expect(component.isReviewMode).toHaveBeenCalled();
    expect(component.isStatusReviewMode).toBeTruthy();
    expect(component.mergeCollectionExternalProperties).toHaveBeenCalled();
    expect(component.toolbarConfig).toBeDefined();
    expect(component.toolbarConfig.title).toEqual(hierarchyResponse[0].result.content.name);
    expect(component.initializeFrameworkAndChannel).toHaveBeenCalled();
    expect(editorService.getCategoryDefinition).toHaveBeenCalled();
    expect(component.toolbarConfig.showDialcode).toEqual('yes');
    expect(component.toolbarConfig.showBulkUploadBtn).toBeFalsy();
    expect(telemetryService.initializeTelemetry).toHaveBeenCalled();
    expect(telemetryService.telemetryPageId).toEqual('collection_editor');
    expect(telemetryService.start).toHaveBeenCalled();
    expect(editorService.getshowLibraryPageEmitter).toHaveBeenCalled();
    expect(component.showLibraryComponentPage).toHaveBeenCalled();
    expect(editorService.getshowQuestionLibraryPageEmitter).toHaveBeenCalled();
    expect(component.showQuestionLibraryComponentPage).toHaveBeenCalled();
  });

  it('#ngOnInit() should call all methods inside it (for objectType Question)', () => {
    component.editorConfig = editorConfig_question;
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'initialize').and.callThrough();
    const treeService = TestBed.inject(TreeService);
    spyOn(treeService, 'initialize').and.callFake(() => {});
    spyOn(component, 'isReviewMode').and.returnValue(true);
    spyOn(editorService, 'getToolbarConfig').and.returnValue(toolbarConfig_question);
    spyOn(editorService, 'getCategoryDefinition').and.returnValue(of(getCategoryDefinitionResponse));
    const telemetryService = TestBed.inject(EditorTelemetryService);
    spyOn(telemetryService, 'initializeTelemetry').and.callFake(() => { });
    spyOn(telemetryService, 'start').and.callFake(() => { });
    spyOn(editorService, 'getshowLibraryPageEmitter').and.returnValue(of({}));
    spyOn(component, 'showLibraryComponentPage').and.callFake(() => {});
    spyOn(editorService, 'getshowQuestionLibraryPageEmitter').and.returnValue(of({}));
    spyOn(component, 'showQuestionLibraryComponentPage').and.callFake(() => {});
    component.ngOnInit();
    expect(editorService.editorMode).toEqual('edit');
    expect(component.editorMode).toEqual('edit');
    expect(editorService.initialize).toHaveBeenCalledWith(editorConfig_question);
    expect(treeService.initialize).toHaveBeenCalled();
    expect(editorService.getToolbarConfig).toHaveBeenCalled();
    expect(component.isReviewMode).toHaveBeenCalled();
    expect(component.collectionId).toBeDefined();
    expect(component.organisationFramework).toBeDefined();
    expect(component.toolbarConfig.showDialcode).toEqual('yes');
    expect(editorService.getCategoryDefinition).toHaveBeenCalledWith('Subjective Question', '01309282781705830427', 'Question');
    expect(telemetryService.initializeTelemetry).toHaveBeenCalled();
    expect(telemetryService.telemetryPageId).toEqual('question');
    expect(telemetryService.start).toHaveBeenCalled();
    expect(editorService.getshowLibraryPageEmitter).toHaveBeenCalled();
    expect(component.showLibraryComponentPage).toHaveBeenCalled();
    expect(editorService.getshowQuestionLibraryPageEmitter).toHaveBeenCalled();
    expect(component.showQuestionLibraryComponentPage).toHaveBeenCalled();
  });

  it('Unit test for #initializeFrameworkAndChannel()', () => {
    const helperService = TestBed.inject(HelperService);
    const frameworkService = TestBed.inject(FrameworkService);
    component.editorConfig = editorConfig_question;
    spyOn(frameworkService, 'getTargetFrameworkCategories').and.callFake(() => {});
    spyOn(frameworkService, 'initialize').and.callFake(() => {});
    spyOn(helperService, 'initialize').and.callFake(() => {});
    component.initializeFrameworkAndChannel();
    expect(component.organisationFramework).toEqual(editorConfig_question.context.framework);
    expect(component.targetFramework).toEqual([ 'nit_k-12' ]);
    expect(frameworkService.initialize).toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).toHaveBeenCalledWith([ 'nit_k-12' ]);
    expect(helperService.initialize).toHaveBeenCalledWith('01309282781705830427');
  });

  it('Unit test for #initializeFrameworkAndChannel() negative case', () => {
    const questionEditorConfig = editorConfig_question;
    questionEditorConfig.context.framework = undefined;
    questionEditorConfig.context.targetFWIds = undefined;
    const helperService = TestBed.inject(HelperService);
    const frameworkService = TestBed.inject(FrameworkService);
    component.editorConfig = questionEditorConfig;
    spyOn(frameworkService, 'getTargetFrameworkCategories').and.callFake(() => {});
    spyOn(frameworkService, 'initialize').and.callFake(() => {});
    spyOn(helperService, 'initialize').and.callFake(() => {});
    component.initializeFrameworkAndChannel();
    expect(component.organisationFramework).toBeUndefined();
    expect(component.targetFramework).toBeUndefined();
    expect(frameworkService.initialize).not.toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).not.toHaveBeenCalledWith();
    expect(helperService.initialize).toHaveBeenCalledWith('01309282781705830427');
  });

  it('Unit test for #getFrameworkDetails()', () => {
    const treeService = TestBed.inject(TreeService);
    const frameworkService = TestBed.inject(FrameworkService);
    const editorService = TestBed.inject(EditorService);
    component.organisationFramework = 'dummy';
    spyOn(component, 'getFrameworkDetails').and.callThrough();
    spyOn(treeService, 'updateMetaDataProperty').and.callFake(() => { });
    spyOn(frameworkService, 'getTargetFrameworkCategories').and.callFake(() => { });
    spyOn(frameworkService, 'getFrameworkData').and.returnValue(of({}));
    spyOn(component, 'setEditorForms').and.callFake(() => { });
    component.getFrameworkDetails(categoryDefinitionData);
    expect(treeService.updateMetaDataProperty).not.toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).not.toHaveBeenCalled();
    expect(frameworkService.getFrameworkData).toHaveBeenCalled();
    expect(component.targetFramework).toBeUndefined();
    expect(treeService.updateMetaDataProperty).not.toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).not.toHaveBeenCalled();
    expect(component.setEditorForms).toHaveBeenCalled();
  });

  it('Unit test for #getFrameworkDetails() when primaryCategory is Obs with rubrics api success', () => {
    const treeService = TestBed.inject(TreeService);
    const frameworkService = TestBed.inject(FrameworkService);
    const editorService = TestBed.inject(EditorService);
    component.organisationFramework = 'dummy';
    editorConfig.config.renderTaxonomy = true;
    component.editorConfig = editorConfig;
    spyOn(editorService, 'fetchOutComeDeclaration').and.returnValue(mockOutcomeDeclaration);
    spyOn(component, 'getFrameworkDetails').and.callThrough();
    spyOn(treeService, 'updateMetaDataProperty').and.callFake(() => { });
    spyOn(frameworkService, 'getTargetFrameworkCategories').and.callFake(() => { });
    spyOn(frameworkService, 'getFrameworkData').and.returnValue(of({}));
    spyOn(component, 'setEditorForms').and.callFake(() => { });
    component.getFrameworkDetails(categoryDefinitionData);
    expect(treeService.updateMetaDataProperty).not.toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).not.toHaveBeenCalled();
    expect(component.targetFramework).toBeUndefined();
    expect(treeService.updateMetaDataProperty).not.toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).not.toHaveBeenCalled();
  });

  it('Unit test for #getFrameworkDetails() when primaryCategory is Obs with rubrics outcome declaration api fail', () => {
    const treeService = TestBed.inject(TreeService);
    const frameworkService = TestBed.inject(FrameworkService);
    const editorService = TestBed.inject(EditorService);
    component.organisationFramework = 'dummy';
    editorConfig.config.renderTaxonomy = true;
    component.editorConfig = editorConfig;
    spyOn(editorService, 'fetchOutComeDeclaration').and.returnValue(throwError('error'));
    spyOn(component, 'getFrameworkDetails').and.callThrough();
    spyOn(treeService, 'updateMetaDataProperty').and.callFake(() => { });
    spyOn(frameworkService, 'getTargetFrameworkCategories').and.callFake(() => { });
    spyOn(frameworkService, 'getFrameworkData').and.returnValue(of({}));
    spyOn(component, 'setEditorForms').and.callFake(() => { });
    component.getFrameworkDetails(categoryDefinitionData);
    expect(treeService.updateMetaDataProperty).not.toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).not.toHaveBeenCalled();
    expect(component.targetFramework).toBeUndefined();
    expect(treeService.updateMetaDataProperty).not.toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).not.toHaveBeenCalled();
  });

  it('#setEditorForms() should set variable values for questionset', () => {
    component.objectType = 'questionset';
    spyOn(component, 'setEditorForms').and.callThrough();
    component.setEditorForms(categoryDefinition);
    expect(component.setEditorForms).toHaveBeenCalled();
    expect(component.unitFormConfig).toBeDefined();
    expect(component.rootFormConfig).toBeDefined();
    expect(component.libraryComponentInput.searchFormConfig).toBeDefined();
    expect(component.leafFormConfig).toBeDefined();
    expect(component.relationFormConfig).toBeDefined();
  });

  it('#setEditorForms() should set variable values for course', () => {
    component.objectType = 'course';
    spyOn(component, 'setEditorForms').and.callThrough();
    component.setEditorForms(categoryDefinition);
    expect(component.setEditorForms).toHaveBeenCalled();
    expect(component.unitFormConfig).toBeDefined();
    expect(component.rootFormConfig).toBeDefined();
    expect(component.libraryComponentInput.searchFormConfig).toBeDefined();
    expect(component.leafFormConfig).toBeDefined();
    expect(component.relationFormConfig).toBeDefined();
  });

  it('#setEditorForms() should set variable values for observation', () => {
    const objectCategoryDefinition = categoryDefinition;
    objectCategoryDefinition.result.objectCategoryDefinition.forms.create.properties = [
      {
        name: 'Basic details',
        fields: observationAndRubericsField
      }
    ];
    component.objectType = 'observation';
    spyOn(component, 'setEditorForms').and.callThrough();
    component.setEditorForms(objectCategoryDefinition);
    expect(component.setEditorForms).toHaveBeenCalled();
    expect(component.unitFormConfig).toBeDefined();
    expect(component.rootFormConfig).toBeDefined();
    expect(component.libraryComponentInput.searchFormConfig).toBeDefined();
    expect(component.leafFormConfig).toBeDefined();
    expect(component.relationFormConfig).toBeDefined();
  });

  it('#ngAfterViewInit() should call #impression()', () => {
    component.isComponenetInitialized = false;
    const telemetryService = TestBed.inject(EditorTelemetryService);
    telemetryService.telemetryPageId = 'collection_editor';
    spyOn(telemetryService, 'impression').and.callFake(() => { });
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(telemetryService.impression).toHaveBeenCalled();
    expect(component.isComponenetInitialized).toBeTruthy();
  });

  it('#mergeCollectionExternalProperties() should call fetchCollectionHierarchy for objectType questionset', () => {
    component.objectType = 'questionSet';
    component.collectionId = 'do_113528954932387840149';
    const editorService = TestBed.inject(EditorService);
    component.editorConfig = editorConfig;
    spyOn(component, 'mergeCollectionExternalProperties').and.callThrough();
    spyOn(editorService, 'fetchCollectionHierarchy').and.returnValue(of(questionsetHierarchyRead));
    spyOn(editorService, 'readQuestionSet').and.returnValue(of(questionsetRead));
    spyOn(component, 'showCommentAddedAgainstContent').and.callFake(() => { });
    component.mergeCollectionExternalProperties();
    expect(editorService.fetchCollectionHierarchy).toHaveBeenCalled();
    expect(editorService.readQuestionSet).toHaveBeenCalled();
    expect(component.collectionTreeNodes).toBeDefined();
    expect(component.isTreeInitialized).toBeTruthy();
  });

  it('#mergeCollectionExternalProperties() should call fetchCollectionHierarchy for objectType collection', () => {
    component.objectType = 'collection';
    const editorService = TestBed.inject(EditorService);
    component.editorConfig = editorConfig;
    spyOn(component, 'mergeCollectionExternalProperties').and.callThrough();
    spyOn(editorService, 'fetchCollectionHierarchy').and.returnValue(of(hierarchyResponse));
    spyOn(editorService, 'readQuestionSet').and.callFake(() => { });
    spyOn(component, 'showCommentAddedAgainstContent').and.callFake(() => { });
    component.mergeCollectionExternalProperties();
    expect(editorService.fetchCollectionHierarchy).toHaveBeenCalled();
    expect(editorService.readQuestionSet).not.toHaveBeenCalled();
  });

  it('#sethierarchyConfig() should set #ishierarchyConfigSet', () => {
    component.editorConfig = editorConfig;
    spyOn(component, 'sethierarchyConfig').and.callThrough();
    spyOn(component, 'getHierarchyChildrenConfig').and.callFake(() => {});
    component.sethierarchyConfig(categoryDefinitionData);
    expect(component.getHierarchyChildrenConfig).toHaveBeenCalled();
  });

  it('#toggleCollaboratorModalPoup() should set addCollaborator to true', () => {
    component.addCollaborator = false;
    spyOn(component, 'toggleCollaboratorModalPoup').and.callThrough();
    component.toggleCollaboratorModalPoup();
    expect(component.addCollaborator).toEqual(true);
  });

  it('#toggleCollaboratorModalPoup() should set addCollaborator to false', () => {
    component.addCollaborator = true;
    spyOn(component, 'toggleCollaboratorModalPoup').and.callThrough();
    component.toggleCollaboratorModalPoup();
    expect(component.addCollaborator).toEqual(false);
  });

  it('#toolbarEventListener() should call #saveContent() if event is saveContent', () => {
  spyOn(component, 'saveContent').and.callFake(() => {
    return Promise.resolve();
  });
  const event = {
    button: 'saveContent'
  };
  component.toolbarEventListener(event);
  expect(component.saveContent).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #previewContent() if event is previewContent', () => {
    spyOn(component, 'previewContent').and.callFake(() => { });
    const event = {
      button: 'previewContent'
    };
    component.toolbarEventListener(event);
    expect(component.previewContent).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #showLibraryComponentPage() if event is addFromLibrary', () => {
    spyOn(component, 'showLibraryComponentPage').and.callFake(() => { });
    const event = {
      button: 'addFromLibrary'
    };
    component.toolbarEventListener(event);
    expect(component.showLibraryComponentPage).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #showQuestionLibraryComponentPage() if event is showQuestionLibraryPage', () => {
    spyOn(component, 'showQuestionLibraryComponentPage').and.callFake(() => { });
    const event = {
      button: 'showQuestionLibraryPage'
    };
    component.toolbarEventListener(event);
    expect(component.showQuestionLibraryComponentPage).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #submitHandler() if event is submitContent', () => {
    spyOn(component, 'submitHandler').and.callFake(() => { });
    const event = {
      button: 'submitContent'
    };
    component.toolbarEventListener(event);
    expect(component.submitHandler).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should set #showDeleteConfirmationPopUp to true if event is removeContent', () => {
    const event = {
      button: 'removeContent'
    };
    component.showDeleteConfirmationPopUp = false;
    component.toolbarEventListener(event);
    expect(component.showDeleteConfirmationPopUp).toBeTruthy();
  });

  it('#toolbarEventListener() should call #redirectToQuestionTab() if event is editContent', () => {
    spyOn(component, 'redirectToQuestionTab').and.callFake(() => { });
    const event = { button: 'editContent' };
    component.toolbarEventListener(event);
    expect(component.redirectToQuestionTab).toHaveBeenCalled();
  });


  it('#toolbarEventListener() should call #rejectContent() if event is rejectContent', () => {
    spyOn(component, 'rejectContent').and.callFake(() => { });
    const event = {
      button: 'rejectContent',
      comment: 'abcd'
    };
    component.toolbarEventListener(event);
    expect(component.rejectContent).toHaveBeenCalledWith(event.comment);
  });

  it('#toolbarEventListener() should call #publishContent() if event is publishContent', () => {
    spyOn(component, 'publishContent').and.callFake(() => { });
    const event = {
      button: 'publishContent'
    };
    component.toolbarEventListener(event);
    expect(component.publishContent).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should set formStatusMapper', () => {
    const treeService = TestBed.inject(TreeService);
    spyOn(treeService, 'getActiveNode').and.returnValue({ data: { id: '12345' } });
    const event = {
      button: 'onFormStatusChange',
      event: { isValid: true }
    };
    component.toolbarEventListener(event);
    // tslint:disable-next-line:no-string-literal
    expect(component['formStatusMapper']['12345']).toEqual(true);
  });

  it('#toolbarEventListener() should not set formStatusMapper', () => {
    const treeService = TestBed.inject(TreeService);
    spyOn(treeService, 'getActiveNode').and.returnValue(undefined);
    const event = {
      button: 'onFormStatusChange',
      event: { isValid: true }
    };
    // tslint:disable-next-line:no-string-literal
    component['formStatusMapper'] = undefined;
    component.toolbarEventListener(event);
    // tslint:disable-next-line:no-string-literal
    expect(component['formStatusMapper']).toBeUndefined();
  });

  it('#toolbarEventListener() should call #updateToolbarTitle() if event is onFormValueChange', () => {
    spyOn(component, 'updateToolbarTitle').and.callFake(() => { });
    spyOn(component, 'toolbarEventListener').and.callThrough();
    const event = {
      button: 'onFormValueChange'
    };
    component.toolbarEventListener(event);
    expect(component.toolbarEventListener).toHaveBeenCalledWith(event);
    expect(component.updateToolbarTitle).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #redirectToChapterListTab() if event is backContent', () => {
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => { });
    const event = {
      button: 'backContent'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #redirectToChapterListTab() if event is sendForCorrections', () => {
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => { });
    const event = {
      button: 'sendForCorrections',
      comment: 'test'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #sourcingApproveContent() if event is sourcingApprove', () => {
    spyOn(component, 'sourcingApproveContent').and.callFake(() => { });
    const event = {
      button: 'sourcingApprove',
      comment: 'test'
    };
    component.toolbarEventListener(event);
    expect(component.sourcingApproveContent).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #redirectToChapterListTab() if event is sourcingReject', () => {
    const editorService = TestBed.inject(EditorService);
    const event = {
      button: 'sourcingReject',
      comment: 'test',
    };
    spyOn(component, 'sourcingRejectContent').and.callFake(() => {});
    component.editorConfig = editorConfig;
    component.toolbarEventListener(event);
    expect(component.sourcingRejectContent).toHaveBeenCalledWith({ comment: 'test' });
  });

  it('#toolbarEventListener() should call #toggleCollaboratorModalPoup()', () => {
    const event = {
      button: 'addCollaborator'
    };
    component.addCollaborator = false;
    spyOn(component, 'toggleCollaboratorModalPoup').and.callThrough();
    spyOn(component, 'toolbarEventListener').and.callThrough();
    component.toolbarEventListener(event);
    expect(component.actionType).toBe('addCollaborator');
    expect(component.toggleCollaboratorModalPoup).toHaveBeenCalled();
    expect(component.addCollaborator).toEqual(true);
  });

  it('#toolbarEventListener() should not call #toggleCollaboratorModalPoup()', () => {
    spyOn(component, 'toggleCollaboratorModalPoup');
    const event = {
      button: 'xyz'
    };
    component.toolbarEventListener(event);
    expect(component.actionType).toBe('xyz');
    expect(component.toggleCollaboratorModalPoup).not.toHaveBeenCalled();
  });


  it('#toolbarEventListener() should set showReviewModal to true ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    component.showReviewModal = false;
    const event = {
      button: 'showReviewcomments'
    };
    component.toolbarEventListener(event);
    expect(component.showReviewModal).toEqual(true);
  });

  it('#toolbarEventListener() should set showReviewModal to false ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    component.showReviewModal = true;
    const event = {
      button: 'showReviewcomments'
    };
    component.toolbarEventListener(event);
    expect(component.showReviewModal).toEqual(false);
  });

  it('#toolbarEventListener() should set showReviewModal to true ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    // tslint:disable-next-line:no-string-literal
    component['editorConfig'] = editorConfig;
    component.contentComment = 'change description';
    component.showReviewModal = false;
    const event = {
      button: 'showReviewcomments'
    };
    component.toolbarEventListener(event);
    expect(component.contentComment).toEqual('change description');
    expect(component.showReviewModal).toEqual(true);
  });

  it('#toolbarEventListener() should set showReviewModal to false ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    // tslint:disable-next-line:no-string-literal
    component['editorConfig'] = undefined;
    component.showReviewModal = true;
    const event = {
      button: 'showReviewcomments'
    };
    component.toolbarEventListener(event);
    expect(component.contentComment).toBeUndefined();
    expect(component.showReviewModal).toEqual(false);
  });

  it('#toolbarEventListener() should call redirectToQuestionTab for the case reviewContent', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    spyOn(component, 'redirectToQuestionTab').and.callFake(() => {});
    const event = {
      button: 'reviewContent'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToQuestionTab).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should set pagination ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    const event = {
      button: 'pagination'
    };
    component.pageId = 'pagination';
    component.toolbarEventListener(event);
    expect(component.pageId).toEqual('pagination');
  });

  it('#redirectToChapterListTab() should emit #editorEmitter event', () => {
    component.actionType = 'dummyCase';
    component.collectionId = 'do_12345';
    spyOn(component.editorEmitter, 'emit');
    component.redirectToChapterListTab({ data: 'dummyData' });
    expect(component.editorEmitter.emit).toHaveBeenCalledWith({
      close: true, library: 'collection_editor', action: 'dummyCase', identifier: 'do_12345',
      data: 'dummyData'
    });
  });

  it('#redirectToChapterListTab() should emit #editorEmitter event', () => {
    component.actionType = 'dummyCase';
    component.collectionId = 'do_12345';
    spyOn(component.editorEmitter, 'emit');
    component.redirectToChapterListTab();
    expect(component.editorEmitter.emit).toHaveBeenCalledWith({
      close: true, library: 'collection_editor', action: 'dummyCase', identifier: 'do_12345'
    });
  });

  it('#updateToolbarTitle() should call #getActiveNode() method and set title name as test', () => {
    const treeService = TestBed.inject(TreeService);
    component.toolbarConfig = { title: '' };
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data: { root: true } };
    });
    component.updateToolbarTitle({ event: { name: 'test' } });
    expect(treeService.getActiveNode).toHaveBeenCalled();
    expect(component.toolbarConfig.title).toEqual('test');
  });

  it('#updateToolbarTitle() should call #getActiveNode() method and set title name as Untitled', () => {
    const treeService = TestBed.inject(TreeService);
    component.toolbarConfig = { title: '' };
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data: { root: true } };
    });
    component.updateToolbarTitle({ event: { name: '' } });
    expect(treeService.getActiveNode).toHaveBeenCalled();
    expect(component.toolbarConfig.title).toEqual('Untitled');
  });

  it('#showLibraryComponentPage() should set #addFromLibraryButtonLoader to true and call #saveContent()', () => {
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'checkIfContentsCanbeAdded').and.returnValue(true);
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve();
    });
    component.showLibraryComponentPage();
    expect(component.buttonLoaders.addFromLibraryButtonLoader).toEqual(true);
    expect(component.saveContent).toHaveBeenCalled();
  });

  it('#showLibraryComponentPage should call call saveContent', () => {
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'checkIfContentsCanbeAdded').and.returnValue(false);
    spyOn(component, 'saveContent');
    component.showLibraryComponentPage();
    expect(component.saveContent).not.toHaveBeenCalled();
  });

  it('#showQuestionLibraryComponentPage() should set #addQuestionFromLibraryButtonLoader to false and call #saveContent()',
  fakeAsync(() => {
    const editorService = TestBed.inject(EditorService);
    const treeService = TestBed.get(TreeService);
    editorService.templateList = ['Subjective Question'];
    component.collectionId = 'do_12345';
    component.organisationFramework = 'nit_k12';
    component.editorConfig = editorConfig_question;
    component.libraryComponentInput.searchFormConfig = categoryDefinition.result.objectCategoryDefinition.forms.searchConfig;
    spyOn(treeService, 'getActiveNode').and.returnValue({data: {metadata: {}}});
    spyOn(editorService, 'getContentChildrens').and.returnValue([{}, {}]);
    spyOn(editorService, 'checkIfContentsCanbeAdded').and.returnValue(true);
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve('success');
    });
    spyOn(component, 'showQuestionLibraryComponentPage').and.callThrough();
    component.showQuestionLibraryComponentPage();
    component.saveContent().then(response => {
      expect(treeService.getActiveNode).toHaveBeenCalled();
      expect(component.buttonLoaders.addQuestionFromLibraryButtonLoader).toBeFalsy();
      expect(component.questionlibraryInput).toBeDefined();
      expect(component.pageId).toEqual('question_library');
    });
  }));

  it('#showQuestionLibraryComponentPage should not call saveContent', () => {
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'checkIfContentsCanbeAdded').and.returnValue(false);
    spyOn(component, 'saveContent');
    component.showQuestionLibraryComponentPage();
    expect(component.saveContent).not.toHaveBeenCalled();
  });

  it('#libraryEventListener() should set pageId to collection_editor', async () => {
    component.isEnableCsvAction = false;
    component.isComponenetInitialized = false;
    const res = {};
    spyOn(component, 'mergeCollectionExternalProperties').and.returnValue(of(res));
    spyOn(component, 'libraryEventListener').and.callThrough();
    component.libraryEventListener({});
    expect(component.pageId).toEqual('collection_editor');
    expect(component.isEnableCsvAction).toBeTruthy();
    expect(component.isComponenetInitialized).toBeTruthy();
  });

  it('#onQuestionLibraryChange() should call #addResourceToQuestionset()', () => {
    spyOn(component, 'addResourceToQuestionset').and.callFake(() => {});
    spyOn(component, 'onQuestionLibraryChange').and.callThrough();
    component.onQuestionLibraryChange(
      {action: 'addBulk',
      collectionIds: 'do_12345',
      resourceType: 'Question'
    });
    expect(component.addResourceToQuestionset).toHaveBeenCalled();
  });

  it('#onQuestionLibraryChange() should call #libraryEventListener()', () => {
    spyOn(component, 'libraryEventListener').and.callFake(() => {});
    spyOn(component, 'onQuestionLibraryChange').and.callThrough();
    component.onQuestionLibraryChange({action: 'back'});
    expect(component.libraryEventListener).toHaveBeenCalled();
  });

  it('#addResourceToQuestionset() should call #libraryEventListener()', () => {
    const treeService = TestBed.get(TreeService);
    const editorService = TestBed.get(EditorService);
    spyOn(treeService, 'getActiveNode').and.returnValue({data: {id: 'do_123456'}});
    spyOn(editorService, 'addResourceToQuestionset').and.returnValue(of({responseCode: 'OK'}));
    spyOn(component, 'libraryEventListener').and.callFake(() => {});
    spyOn(component, 'addResourceToQuestionset').and.callThrough();
    component.addResourceToQuestionset('do_12345', 'Question');
    expect(component.libraryEventListener).toHaveBeenCalled();
  });

  it('#addResourceToQuestionset() should call editorService.apiErrorHandling()', () => {
    const treeService = TestBed.get(TreeService);
    const editorService = TestBed.get(EditorService);
    spyOn(treeService, 'getActiveNode').and.returnValue({data: {id: 'do_123456'}});
    spyOn(editorService, 'apiErrorHandling').and.callFake(() => {});
    spyOn(editorService, 'addResourceToQuestionset').and.returnValue(throwError('error'));
    spyOn(component, 'addResourceToQuestionset').and.callThrough();
    component.addResourceToQuestionset('do_12345', 'Question');
    expect(editorService.apiErrorHandling).toHaveBeenCalled();
  });

  it('#saveContent() should call #validateFormStatus()', () => {
    component.objectType = 'questionset';
    const editorService = TestBed.get(EditorService);
    const treeService = TestBed.get(TreeService);
    spyOn(editorService, 'getCollectionHierarchy').and.returnValue({nodesModified: nodesModifiedData});
    spyOn(editorService, 'getMaxScore').and.returnValue(5);
    spyOn(treeService, 'updateMetaDataProperty').and.callFake(() => {});
    spyOn(component, 'validateFormStatus').and.callFake(() => { });
    spyOn(editorService, 'updateHierarchy').and.callFake(() => {});
    spyOn(component, 'saveContent').and.callThrough();
    component.saveContent();
    expect(component.validateFormStatus).toHaveBeenCalled();
  });

  it('#submitHandler() should call #validateFormStatus()', () => {
    spyOn(component, 'validateFormStatus');
    component.submitHandler();
    expect(component.validateFormStatus).toHaveBeenCalled();
  });

  it('#submitHandler() should return true', () => {
    component.toolbarConfig = {
      showDialcode: 'No'
    };
    spyOn(component, 'validateFormStatus').and.callFake(() => {
      return true;
    });
    component.submitHandler();
    expect(component.showConfirmPopup).toEqual(true);
  });

  it('#submitHandler() should return true if showDialcode is yes', () => {
    spyOn(component, 'validateFormStatus').and.callFake(() => {
      return true;
    });
    component.toolbarConfig = {
      showDialcode: 'yes'
    };
    const dialcodeService = TestBed.inject(DialcodeService);
    spyOn(dialcodeService, 'validateUnitsDialcodes').and.callFake(() => {
      return true;
    });
    component.submitHandler();
    expect(component.showConfirmPopup).toEqual(true);
  });

  it('#submitHandler() should return true if showDialcode is yes', () => {
    spyOn(component, 'validateFormStatus').and.callFake(() => {
      return true;
    });
    component.toolbarConfig = {
      showDialcode: 'yes'
    };
    const dialcodeService = TestBed.inject(DialcodeService);
    spyOn(dialcodeService, 'validateUnitsDialcodes').and.callFake(() => {
      return true;
    });
    component.submitHandler();
    expect(dialcodeService.validateUnitsDialcodes).toHaveBeenCalled();
    expect(component.showConfirmPopup).toEqual(true);
  });

  it('#validateFormStatus() should return true', () => {
    const result = component.validateFormStatus();
    expect(result).toEqual(true);
  });

  it('#previewContent() should call #saveContent()', () => {
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve();
    });
    component.previewContent();
    expect(component.saveContent).toHaveBeenCalled();
    expect(component.buttonLoaders.previewButtonLoader).toBeTruthy();
  });

  it('#sendForReview() should call #saveContent()', () => {
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve();
    });
    component.sendForReview();
    expect(component.saveContent).toHaveBeenCalled();
  });

  it('#rejectContent() should call #submitRequestChanges() and #redirectToChapterListTab()', async () => {
    component.collectionId = 'do_1234';
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'submitRequestChanges').and.returnValue(of({}));
    spyOn(component, 'redirectToChapterListTab');
    component.editorConfig = editorConfig;
    component.rejectContent('test');
    expect(editorService.submitRequestChanges).toHaveBeenCalled();
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#rejectContent() should call #submitRequestChanges() and #redirectToChapterListTab() api error', async () => {
    component.collectionId = 'do_1234';
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'submitRequestChanges').and.returnValue(throwError({}));
    component.editorConfig = editorConfig;
    component.rejectContent('test');
    expect(editorService.submitRequestChanges).toHaveBeenCalled();
  });

  it('#publishContent should call #publishContent() and #redirectToChapterListTab()', () => {
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'publishContent').and.returnValue(of({}));
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    component.editorConfig = editorConfig;
    component.publishchecklist = [];
    component.publishContent({});
    expect(editorService.publishContent).toHaveBeenCalled();
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#publishContent should call #publishContent() and #redirectToChapterListTab() api error', () => {
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'publishContent').and.returnValue(throwError({}));
    spyOn(component, 'redirectToChapterListTab');
    component.editorConfig = editorConfig;
    component.publishchecklist = [];
    component.publishContent({});
    expect(editorService.publishContent).toHaveBeenCalled();
    expect(component.redirectToChapterListTab).not.toHaveBeenCalled();
  });

  it('#sourcingApproveContent() should call #redirectToChapterListTab() if event is sourcingApprove', () => {
    const editorService = TestBed.inject(EditorService);
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    spyOn(component, 'validateFormStatus').and.returnValue(true);
    spyOn(editorService, 'updateCollection').and.returnValue(of({}));
    spyOn(component, 'sourcingApproveContent').and.callThrough();
    component.editorConfig = editorConfig;
    component.sourcingApproveContent([]);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#sourcingApproveContent() should not call #redirectToChapterListTab() and call toasterService.error case1', () => {
    component.editorMode = 'sourcingreview';
    component.editorConfig = editorConfig;
    component.publishchecklist = {data: {}};
    const editorService = TestBed.inject(EditorService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    spyOn(component, 'validateFormStatus').and.returnValue(true);
    spyOn(editorService, 'updateCollection').and.returnValue(throwError('error'));
    spyOn(component, 'sourcingApproveContent').and.callThrough();
    component.sourcingApproveContent([]);
    expect(toasterService.error).toHaveBeenCalled();
    expect(component.redirectToChapterListTab).not.toHaveBeenCalled();
  });

  it('#sourcingApproveContent() should not call #redirectToChapterListTab() and call toasterService.error case2', () => {
    component.editorMode = 'sourcingreview';
    component.editorConfig = editorConfig;
    component.publishchecklist = {data: {}};
    const editorService = TestBed.inject(EditorService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'validateFormStatus').and.returnValue(false);
    spyOn(component, 'sourcingApproveContent').and.callThrough();
    component.sourcingApproveContent([]);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#sourcingApproveContent() should call #redirectToChapterListTab() and not call toasterService.error', () => {
    component.editorMode = 'review';
    component.editorConfig = editorConfig;
    component.publishchecklist = {data: {}};
    const editorService = TestBed.inject(EditorService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    component.sourcingApproveContent([]);
    expect(toasterService.error).not.toHaveBeenCalled();
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });


  it('#sourcingRejectContent() should call #redirectToChapterListTab() if event is sourcingApprove', () => {
    const editorService = TestBed.inject(EditorService);
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    spyOn(component, 'validateFormStatus').and.returnValue(true);
    spyOn(editorService, 'updateCollection').and.returnValue(of({}));
    spyOn(component, 'sourcingRejectContent').and.callThrough();
    component.editorConfig = editorConfig;
    component.sourcingRejectContent([]);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#sourcingRejectContent() should not call #redirectToChapterListTab() and call toasterService.error case1', () => {
    component.editorMode = 'sourcingreview';
    component.editorConfig = editorConfig;
    component.editorConfig.config.editableFields = {
      sourcingreview: ['instructions']
    };
    component.publishchecklist = {data: {}};
    const editorService = TestBed.inject(EditorService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    spyOn(component, 'validateFormStatus').and.returnValue(true);
    spyOn(editorService, 'updateCollection').and.returnValue(throwError('error'));
    spyOn(component, 'sourcingRejectContent').and.callThrough();
    component.sourcingRejectContent([]);
    expect(toasterService.error).toHaveBeenCalled();
    expect(component.redirectToChapterListTab).not.toHaveBeenCalled();
  });

  it('#sourcingRejectContent() should not call #redirectToChapterListTab() and call toasterService.error case2', () => {
    component.editorMode = 'sourcingreview';
    component.editorConfig = editorConfig;
    component.publishchecklist = {data: {}};
    const editorService = TestBed.inject(EditorService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'validateFormStatus').and.returnValue(false);
    spyOn(component, 'sourcingRejectContent').and.callThrough();
    component.sourcingRejectContent([]);
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#sourcingRejectContent() should call #redirectToChapterListTab() and not call toasterService.error', () => {
    component.editorMode = 'review';
    component.editorConfig = editorConfig;
    component.publishchecklist = {data: {}};
    const editorService = TestBed.inject(EditorService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    component.sourcingRejectContent([]);
    expect(toasterService.error).not.toHaveBeenCalled();
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#setUpdatedTreeNodeData() should call updateTreeNodeData() when success', () => {
    component.buttonLoaders.previewButtonLoader = true;
    component.showPreview = false;
    const editorService = TestBed.get(EditorService);
    spyOn(editorService, 'fetchCollectionHierarchy').and.returnValue(of(questionsetHierarchyRead));
    component.collectionTreeNodes = undefined;
    spyOn(component, 'setUpdatedTreeNodeData').and.callThrough();
    spyOn(component, 'updateTreeNodeData').and.callFake(() => {});
    component.setUpdatedTreeNodeData();
    expect(editorService.fetchCollectionHierarchy).toHaveBeenCalled();
    expect(component.updateTreeNodeData).toHaveBeenCalled();
    expect(component.buttonLoaders.previewButtonLoader).toBeFalsy();
    expect(component.showPreview).toBeTruthy();
  });

  it('#setUpdatedTreeNodeData() should not call updateTreeNodeData() when error', () => {
    component.buttonLoaders.previewButtonLoader = true;
    const editorService = TestBed.get(EditorService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(editorService, 'fetchCollectionHierarchy').and.returnValue(throwError('error'));
    spyOn(component, 'setUpdatedTreeNodeData').and.callThrough();
    spyOn(component, 'updateTreeNodeData').and.callFake(() => {});
    component.setUpdatedTreeNodeData();
    expect(editorService.fetchCollectionHierarchy).toHaveBeenCalled();
    expect(component.updateTreeNodeData).not.toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
    expect(component.buttonLoaders.previewButtonLoader).toBeFalsy();
  });

  it('#updateTreeNodeData() should call treeService.getFirstChild()', () => {
    component.collectionTreeNodes = {data: undefined};
    const helperService = TestBed.get(HelperService);
    spyOn(helperService, 'hmsToSeconds').and.returnValue('300');
    const treeNodeMockData = treeNodeData;
    // tslint:disable-next-line:no-string-literal
    treeNodeMockData.data.metadata['timeLimits'] = undefined;
    // tslint:disable-next-line:no-string-literal
    treeNodeMockData.data.metadata['maxTime'] = '00:05';
    // tslint:disable-next-line:no-string-literal
    treeNodeMockData.data.metadata['warningTime'] = '00:01';
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getFirstChild').and.returnValue(treeNodeData);
    spyOn(component, 'updateTreeNodeData').and.callThrough();
    component.updateTreeNodeData();
    expect(treeService.getFirstChild).toHaveBeenCalled();
    expect(component.collectionTreeNodes.data).toBeDefined();
  });

  it('#treeEventListener() should call #updateTreeNodeData()', () => {
    const event = { type: 'test' };
    spyOn(component, 'updateTreeNodeData').and.callFake(() => { });
    component.treeEventListener(event);
    expect(component.updateTreeNodeData).toHaveBeenCalled();
  });

  it('#treeEventListener() should call #updateSubmitBtnVisibility() if event type is nodeSelect', () => {
    const event = {
      type: 'nodeSelect',
      data: {
        getLevel() {
          return 2;
        }
      }
    };
    const treeService = TestBed.get(TreeService);
    treeService.nativeElement = nativeElement;
    spyOn(treeService, 'setTreeElement').and.callFake((el) => {
      treeService.nativeElement = nativeElement;
    });
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: treeData } };
    });
    component.collectionTreeNodes = { data: {} };
    spyOn(component, 'updateSubmitBtnVisibility').and.callFake(() => { });
    spyOn(component, 'setTemplateList').and.callFake(() => { });
    component.treeEventListener(event);
    expect(component.updateSubmitBtnVisibility).toHaveBeenCalled();
    expect(component.setTemplateList).toHaveBeenCalled();
  });

  it('#treeEventListener() should set #showDeleteConfirmationPopUp=true if event.type is deleteNode', () => {
    const event = {
      type: 'deleteNode',
      data: {
        getLevel() {
          return 2;
        }
      }
    };
    component.isObjectTypeCollection = false;
    component.editorConfig = editorConfig;
    spyOn(component, 'updateTreeNodeData').and.callFake(() => {
      return true;
    });
    component.treeEventListener(event);
    expect(component.showDeleteConfirmationPopUp).toEqual(true);
  });

  it('#treeEventListener() should call saveContent', () => {
    const event = {
      type: 'createNewContent'
    };
    component.buttonLoaders.addFromLibraryButtonLoader = false;
    spyOn(component, 'updateTreeNodeData').and.callFake(() => { });
    const editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'checkIfContentsCanbeAdded').and.returnValue(true);
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve();
    });
    component.treeEventListener(event);
    expect(component.saveContent).toHaveBeenCalled();
    expect(component.buttonLoaders.addFromLibraryButtonLoader).toBeTruthy();
    expect(component.showQuestionTemplatePopup).toBeFalsy();
  });

  it('#setTemplateList() should set children for rootNode', () => {
    component.templateList = undefined;
    component.editorConfig = questionSetEditorConfig;
    component.isCurrentNodeRoot = true;
    spyOn(component, 'setTemplateList').and.callThrough();
    component.setTemplateList();
    expect(component.templateList).toEqual([]);
  });

  it('#setTemplateList() should set children for level1', () => {
    // tslint:disable-next-line:no-string-literal
    component['editorService']['_editorConfig'] = questionSetEditorConfig;
    component.selectedNodeData = {
      getLevel() {return 2; }
    };
    component.templateList = undefined;
    component.editorConfig = questionSetEditorConfig;
    component.isCurrentNodeRoot = false;
    spyOn(component, 'setTemplateList').and.callThrough();
    component.setTemplateList();
    expect(component.templateList).not.toEqual([]);
  });

  it('#deleteNode() should set #showDeleteConfirmationPopUp false', () => {
    component.collectionTreeNodes = {
      data: {
        childNodes: []
      }
    };
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return {
        data: {
          id: 'do_113264100861919232115'
        }
      };
    });
    spyOn(treeService, 'getChildren').and.callFake(() => {
      return [];
    });
    spyOn(treeService, 'removeNode').and.callFake(() => {
      return true;
    });
    spyOn(treeService, 'getFirstChild').and.callFake(() => {
      return { data: { metadata: treeData } };
    });
    spyOn(component, 'updateSubmitBtnVisibility');
    component.deleteNode();
    expect(treeService.removeNode).toHaveBeenCalled();
    expect(component.updateSubmitBtnVisibility).toHaveBeenCalled();
    expect(component.showDeleteConfirmationPopUp).toEqual(false);
  });

  it('#updateSubmitBtnVisibility() should set toolbarConfig.hasChildren to true', () => {
    component.toolbarConfig = { hasChildren: false };
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getFirstChild').and.returnValue({children: ['Subjective']});
    spyOn(component, 'updateSubmitBtnVisibility').and.callThrough();
    component.updateSubmitBtnVisibility();
    expect(treeService.getFirstChild).toHaveBeenCalled();
    expect( component.toolbarConfig.hasChildren).toBeTruthy();
  });

  it('#updateSubmitBtnVisibility() should set toolbarConfig.hasChildren to false', () => {
    component.toolbarConfig = { hasChildren: true };
    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'getFirstChild').and.returnValue({});
    spyOn(component, 'updateSubmitBtnVisibility').and.callThrough();
    component.updateSubmitBtnVisibility();
    expect(treeService.getFirstChild).toHaveBeenCalled();
    expect( component.toolbarConfig.hasChildren).toBeFalsy();
  });

  it('generateTelemetryEndEvent() ', () => {
    component.editorMode = 'edit';
    component.pageStartTime = '1654413557409';
    const telemetryService = TestBed.get(EditorTelemetryService);
    telemetryService.telemetryPageId = 'questionset_editor';
    spyOn(telemetryService, 'end').and.callFake(() => {});
    spyOn(component, 'generateTelemetryEndEvent').and.callThrough();
    component.generateTelemetryEndEvent();
    expect(telemetryService.end).toHaveBeenCalled();
  });

  it('#handleTemplateSelection should set #showQuestionTemplatePopup to false', () => {
    component.editorConfig = editorConfig;
    component.handleTemplateSelection({});
    expect(component.showQuestionTemplatePopup).toEqual(false);
  });

  it('#handleTemplateSelection should return false', () => {
    const event = { type: 'close' };
    const result = component.handleTemplateSelection(event);
    expect(result).toEqual(false);
  });

  it('#handleTemplateSelection should call editorService.apiErrorHandling', () => {
    const event = 'Multiple Choice Question';
    const editorService = TestBed.get(EditorService);
    component.editorConfig = editorConfig;
    spyOn(editorService, 'apiErrorHandling').and.callFake(() => {});
    spyOn(editorService, 'getCategoryDefinition').and.returnValue(throwError('error'));
    spyOn(component, 'handleTemplateSelection').and.callThrough();
    component.handleTemplateSelection(event);
    expect(editorService.apiErrorHandling).toHaveBeenCalled();
  });

  it('#handleTemplateSelection should call #redirectToQuestionTab()', async () => {
    const event = 'Multiple Choice Question';
    const editorService = TestBed.get(EditorService);
    component.editorConfig = editorConfig;
    component.editorConfig.config.showSourcingStatus = false;
    spyOn(component, 'redirectToQuestionTab').and.callFake(() => {});
    spyOn(editorService, 'getCategoryDefinition').and.returnValue(of(getCategoryDefinitionResponse));
    component.handleTemplateSelection(event);
    expect(component.redirectToQuestionTab).toHaveBeenCalled();
  });

  it('#redirectToQuestionTab() should set pageId as question', () => {
    component.pageId = '';
    component.editorConfig = editorConfig_question;
    component.questionComponentInput = {};
    component.selectedNodeData = SelectedNodeMockData;
    component.collectionId = 'do_113431883451195392169';
    spyOn(component, 'redirectToQuestionTab').and.callThrough();
    component.redirectToQuestionTab('edit');
    expect(component.pageId).toEqual('question');
  });

  it('#redirectToQuestionTab() should set pageId as question when objectType is questionset', () => {
    component.pageId = '';
    component.editorConfig = questionSetEditorConfig;
    component.questionComponentInput = {};
    component.selectedNodeData = SelectedNodeMockData;
    component.objectType = 'questionSet';
    component.collectionId = 'do_113431883451195392169';
    spyOn(component, 'redirectToQuestionTab').and.callThrough();
    component.redirectToQuestionTab('edit', 'choice');
    expect(component.pageId).toEqual('question');
  });

  it('#redirectToQuestionTab() should call getCategoryDefinition', () => {
    component.leafFormConfig = undefined;
    const editorService = TestBed.get(EditorService);
    component.contentComment = 'test';
    component.pageId = '';
    component.editorConfig = questionSetEditorConfig;
    component.editorConfig.config.renderTaxonomy = true;
    component.questionComponentInput = {};
    component.selectedNodeData = SelectedNodeMockData;
    component.objectType = 'questionSet';
    component.collectionId = 'do_113431883451195392169';
    spyOn(component, 'redirectToQuestionTab').and.callThrough();
    spyOn(editorService, 'getCategoryDefinition').and.returnValue(of(categoryDefinition));
    component.redirectToQuestionTab('edit', 'choice');
    expect(editorService.getCategoryDefinition).toHaveBeenCalled();
    expect(component.leafFormConfig).toBeDefined();
    expect(component.pageId).toEqual('question');
  });

  it('#questionEventListener() should set #pageId to collection_editor', () => {
    component.isEnableCsvAction = false;
    component.telemetryService.telemetryPageId = '';
    component.objectType = 'questionSet';
    spyOn(component, 'mergeCollectionExternalProperties').and.returnValue(of({}));
    spyOn(component, 'treeEventListener').and.callFake(() => {});
    component.questionEventListener({type: 'createNewContent'});
    expect(component.pageId).toEqual('collection_editor');
    expect(component.telemetryService.telemetryPageId).toEqual('collection_editor');
    expect(component.isEnableCsvAction).toBeTruthy();
  });

  it('#questionEventListener() should emit event for objectType question', () => {
    const event = { actionType: 'test', identifier: 'test' };
    const expectedParams = {close: true, library: 'collection_editor', action: event.actionType, identifier: event.identifier};
    spyOn(component.editorEmitter, 'emit').and.returnValue(of({}));
    component.objectType = 'question';
    component.questionEventListener(event);
    expect(component.editorEmitter.emit).toHaveBeenCalledWith(expectedParams);
  });

  it('#showCommentAddedAgainstContent should return false', () => {
    component.editorConfig = editorConfig_question;
    component.collectionTreeNodes = { data:
      {
        status: 'Live',
        rejectComment: 'test'
      }
    };
    spyOn(component, 'showCommentAddedAgainstContent').and.callThrough();
    const result = component.showCommentAddedAgainstContent();
    expect(result).toBeFalsy();
  });

  it('#showCommentAddedAgainstContent should return true', () => {
    component.editorConfig = editorConfig_question;
    component.collectionTreeNodes = {
      data: {
        status: 'Draft',
        prevStatus: 'Review',
        rejectComment: 'test'
      }
    };
    spyOn(component, 'showCommentAddedAgainstContent').and.callThrough();
    const result = component.showCommentAddedAgainstContent();
    expect(component.contentComment).toEqual('test');
    expect(result).toBeTruthy();
  });

  it('#handleCsvDropdownOptionsOnCollection should set dropdown status initially', () => {
    spyOn(component, 'setCsvDropDownOptionsDisable').and.callFake(() => {});
    component.isTreeInitialized = true;
    component.handleCsvDropdownOptionsOnCollection();
    expect(component.isEnableCsvAction).toBeTruthy();
    expect(component.isTreeInitialized).toBeFalsy();
    expect(component.setCsvDropDownOptionsDisable).toHaveBeenCalledWith(true);
  });

  it('#handleCsvDropdownOptionsOnCollection should set isEnableCsvAction status false', () => {
    component.isEnableCsvAction = true;
    component.isTreeInitialized = false;
    spyOn(component, 'setCsvDropDownOptionsDisable').and.callFake(() => {});
    component.handleCsvDropdownOptionsOnCollection();
    expect(component.isEnableCsvAction).toBeFalsy();
    expect(component.isTreeInitialized).toBeFalsy();
    expect(component.setCsvDropDownOptionsDisable).toHaveBeenCalledWith(true);
  });

  it('#onClickFolder() should call setCsvDropDownOptionsDisable when isComponenetInitialized is true', () => {
    component.isComponenetInitialized = true;
    spyOn(component, 'setCsvDropDownOptionsDisable').and.callFake(() => {});
    spyOn(component, 'onClickFolder').and.callThrough();
    component.onClickFolder();
    expect(component.setCsvDropDownOptionsDisable).toHaveBeenCalledWith();
    expect(component.isComponenetInitialized).toBeFalsy();
  });

  it('#onClickFolder() should call setCsvDropDownOptionsDisable when isEnableCsvAction is true', () => {
    component.isEnableCsvAction = true;
    component.isComponenetInitialized = false;
    spyOn(component, 'setCsvDropDownOptionsDisable').and.callFake(() => {});
    component.onClickFolder();
    expect(component.setCsvDropDownOptionsDisable).toHaveBeenCalledWith();
  });

  it('#onClickFolder() should not call setCsvDropDownOptionsDisable', () => {
    component.isEnableCsvAction = false;
    component.isComponenetInitialized = false;
    spyOn(component, 'setCsvDropDownOptionsDisable').and.callFake(() => {});
    component.onClickFolder();
    expect(component.setCsvDropDownOptionsDisable).not.toHaveBeenCalledWith();
  });

  it('#setCsvDropDownOptionsDisable and should set csv dropdown options', () => {
    component.csvDropDownOptions = {
      isDisableCreateCsv: true,
      isDisableUpdateCsv: true,
      isDisableDownloadCsv: true
    };
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'getHierarchyFolder').and.returnValue([1]);
    component.setCsvDropDownOptionsDisable(true);
    expect(component.csvDropDownOptions.isDisableCreateCsv).toBeTruthy();
    expect(component.csvDropDownOptions.isDisableUpdateCsv).toBeTruthy();
    expect(component.csvDropDownOptions.isDisableDownloadCsv).toBeTruthy();
  });

  it('#setCsvDropDownOptionsDisable and should set csv dropdown options for empty childs', () => {
    component.csvDropDownOptions = {
      isDisableCreateCsv: true,
      isDisableUpdateCsv: true,
      isDisableDownloadCsv: true
    };
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'getHierarchyFolder').and.returnValue([]);
    component.setCsvDropDownOptionsDisable();
    expect(component.csvDropDownOptions.isDisableCreateCsv).toBeFalsy();
    expect(component.csvDropDownOptions.isDisableUpdateCsv).toBeTruthy();
    expect(component.csvDropDownOptions.isDisableDownloadCsv).toBeTruthy();
  });

  it('#downloadHierarchyCsv() should call downloadHierarchyCsv and success case', () => {
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'downloadHierarchyCsv').and.returnValue(of(csvExport.successExport));
    spyOn(component, 'downloadCSVFile').and.callThrough();
    component.downloadHierarchyCsv();
    expect(component.downloadCSVFile).toHaveBeenCalledWith(csvExport.successExport.result.collection.tocUrl);
  });

  it('#downloadHierarchyCsv() should call downloadHierarchyCsv and error case', () => {
    component.collectionId = 'do_11331581945782272012';
    spyOn(toasterService, 'error').and.callFake(() => {});
    // tslint:disable-next-line:no-string-literal
    spyOn(component['editorService'], 'downloadHierarchyCsv').and.returnValue(throwError(csvExport.errorExport));
    spyOn(component, 'downloadCSVFile').and.callThrough();
    component.downloadHierarchyCsv();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it('#isReviewMode should return editor mode status', () => {
    spyOn(component, 'isReviewMode').and.returnValue(true);
    const value = component.isReviewMode();
    expect(value).toBeTruthy();
  });

  it('#downloadFile() should download the file', () => {
    component.collectionId = 'do_113274017771085824116';
    // tslint:disable-next-line:max-line-length
    const blobUrl = 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/course/toc/do_11331579492804198413_untitled-course_1625465046239.csv';
    const editorService = TestBed.get(EditorService);
    spyOn(window, 'open').and.callFake(() => {});
    component.downloadCSVFile(blobUrl);
    expect(window.open).toHaveBeenCalled();
  });

  it('#hanndleCsvEmitter should check for closeModal conditions', () => {
    const event = { type: 'closeModal' };
    component.hanndleCsvEmitter(event);
    expect(component.showCsvUploadPopup).toBeFalsy();
  });

  it('#hanndleCsvEmitter should check for downloadCsv conditions', () => {
    spyOn(component, 'mergeCollectionExternalProperties').and.returnValue(of(hirearchyGet));
    const event = { type: 'updateHierarchy' };
    component.hanndleCsvEmitter(event);
    expect(component.mergeCollectionExternalProperties).toHaveBeenCalled();
    expect(component.pageId).toEqual('collection_editor');
    expect(component.telemetryService.telemetryPageId).toEqual('collection_editor');
    expect(component.isEnableCsvAction).toBeTruthy();
  });

  it('#hanndleCsvEmitter should check for create csv conditions', () => {
    const event = { type: 'createCsv' };
    component.hanndleCsvEmitter(event);
    expect(component.showCsvUploadPopup).toBeTruthy();
    expect(component.isCreateCsv).toBeTruthy();
  });

  it('#hanndleCsvEmitter should check for updateCsv conditions', () => {
    const event = { type: 'updateCsv' };
    component.hanndleCsvEmitter(event);
    expect(component.showCsvUploadPopup).toBeTruthy();
    expect(component.isCreateCsv).toBeFalsy();
  });

  it('#hanndleCsvEmitter should check for downloadCsv conditions', () => {
    spyOn(component, 'downloadHierarchyCsv').and.callFake(() => {});
    const event = { type: 'downloadCsv' };
    component.hanndleCsvEmitter(event);
    expect(component.downloadHierarchyCsv).toHaveBeenCalled();
  });

  it('#onFormStatusChange() should store form status when form state changed', () => {
    const formStatus = {isValid: true};
    const expectedResult = { do_12345 : true };
    const treeService = TestBed.inject(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data: { id: 'do_12345' } };
    });
    component.onFormStatusChange(formStatus);
    // tslint:disable-next-line:no-string-literal
    expect(component['formStatusMapper']).toEqual(expectedResult);
  });

  it('#ngOnDestroy should call modal.deny()', () => {
    component.telemetryService = undefined;
    component.treeService = undefined;
    component.unSubscribeShowLibraryPageEmitter = undefined;
    component.unSubscribeshowQuestionLibraryPageEmitter = undefined;
    const treeService = TestBed.get(TreeService);
    // tslint:disable-next-line:no-string-literal
    component['modal'] = {
      deny: jasmine.createSpy('deny')
    };
    spyOn(treeService, 'clearTreeCache').and.callFake(() => {});
    spyOn(component, 'generateTelemetryEndEvent');
    component.ngOnDestroy();
    expect(component.generateTelemetryEndEvent).not.toHaveBeenCalled();
    expect(treeService.clearTreeCache).not.toHaveBeenCalled();
    // tslint:disable-next-line:no-string-literal
    expect(component['modal'].deny).toHaveBeenCalled();
  });

  it('#assignPageEmitterListener should call', () => {
    spyOn(component, 'assignPageEmitterListener').and.callThrough();
    component.assignPageEmitterListener({});
    expect(component.pageId).toEqual('collection_editor');
  });

  it('#setAllowEcm should call for obs with rubrics', () => {
    spyOn(component, 'setAllowEcm').and.callThrough();
    const control = {
      isVisible: 'no',
    };
    component.setAllowEcm(control, []);
  });

  // it('#fetchFrameWorkDetails should set collectionTreeNodes for categoryInstance', () => {
  //   component.organisationFramework = 'tpd';
  //   component.collectionTreeNodes = {
  //     data : {
  //       children : undefined
  //     }
  //   };
  //   component.editorConfig = editorConfig;
  //   const frameworkService = TestBed.inject(FrameworkService);
  //   frameworkService.organisationFramework ='tpd';
  //   spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
  //   // spyOn(frameworkService, 'frameworkData$').and.returnValue(of(frameworkData));
  //   // component.initializeFrameworkAndChannel();
  //   frameworkService.organisationFramework = 'tpd';
  //   spyOn(frameworkService, 'getFrameworkCategories').and.returnValue(of(frameworkData));
  //   // frameworkService.initialize('tpd');
  //   component.fetchFrameWorkDetails();
  //   expect(component.organisationFramework).toBe('tpd');
  //   // expect(component.collectionTreeNodes.data.children).toBeDefined();
  // });

  it('fetchFrameWorkDetails should set collectionTreeNodes', () => {
    component.collectionTreeNodes = {
        data: {
            children: undefined
        }
    };
    component.editorConfig = editorConfig;
    const frameworkService = TestBed.get(FrameworkService);
    frameworkService.organisationFramework = 'tpd';
    // tslint:disable-next-line:max-line-length
    frameworkService.frameworkData$ = of({frameworkdata: {tpd: of({'frameworkdata' : frameworkData})}});
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    component.fetchFrameWorkDetails();
  });

});

