import { QuestionService } from "./../../services/question/question.service";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { QuestionComponent } from "./question.component";
import { Router } from "@angular/router";
import { PlayerService } from "../../services/player/player.service";
import { EditorTelemetryService } from "../../services/telemetry/telemetry.service";
import { EditorService } from "../../services/editor/editor.service";
import { ToasterService } from "../../services/toaster/toaster.service";
import { EditorCursor } from "../../collection-editor-cursor.service";
import { TreeService } from "../../services/tree/tree.service";
import { SuiModule } from "ng2-semantic-ui-v9";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TelemetryInteractDirective } from "../../directives/telemetry-interact/telemetry-interact.directive";
import {
  collectionHierarchyMock,
  creationContextMock,
  mockData,
  readQuestionMock,
  mockTreeService,
  leafFormConfigMock,
  sourcingSettingsMock,
  childMetaData,
  HierarchyMockData,
  BranchingLogic,
  mockEditorCursor,
} from "./question.component.spec.data";
import { of, throwError } from "rxjs";

const mockEditorService = {
  editorConfig: {
    config: {
      hierarchy: {
        level1: {
          name: "Module",
          type: "Unit",
          mimeType: "application/vnd.ekstep.content-collection",
          contentType: "Course Unit",
          iconClass: "fa fa-folder-o",
          children: {},
        },
      },
    },
  },
  parentIdentifier: "",
  optionsLength:4,
  selectedChildren: {
    primaryCategory: "Multiselect Multiple Choice Question",
    label: "Multiple Choice Question",
    interactionType: "choice",
  },
  getToolbarConfig: () => {},
  _toFlatObj: () => {},
  fetchCollectionHierarchy: (questionSetId) => {
    subscribe: (fn) => fn(collectionHierarchyMock);
  },
  updateCollection: (questionSetId, event) => {
    subscribe: (fn) => fn({});
  },
  addResourceToQuestionset: (questionSetId, unitId, questionId) => {
    subscribe: (fn) => fn({});
  },
  apiErrorHandling: () => {},
};

describe("QuestionComponent", () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let treeService, editorService, telemetryService, questionService;
  class RouterStub {
    navigate = jasmine.createSpy("navigate");
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionComponent, TelemetryInteractDirective],
      imports: [HttpClientTestingModule, SuiModule],
      providers: [
        EditorTelemetryService,
        QuestionService,
        ToasterService,
        PlayerService,
        { provide: EditorService, useValue: mockEditorService },
        { provide: Router, useClass: RouterStub },
        EditorCursor,
        { provide: TreeService, useValue: mockTreeService },
        { provide: EditorCursor, useValue: mockEditorCursor },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    component.questionInput = {
      questionSetId: "do_11330102570702438417",
      questionId: "do_1134357224765685761203",
      setChildQueston:undefined
    };
    component.questionId = "do_1134357224765685761203";
    component.questionInteractionType = "choice";
    editorService = TestBed.inject(EditorService);
    telemetryService = TestBed.inject(EditorTelemetryService);
    treeService = TestBed.get(TreeService);
    questionService = TestBed.get(QuestionService);
    spyOn(telemetryService, "impression").and.callFake(() => {});
    editorService.selectedChildren.label = "Slider";
    component.toolbarConfig.showPreview = false;
    component.creationContext = creationContextMock;
    editorService.optionsLength=4;
    editorService.selectedChildren.label="MCQ"
    component.questionInput = {
      questionSetId: "do_11330102570702438417",
      questionId: "do_11330103476396851218",
      type: undefined,
      category: "MTF",
      config: {},
      creationContext: creationContextMock,
      setChildQueston: undefined,
    };
    component.showTranslation = false;

    // fixture.detectChanges();
  });

  it("should create", () => {
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "true",
    });
    expect(component).toBeTruthy();
  });

  it("Unit test for #ngOnInit()", () => {
    component.toolbarConfig = editorService.toolbarConfig;
    component.questionFormConfig=leafFormConfigMock;
    component.questionInput = {
      questionSetId: "do_11330102570702438417",
      questionId: "do_11330103476396851218",
      type: undefined,
      category: "MTF",
      config: {},
      creationContext: creationContextMock,
      setChildQueston: undefined,
    };
    component.creationContext.objectType = "question";
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "",
    });
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    spyOn(questionService, "readQuestion").and.returnValue(
      of(readQuestionMock)
    );
    component.ngOnInit();
    expect(component.questionInteractionType).toEqual("choice");
    expect(component.questionCategory).toEqual("MTF");
    expect(component.questionId).toEqual("do_11330103476396851218");
    expect(component.questionSetId).toEqual("do_11330102570702438417");
    expect(component.creationContext).toEqual(creationContextMock);
    expect(component.unitId).toEqual(creationContextMock.unitIdentifier);
    expect(component.isReadOnlyMode).toEqual(
      creationContextMock.isReadOnlyMode
    );
    expect(component.toolbarConfig).toBeDefined();
    expect(component.toolbarConfig.showPreview).toBeFalsy();
    expect(component.questionInput.setChildQueston).toBeFalsy();
  });

  it("Unit test for #ngOnInit() fetchCollectionHierarchy api fail case", () => {
    spyOn(component, "ngOnInit").and.callThrough();
    component.toolbarConfig = editorService.toolbarConfig;
    component.questionFormConfig=leafFormConfigMock;
    component.questionInput = {
      questionSetId: "do_11330102570702438417",
      questionId: "do_11330103476396851218",
      type: "default",
      category: "MTF",
      config: {},
      creationContext: creationContextMock,
      setChildQueston:true
    };
    component.creationContext.objectType = "question";
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "",
    });
    spyOn(editorService, "fetchCollectionHierarchy").and.returnValue(
      throwError("error")
    );
    spyOn(questionService, "readQuestion").and.returnValue(
      of(readQuestionMock)
    );
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.questionInput.setChildQueston).toBeTruthy();
  });

  it("#initialize should call when question page for question mcq", () => {
    spyOn(component, "initialize").and.callThrough();
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    component.questionPrimaryCategory=undefined;
    component.initialLeafFormConfig = leafFormConfigMock;
    component.leafFormConfig = leafFormConfigMock;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionId = "do_123";
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.mcqQuestionMetaData)
    );
    component.questionMetaData = mockData.mcqQuestionMetaData.result.question;
    component.questionInteractionType = "choice";
    component.scoreMapping =
      mockData.mcqQuestionMetaData.result.question.responseDeclaration.response1.mapping;
    component.sourcingSettings = sourcingSettingsMock;
    component.questionInput.setChildQuestion = false;
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question mcq api fail", () => {
    spyOn(component, "initialize").and.callThrough();
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return throwError("error");
    });
    component.questionId = "do_123";
    spyOn(editorService, "apiErrorHandling").and.callFake(() => {});
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question slider", () => {
    spyOn(component, "initialize").and.callThrough();
    component.questionId = "do_11330103476396851218";
    component.questionInteractionType = "slider";
    editorService.parentIdentifier = undefined;
    component.questionPrimaryCategory = "Slider";
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    component.questionId = "do_1234";
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.sliderQuestionMetaData)
    );
    component.questionMetaData =
      mockData.sliderQuestionMetaData.result.question;
    component.editorState =
      mockData.sliderQuestionMetaData.result.question.editorState;
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question text", () => {
    spyOn(component, "initialize").and.callThrough();
    component.questionInteractionType = "text";
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    component.questionId = "do_1235";
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.textQuestionNetaData)
    );
    component.questionMetaData = mockData.textQuestionNetaData.result.question;
    component.editorState =
      mockData.textQuestionNetaData.result.question.editorState;
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question date", () => {
    spyOn(component, "initialize").and.callThrough();
    component.questionInteractionType = 'date';
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionId = "do_126";
    component.questionPrimaryCategory = undefined;
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.dateQuestionMetaDate)
    );
    component.questionMetaData = mockData.dateQuestionMetaDate.result.question;
    component.editorState =
      mockData.dateQuestionMetaDate.result.question.editorState;
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question default", () => {
    spyOn(component, "initialize").and.callThrough();
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.defaultQuestionMetaData)
    );
    component.questionMetaData =
      mockData.defaultQuestionMetaData.result.question;
    component.questionInteractionType = "default";
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question mcq", () => {
    spyOn(component, "initialize").and.callThrough();
    component.initialLeafFormConfig = leafFormConfigMock;
    component.leafFormConfig = leafFormConfigMock;
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionId = undefined;
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.mcqQuestionMetaData)
    );
    component.questionMetaData = mockData.mcqQuestionMetaData.result.question;
    component.editorState =
      mockData.mcqQuestionMetaData.result.question.editorState;
    spyOn(editorService, "apiErrorHandling").and.callFake(() => {});
    component.questionMetaData = mockData.mcqQuestionMetaData;
    component.questionInteractionType = "choice";
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question slider", () => {
    spyOn(component, "initialize").and.callThrough();
    component.initialLeafFormConfig = leafFormConfigMock;
    component.leafFormConfig = leafFormConfigMock;
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionId = undefined;
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.sliderQuestionMetaData)
    );
    component.questionMetaData = mockData.sliderQuestionMetaData;
    component.questionInteractionType = "slider";
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question text", () => {
    spyOn(component, "initialize").and.callThrough();
    component.initialLeafFormConfig = leafFormConfigMock;
    component.leafFormConfig = leafFormConfigMock;
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionId = undefined;
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.textQuestionNetaData)
    );
    component.questionMetaData = mockData.textQuestionNetaData;
    component.questionInteractionType = "text";
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question date", () => {
    spyOn(component, "initialize").and.callThrough();
    component.initialLeafFormConfig = leafFormConfigMock;
    component.leafFormConfig = leafFormConfigMock;
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "false",
    });
    component.toolbarConfig.showPreview = false;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.dateQuestionMetaDate)
    );
    component.questionMetaData = mockData.dateQuestionMetaDate;
    component.questionInteractionType = "date";
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#toolbarEventListener() should call toolbarEventListener for saveContent", () => {
    const event = { button: "saveContent" };
    component.actionType = event.button;
    spyOn(component, "saveContent");
    component.toolbarEventListener(event);
    expect(component.toolbarEventListener).toHaveBeenCalledWith;
  });

  it("#toolbarEventListener() should call toolbarEventListener for showTranslation", () => {
    spyOn(component, "toolbarEventListener").and.callThrough();
    const event = { button: "showTranslation" };
    component.actionType = event.button;
    component.toolbarEventListener(event);
    expect(component.toolbarEventListener).toHaveBeenCalledWith(event);
    expect(component.showTranslation).toBe(true);
  });

  it("#toolbarEventListener() should call toolbarEventListener for cancelContent", () => {
    const data = { button: "cancelContent" };
    spyOn(component, "handleRedirectToQuestionset");
    component.toolbarEventListener(data);
    expect(component.handleRedirectToQuestionset).toHaveBeenCalled();
  });
  it("#toolbarEventListener() should call toolbarEventListener for backContent", () => {
    const data = { button: "backContent" };
    spyOn(component, "handleRedirectToQuestionset");
    component.toolbarEventListener(data);
    expect(component.handleRedirectToQuestionset).toHaveBeenCalled();
  });
  it("#toolbarEventListener() should call toolbarEventListener for previewContent", () => {
    const data = { button: "previewContent" };
    spyOn(component, "previewContent");
    component.toolbarEventListener(data);
    expect(component.previewContent).toHaveBeenCalled();
  });
  it("#toolbarEventListener() should call toolbarEventListener for editContent", () => {
    const data = { button: "editContent" };
    spyOn(component, "previewFormData");
    component.toolbarEventListener(data);
    expect(component.previewFormData).toHaveBeenCalledWith(true);
    expect(component.showPreview).toBeFalsy();
    expect(component.toolbarConfig.showPreview).toBeFalsy();
  });
  it("#toolbarEventListener() should call toolbarEventListener for submitQuestion", () => {
    const data = { button: "submitQuestion" };
    spyOn(component, "submitHandler");
    component.toolbarEventListener(data);
    expect(component.submitHandler).toHaveBeenCalledWith();
  });
  it("#toolbarEventListener() should call toolbarEventListener for rejectQuestion", () => {
    const data = { button: "rejectQuestion", comment: "test comment" };
    spyOn(component, "rejectQuestion");
    component.toolbarEventListener(data);
    expect(component.rejectQuestion).toHaveBeenCalledWith(data.comment);
  });
  it("#toolbarEventListener() should call toolbarEventListener for publishQuestion", () => {
    const data = { button: "publishQuestion" };
    spyOn(component, "publishQuestion");
    component.toolbarEventListener(data);
    expect(component.publishQuestion).toHaveBeenCalledWith(data);
  });
  it("#toolbarEventListener() should call toolbarEventListener for sourcingApproveQuestion", () => {
    const data = { button: "sourcingApproveQuestion" };
    spyOn(component, "sourcingUpdate");
    component.toolbarEventListener(data);
    expect(component.sourcingUpdate).toHaveBeenCalledWith(data);
  });
  it("#toolbarEventListener() should call toolbarEventListener for sourcingRejectQuestion", () => {
    const data = { button: "sourcingRejectQuestion" };
    spyOn(component, "sourcingUpdate");
    component.toolbarEventListener(data);
    expect(component.sourcingUpdate).toHaveBeenCalledWith(data);
  });
  it("#toolbarEventListener() should call toolbarEventListener for showReviewcomments", () => {
    const data = { button: "showReviewcomments" };
    component.showReviewModal = true;
    component.toolbarEventListener(data);
    expect(component.showReviewModal).toBeFalsy();
  });
  it("#toolbarEventListener() should call toolbarEventListener for sendForCorrectionsQuestion", () => {
    const data = { button: "sendForCorrectionsQuestion" };
    spyOn(component, "sendBackQuestion");
    component.toolbarEventListener(data);
    expect(component.sendBackQuestion).toHaveBeenCalledWith(data);
  });
  it("#toolbarEventListener() should call toolbarEventListener for default case", () => {
    const data = { button: "" };
    spyOn(component, "toolbarEventListener");
    component.toolbarEventListener(data);
    expect(component.toolbarEventListener).toHaveBeenCalledWith(data);
  });

  it("Unit test for #populateFormData ", () => {
    component.childFormData={};
    component.leafFormConfig = mockData.childMetadata.properties;
    component.initialLeafFormConfig=mockData.childMetadata.properties;
    component.questionId = 'do_123';
    component.questionSetHierarchy=collectionHierarchyMock.result.questionSet;
    component.questionFormConfig=mockData.childMetadata.properties;
    component.populateFormData();
  });
  it("should call previewFormData ", () => {
    spyOn(component,'previewFormData').and.callThrough();
    component.initialLeafFormConfig=mockData.childMetadata.properties;
    component.childFormData=childMetaData;
    component.questionFormConfig=mockData.childMetadata.properties;
    component.leafFormConfig = mockData.childMetadata.properties;
    component.previewFormData(true);
    expect(component.leafFormConfig).toEqual(mockData.childMetadata.properties);
    expect(component.previewFormData).toHaveBeenCalled();
  });
  it("should call valueChanges", () => {
    component.valueChanges(mockData.formData);
    expect(component.childFormData).toEqual(mockData.formData);
  });
  it("should call validateFormFields", () => {
    component.leafFormConfig = mockData.childMetadata;
    component.childFormData = mockData.formData;
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, "error").and.callThrough();
    component.validateFormFields();
    expect(component.showFormError).toBeFalsy();
  });

  it("#populateFrameworkData() should call populateFrameworkData and set leafFormConfig values ", () => {
    component.frameworkDetails.frameworkData =
      mockData.frameWorkDetails.frameworkData;
    component.questionFormConfig = leafFormConfigMock;
    component.leafFormConfig = leafFormConfigMock;
    component.populateFrameworkData();
    expect(component.leafFormConfig).toBeDefined();
  });
  it("#outputData() should call outputData", () => {
    spyOn(component, "output").and.callThrough();
    component.output({});
    expect(component.output).toHaveBeenCalled();
  });
  it("#onStatusChanges() should call onStatusChanges", () => {
    spyOn(component, "onStatusChanges");
    component.onStatusChanges("");
    expect(component.onStatusChanges).toHaveBeenCalled();
  });

  it("#setQuestionTitle() should set #toolbarConfig.title for question", () => {
    spyOn(component, "setQuestionTitle").and.callThrough();
    creationContextMock.objectType='question';
    component.creationContext = creationContextMock;
    component.questionPrimaryCategory = "Subjective Question";
    component.setQuestionTitle();
    expect(component.toolbarConfig.title).toBe("Subjective Question");
    expect(component.setQuestionTitle).toHaveBeenCalled();
  });

  it("call #getMcqQuestionHtmlBody() to verify questionBody", () => {
    const question = "<p>Objective 1</p>";
    const templateId = "mcq-vertical";
    let result = component.getMcqQuestionHtmlBody(question, templateId);
    expect(result).toBeDefined();
  });

  it("Unit test for #sendForReview", () => {
    spyOn(component, "upsertQuestion");
    component.sendForReview();
    expect(component.upsertQuestion).toHaveBeenCalled();
  });

  it("Unit test for #setQuestionId", () => {
    spyOn(component, "setQuestionTitle");
    component.setQuestionId("do_11330103476396851218");
    expect(component.questionId).toEqual("do_11330103476396851218");
    expect(component.setQuestionTitle);
  });

  it("#submitHandler() should call #validateQuestionData and #validateFormFields", () => {
    spyOn(component, "validateQuestionData");
    spyOn(component, "validateFormFields");
    component.showFormError = false;
    component.submitHandler();
    expect(component.validateQuestionData).toHaveBeenCalledWith();
    expect(component.validateFormFields).toHaveBeenCalledWith();
  });
  it("#rejectQuestion() should call #requestForChanges", () => {
    const comment = "test comment";
    spyOn(component, "requestForChanges");
    component.showFormError = false;
    component.rejectQuestion(comment);
    expect(component.requestForChanges).toHaveBeenCalledWith(comment);
  });
  it("#handleRedirectToQuestionset() should call handleRedirectToQuestionset and redirectToQuestionset to be called ", () => {
    component.questionId = "do_11326368076523929611";
    spyOn(component, "redirectToQuestionset");
    component.handleRedirectToQuestionset();
    expect(component.showConfirmPopup).toBeFalsy();
    expect(component.redirectToQuestionset).toHaveBeenCalled();
  });
  it("redirectToQuestionset should call handleRedirectToQuestionset and set showConfirmPopup", () => {
    component.questionId = undefined;
    spyOn(component, "redirectToQuestionset");
    component.handleRedirectToQuestionset();
    expect(component.showConfirmPopup).toBeTruthy();
  });
  it("Unit test for #showHideSpinnerLoader", () => {
    component.showHideSpinnerLoader(true, "review");
    expect(component.buttonLoaders.saveButtonLoader).toEqual(true);
    expect(component.buttonLoaders.review).toEqual(true);
  });
  it("Unit test for #isEditable", () => {
    component.creationContext = creationContextMock;
    expect(component.isEditable("bloomsLevel")).toBeFalsy();
  });
  it("Unit test for #prepareQuestionBody", () => {
    spyOn(component, "prepareQuestionBody").and.callThrough();
    component.prepareQuestionBody();
    expect(component.prepareQuestionBody).toHaveBeenCalled();
  });
  it("#saveContent() should call saveContent and set showFormError ", () => {
    spyOn(component, "validateQuestionData");
    spyOn(component, "validateFormFields");
    spyOn(component, "saveQuestion");
    component.showFormError = false;
    component.saveContent();
    expect(component.showFormError).toBeFalsy();
    expect(component.saveQuestion).toHaveBeenCalled();
  });
  it("#redirectToQuestionset() should call redirectToQuestionset and set showConfirmPopup", () => {
    spyOn(component.questionEmitter, "emit");
    component.redirectToQuestionset();
    expect(component.showConfirmPopup).toBeFalsy();
  });
  it("#editorDataHandler() should call editorDataHandler for not any type", () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData);
    expect(component.editorState).toBeDefined();
  });
  it("#editorDataHandler() should call editorDataHandler for question", () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData, "question");
    expect(component.editorState).toBeDefined();
  });
  it("#editorDataHandler() should call editorDataHandler for solution", () => {
    component.editorState = mockData.editorState;
    component.editorDataHandler(mockData.eventData, "solution");
    expect(component.editorState).toBeDefined();
  });
  it("#editorDataHandler() should call editorDataHandler for media", () => {
    component.editorState = mockData.editorState;
    mockData.eventData.mediaobj = { id: "1234" };
    spyOn(component, "setMedia");
    component.editorDataHandler(mockData.eventData);
    expect(component.editorState).toBeDefined();
    expect(component.setMedia).toHaveBeenCalledWith(
      mockData.eventData.mediaobj
    );
  });
  it("#setMedia should call setMedia and set media arry", () => {
    component.editorState = mockData.editorState;
    component.mediaArr = [{ id: "6789" }];
    component.setMedia({ id: "1234" });
    expect(component.mediaArr).toBeDefined();
  });
  it("#saveQuestion() should call saveQuestion for updateQuestion throw error", () => {
    component.editorState = mockData.editorState;
    component.questionId = "do_11326368076523929611";
    spyOn(component, "updateQuestion");
    component.creationContext = creationContextMock;
    spyOn(questionService, "upsertQuestion").and.returnValue(
      throwError("error")
    );
    component.saveQuestion();
    expect(component.updateQuestion);
  });

  it("#saveQuestion() should call saveQuestion for updateQuestion objectType not a question", () => {
    component.editorState = mockData.editorState;
    component.questionId = "do_11326368076523929611";
    spyOn(component, "updateQuestion");
    creationContextMock.objectType = "questionSet";
    component.creationContext = creationContextMock;
    spyOn(questionService, "upsertQuestion").and.returnValue(
      of({
        result: {
          identifiers: {
            "1234": "do_123",
          },
        },
      })
    );
    component.saveQuestion();
    expect(component.updateQuestion);
  });

  it("#saveQuestion() should call saveQuestion for updateQuestion api error when there is question id", () => {
    component.editorState = mockData.editorState;
    component.questionId = "do_11326368076523929611";
    spyOn(component, "updateQuestion");
    creationContextMock.objectType = "QuestionSet";
    component.creationContext = creationContextMock;
    spyOn(questionService, "upsertQuestion").and.returnValue(
      throwError("error")
    );
    component.saveQuestion();
    expect(component.updateQuestion);
  });
  it("#saveQuestion() should call saveQuestion for updateQuestion api error when new question", () => {
    component.editorState = mockData.editorState;
    component.questionId = undefined;
    spyOn(component, "updateQuestion");
    creationContextMock.objectType = "QuestionSet";
    component.creationContext = creationContextMock;
    component.childFormData = mockData.formData;
    spyOn(questionService, "updateHierarchyQuestionCreate").and.returnValue(
      throwError("error")
    );
    component.saveQuestion();
    expect(component.updateQuestion);
  });

  it("#saveQuestion() should call saveQuestion for updateQuestion save successfully", () => {
    component.editorState = mockData.editorState;
    component.questionId = undefined;
    spyOn(component, "updateQuestion");
    creationContextMock.objectType = "QuestionSet";
    component.creationContext = creationContextMock;
    component.childFormData = mockData.formData;
    spyOn(questionService, "updateHierarchyQuestionCreate").and.returnValue(
      throwError("error")
    );
    component.saveQuestion();
    expect(component.updateQuestion);
  });

  it("#createQuestion() should call when child question", () => {
    spyOn(component, "createQuestion");
    component.editorState = mockData.editorState;
    component.questionId = "do_11326368076523929611";
    component.showOptions = true;
    component.createQuestion();
    expect(component.createQuestion);
  });

  it("#createQuestion() should call when child question", () => {
    component.questionId = "do_11326368076523929611";
    component.editorState =
    mockData.mcqQuestionMetaData.result.question;
    component.childFormData=childMetaData;
    component.subMenus=mockData.subMenus;
    component.questionInteractionType="choice";
    component.showOptions = false;
    spyOn(questionService, "updateHierarchyQuestionCreate").and.returnValue(throwError('error'))
    component.createQuestion();
  });

  it("#deleteSolution() should call deleteSolution and set showSolutionDropDown value", () => {
    component.editorState = mockData.editorState;
    component.deleteSolution();
    expect(component.showSolutionDropDown).toBeTruthy();
  });
  it("#deleteSolution() should call deleteSolution and define mediaArr for video type", () => {
    component.editorState = mockData.editorState;
    component.selectedSolutionType = "video";
    component.deleteSolution();
    expect(component.mediaArr).toBeDefined();
  });
  it("#validateQuestionData() should call validateQuestionData and question is undefined", () => {
    component.editorState = mockData.editorState;
    component.editorState.question = undefined;
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });
  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is default", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "default";
    component.editorState.answer = "0";
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is default", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = "<p> Hi how are you </p>";
    component.editorState.answer = "";
    component.questionInteractionType = "default";
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });
  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is mcq", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = "<p> Hi how are you </p>";
    component.editorState.answer = "";
    component.questionInteractionType = "choice";
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is text", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "text";
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is date", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "date";
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is slider", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "slider";
    component.sliderDatas = {
      validation: {
        range: {
          min: "0",
          max: "10",
        },
      },
      step: "1",
    };
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is slider empty data", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "slider";
    component.sliderDatas = {
      validation: {
        range: {
          min: "",
          max: "10",
        },
      },
      step: "1",
    };
    component.configService.labelConfig = {messages: {error: {
      '005': 'error'
    }}};
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });

  it("call #sourcingUpdate() for sourcingRejectQuestion to verify inputs for #editorService.updateCollection", () => {
    component.creationContext = creationContextMock;
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    spyOn(editorService, "updateCollection").and.returnValue(of({}));
    const questionSet = collectionHierarchyMock.result["questionSet"];
    component.questionId = "do_11326368076523929611";
    component.actionType = "sourcingRejectQuestion";
    const data = {
      button: "sourcingRejectQuestion",
      comment: "test comment for rejection",
    };
    const requestBody = {
      request: {
        questionset: {
          rejectedContributions: [
            ...questionSet.rejectedContributions,
            component.questionId,
          ],
          rejectedContributionComments: {
            ...questionSet.rejectedContributionComments,
            do_11326368076523929611: data.comment,
          },
        },
      },
    };
    component.sourcingUpdate(data);
  });

  it("call #sourcingUpdate() for sourcingApproveQuestion to verify inputs for #editorService.updateCollection", () => {
    component.creationContext = creationContextMock;
    spyOn(editorService, "fetchCollectionHierarchy").and.returnValue(of());
    spyOn(questionService, "readQuestion").and.returnValue(
      of(readQuestionMock)
    );
    spyOn(editorService, "updateCollection").and.returnValue(of({}));
    const questionSet = collectionHierarchyMock.result["questionSet"];
    component.questionId = "do_11326368076523929611";
    component.actionType = "sourcingApproveQuestion";
    const data = { button: "sourcingApproveQuestion" };
    const requestBody = {
      request: {
        questionset: {
          acceptedContributions: [
            ...questionSet.acceptedContributions,
            component.questionId,
          ],
        },
      },
    };
    component.sourcingUpdate(data);
    // expect(editorService.updateCollection).toHaveBeenCalledWith('do_11330102570702438417', { ...data, requestBody });
  });
  it("#sourcingUpdate() should call #redirectToChapterList() for sourcingApproveQuestion", () => {
    spyOn(component, "redirectToChapterList");
    spyOn(editorService, "fetchCollectionHierarchy").and.returnValue(of());
    spyOn(questionService, "readQuestion").and.returnValue(
      of(readQuestionMock)
    );
    spyOn(editorService, "updateCollection").and.returnValue(of({}));
    component.creationContext = creationContextMock;
    component.questionId = "do_11326368076523929611";
    component.actionType = "sourcingApproveQuestion";
    const data = { button: "sourcingApproveQuestion" };
    component.sourcingUpdate(data);
    expect(component.redirectToChapterList);
  });
  it("#sourcingUpdate() should call #redirectToChapterList() for sourcingRejectQuestion api error", () => {
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    spyOn(editorService, "updateCollection").and.returnValue(of({}));
    component.creationContext = creationContextMock;
    component.questionId = "do_11326368076523929611";
    component.actionType = "sourcingRejectQuestion";
    const data = {
      button: "sourcingRejectQuestion",
      comment: "test comment for rejection",
    };
    spyOn(editorService, "addResourceToQuestionset").and.returnValue(
      throwError({})
    );
    component.sourcingUpdate(data);
    component.addResourceToQuestionset();
  });

  it("#sourcingUpdate() should call #redirectToChapterList() for sourcingRejectQuestion", () => {
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    spyOn(editorService, "updateCollection").and.returnValue(of({}));
    component.creationContext = creationContextMock;
    component.questionId = "do_11326368076523929611";
    component.actionType = "sourcingRejectQuestion";
    const data = {
      button: "sourcingRejectQuestion",
      comment: "test comment for rejection",
    };
    spyOn(editorService, "addResourceToQuestionset").and.returnValue(of({}));
    component.sourcingUpdate(data);
    component.addResourceToQuestionset();
  });

  it("#videoDataOutput() should call videoDataOutput and event data is empty", () => {
    const event = "";
    spyOn(component, "deleteSolution");
    component.videoDataOutput(event);
    expect(component.deleteSolution).toHaveBeenCalled();
  });
  it("#videoDataOutput() should call videoDataOutput and event data is not  empty", () => {
    const event = { name: "event name", identifier: "1234" };
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
  it("#videoDataOutput() should call videoDataOutput for thumbnail", () => {
    const event = {
      name: "event name",
      identifier: "1234",
      thumbnail: "sample data",
    };
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
  it("#videoDataOutput() should call videoDataOutput for thumbnail", () => {
    const event = {
      name: "event name",
      identifier: "1234",
      thumbnail: "sample data",
    };
    component.videoDataOutput(event);
    expect(component.videoSolutionData).toBeDefined();
  });
  it("#subMenuChange() should set the sub-menu value ", () => {
    spyOn(component, "subMenuChange").and.callThrough();
    component.subMenus = mockData.subMenus;
    component.subMenuChange({ index: 1, value: "test" });
    expect(component.subMenus[1].value).toBe("test");
  });
  it("#subMenuChange() should set the sub-menu value for dependent question forerror is true ", () => {
    spyOn(component, "subMenuChange").and.callThrough();
    component.subMenus = mockData.subMenus;
    component.showFormError=true;
    component.subMenuChange({ index: 2, value: "test" });
    expect(component.showAddSecondaryQuestionCat).toBeFalsy();
  });

  it("#dependentQuestions() should return dependentQuestions ", () => {
    spyOn(component,'dependentQuestions');
    component.subMenus = mockData.subMenus;
    expect(component.dependentQuestions.length).toBe(1);
    expect(component.dependentQuestions);
  });

  it("#saveContent() should call saveContent when questionId exits ", () => {
    spyOn(component, "validateQuestionData");
    spyOn(component, "validateFormFields");
    spyOn(component, "saveQuestion");
    spyOn(component, "updateQuestion");
    spyOn(component, "buildCondition");
    component.questionId = "do_1134355571590184961168";
    component.selectedSectionId = "do_1134347209749299201119";
    component.showFormError = false;
    component.showOptions = true;
    component.isChildQuestion = true;
    component.condition = "eq";
    component.selectedOptions = 1;
    component.saveContent();
    component.updateQuestion();
    component.buildCondition("update");
    component.updateTreeCache(
      "Mid-day Meals",
      BranchingLogic,
      component.selectedSectionId
    );
    expect(component.saveQuestion).toHaveBeenCalled();
    expect(component.updateQuestion).toHaveBeenCalled();
    expect(component.buildCondition).toHaveBeenCalled();
  });

  it("#buildCondition() should call when it is a child question save", () => {
    spyOn(component, "buildCondition");
    component.questionId = "do_1134355571590184961168";
    component.selectedSectionId = "do_1134347209749299201119";
    component.condition = "eq";
    component.selectedOptions = 1;
    component.branchingLogic = BranchingLogic;
    component.showAddSecondaryQuestionCat = true;
    spyOn(component, "saveQuestions").and.callThrough();
    component.buildCondition("update");
    component.updateTreeCache(
      "Mid-day Meals",
      BranchingLogic,
      component.selectedSectionId
    );
    expect(component.buildCondition).toHaveBeenCalled();
  });

  it("#saveQuestions call on click save button", () => {
    spyOn(component, "saveQuestions");
    spyOn(questionService, "updateHierarchyQuestionCreate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
    component.saveQuestions(mockData.mcqQuestionMetaData.result.question, "create");
    expect(component.saveQuestion);
  });

  it("#saveQuestions call on click save button for update", () => {
    spyOn(questionService, "updateHierarchyQuestionCreate").and.returnValue(
      throwError({})
    );
    component.saveQuestions(mockData.mcqQuestionMetaData.result.question, "update");
  });

  it("#updateTarget() should call when buildcondition is called ", () => {
    spyOn(component, "updateTarget").and.callThrough();
    component.questionId = "do_1134355571590184961168";
    component.branchingLogic = BranchingLogic;
    component.updateTarget(component.questionId);
    expect(component.updateTarget).toHaveBeenCalledWith(component.questionId);
  });

  it("#getOptions() should call when child question is edited when option exits", () => {
    spyOn(component, "getOptions").and.callThrough();
    editorService.optionsLength = 4;
    component.getOptions();
    expect(component.getOptions).toHaveBeenCalled();
  });
  it("#getOptions() should call when child question is edited when option not exits", () => {
    spyOn(component, "getOptions");
    editorService.optionsLength = undefined;
    component.getOptions();
  });

  it("#getParentQuestionOptions() should call when add dependent question clicked", () => {
    spyOn(component, "getParentQuestionOptions").and.callThrough();
    spyOn(questionService, "readQuestion").and.returnValue(
      of(readQuestionMock)
    );
    component.questionId = "do_1134355571590184961168";
    editorService.parentIdentifier = component.questionId;
    component.getParentQuestionOptions(component.questionId);
    expect(component.getParentQuestionOptions).toHaveBeenCalled();
  });

  it("#updateTreeCache() should call when buildcondition is called ", () => {
    spyOn(component, "updateTreeCache").and.callThrough();
    component.updateTreeCache(
      "Mid-day Meals",
      BranchingLogic,
      component.selectedSectionId
    );
    expect(component.updateTreeCache).toHaveBeenCalled();
  });

  it("#setCondition() should call when buildcondition is called ", () => {
    spyOn(component, "setCondition").and.callThrough();
    component.questionId = "do_1134355571590184961168";
    let data = {
      branchingLogic: BranchingLogic,
    };
    component.setCondition(data);
    expect(component.setCondition).toHaveBeenCalledWith(data);
  });

  it("#subMenuConfig() should call when question page render setChildQuestion is true", () => {
    component.questionMetaData = mockData.mcqQuestionMetaData.result.question;
    sourcingSettingsMock.showAddSecondaryQuestion=true;
    component.questionMetaData.hints={
      en:[]
    }
    sourcingSettingsMock.showAddHints=false;
    component.sourcingSettings = sourcingSettingsMock;
    component.questionInput.setChildQuestion = true;
    component.subMenuConfig();
  });

  it("#subMenuConfig() should call when question page render setChildQuestion is false", () => {
    component.questionMetaData = mockData.mcqQuestionMetaData.result.question;
    component.sourcingSettings = sourcingSettingsMock;
    component.questionInput.setChildQuestion = false;
    component.subMenuConfig();
  });

  it("#sliderData() should call when slider question is called", () => {
    spyOn(component, "sliderData").and.callThrough();
    const event = {
      leftAnchor: 0,
      rightAnchor: 10,
      step: 1,
    };
    component.sliderData(event);
    expect(component.sliderData).toHaveBeenCalledWith(event);
  });

  it("#getResponseDeclaration() should call for question save", () => {
    spyOn(component, "getResponseDeclaration").and.callThrough();
    component.getResponseDeclaration("slider");
    expect(component.getResponseDeclaration).toHaveBeenCalled();
  });

it('#setQuestionTypeValues call when question showEvidence is yes',()=>{
  const metaData=mockData.mcqQuestionMetaData.result.question;
  component.childFormData=childMetaData;
  component.subMenus=mockData.subMenus;
  component.questionInteractionType="choice";
  component.setQuestionTypeValues(metaData);
})

it('#setQuestionTypeValues call when question howEvidence is no',()=>{
  let metaData=mockData.mcqQuestionMetaData.result.question;
  metaData.showEvidence="No";
  childMetaData.showEvidence="No";
  childMetaData.showRemarks='Yes';
  metaData.showRemarks='Yes';
  component.childFormData=childMetaData;
  component.subMenus=mockData.subMenus;
  component.questionInteractionType="choice";
  component.setQuestionTypeValues(metaData);
})

it('#setQuestionTypeValues call when question for slider',()=>{
  const metaData=mockData.sliderQuestionMetaData.result.question;
  component.childFormData=childMetaData;
  component.subMenus=mockData.subMenus;
  component.sliderDatas=mockData.sliderQuestionMetaData.result.question.responseDeclaration.response1
  component.questionInteractionType="slider";
  component.setQuestionTypeValues(metaData);
})

it('#setQuestionTypeValues call when question for date',()=>{
  const metaData=mockData.dateQuestionMetaDate.result.question;
  component.childFormData=childMetaData;
  component.subMenus=mockData.subMenus;
  component.questionInteractionType="date";
  component.setQuestionTypeValues(metaData);
})

it('#setQuestionTypeValues call when question for text',()=>{
  const metaData=mockData.textQuestionNetaData.result.question;
  component.questionPrimaryCategory=metaData.primaryCategory;
  component.childFormData=childMetaData;
  component.subMenus=mockData.subMenus;
  component.questionInteractionType="text";
  component.setQuestionTypeValues(metaData);
})


it("#saveQuestions call on click save button", () => {
  spyOn(component, "saveQuestions");
  const metaData=mockData.textQuestionNetaData.result.question;
  spyOn(questionService, "updateHierarchyQuestionCreate").and.callFake(() => {
    return of({
      result: {
        identifiers: {
          "1245": "do_123",
        },
      },
    });
  });
  component.saveQuestions(metaData, "create");
  expect(component.saveQuestion);
});

it("#saveUpdateQuestions call on click save button api fail case", () => {
  component.questionId="1245";
  component.showAddSecondaryQuestionCat=true;
 
  component.editorState =
  mockData.mcqQuestionMetaData.result.question;
  const metaData=mockData.mcqQuestionMetaData.result.question;
  component.childFormData=childMetaData;
  component.subMenus=mockData.subMenus;
  component.questionInteractionType="choice";
  component.getQuestionMetadata();
  component.setQuestionTypeValues(metaData);
  spyOn(questionService, "updateHierarchyQuestionUpdate").and.returnValue(throwError('error'));
  component.saveUpdateQuestions();
});

});
