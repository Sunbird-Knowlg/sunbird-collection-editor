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
  interactionChoiceEditorState,
  RubricData
} from "./question.component.spec.data";
import { of, throwError } from "rxjs";
import * as urlConfig from "../../services/config/url.config.json";
import * as labelConfig from "../../services/config/label.config.json";
import * as categoryConfig from "../../services/config/category.config.json";
import { ConfigService } from "../../services/config/config.service";
import { treeNodeData } from "../editor/editor.component.spec.data";
import * as _ from 'lodash-es';
const mockEditorService = {
  editorConfig: {
    config: {
      renderTaxonomy:false,
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
  optionsLength: 4,
  selectedChildren: {
    primaryCategory: "Multiselect Multiple Choice Question",
    label: "Multiple Choice Question",
    interactionType: "choice",
  },
  getToolbarConfig: () => {},
  getHierarchyObj: () => {},
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
  editorMode:'review',
  submitRequestChanges :() =>{}
};

describe("QuestionComponent", () => {
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default,
    categoryConfig: (categoryConfig as any).default,
  };

  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let treeService,
    editorService,
    telemetryService,
    questionService,
    configService,
    toasterService;
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
        { provide: ConfigService, useValue: configStub },
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
      setChildQueston: undefined,
    };
    component.questionId = "do_1134357224765685761203";
    component.questionInteractionType = "choice";
    editorService = TestBed.inject(EditorService);
    configService = TestBed.inject(ConfigService);
    telemetryService = TestBed.inject(EditorTelemetryService);
    treeService = TestBed.get(TreeService);
    questionService = TestBed.get(QuestionService);
    toasterService = TestBed.get(ToasterService);
    spyOn(telemetryService, "impression").and.callFake(() => {});
    editorService.selectedChildren.label = "Slider";
    component.toolbarConfig.showPreview = false;
    component.creationContext = creationContextMock;
    component.leafFormConfig = leafFormConfigMock;
    editorService.optionsLength = 4;
    editorService.selectedChildren.label = "MCQ";
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
    spyOn(treeService, "getNodeById").and.callFake(()=>{
      return treeNodeData;
    })

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
  it("#saveQuestions call on click save button", () => {
    spyOn(component, "saveQuestions");
    const metaData = mockData.textQuestionNetaData.result.question;
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

  it("Unit test for #ngOnInit()", () => {
    component.toolbarConfig = editorService.toolbarConfig;
    component.leafFormConfig=leafFormConfigMock;
    component.initialLeafFormConfig=leafFormConfigMock;
    component.questionFormConfig = leafFormConfigMock;
    component.questionInput = {
      questionSetId: "do_11330102570702438417",
      questionId: "do_11330103476396851218",
      type: 'choice',
      category: "MTF",
      config: {},
      creationContext: creationContextMock,
      setChildQueston: undefined,
    };
    component.creationContext.objectType = "question";
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123",allowScoring:'Yes' } } };
    });
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "abcd",
      showDialcode: "No",
      showPreview: "",
    });
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.mcqQuestionMetaData)
    );
    component.ngOnInit();
    component.previewFormData(true);
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
    component.questionFormConfig = leafFormConfigMock;
    component.questionInput = {
      questionSetId: "do_11330102570702438417",
      questionId: "do_11330103476396851218",
      type: "default",
      category: "MTF",
      config: {},
      creationContext: creationContextMock,
      setChildQueston: true,
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
      of(mockData.mcqQuestionMetaData)
    );
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.questionMetadataFormStatus).toBeTruthy();
    expect(component.questionInput.setChildQueston).toBeTruthy();
  });

  it("#initialize should call when question page for question mcq", () => {
    component.initialLeafFormConfig = leafFormConfigMock;
    component.leafFormConfig = leafFormConfigMock;
    component.questionFormConfig=leafFormConfigMock;
    spyOn(component, "initialize").and.callThrough();
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    component.questionPrimaryCategory = undefined;
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
    component.editorState.solutions=[{
      id:'1',
      type:'vedio'
    }]
    component.initialize();
    component.previewFormData(true);
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question mcq api fail", () => {
    spyOn(component, "initialize").and.callThrough();
    component.questionId = "do_11330103476396851218";
    editorService.parentIdentifier = undefined;
    component.questionFormConfig = leafFormConfigMock;
    component.leafFormConfig = leafFormConfigMock;
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
    component.questionFormConfig = leafFormConfigMock;
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
    component.leafFormConfig=leafFormConfigMock;
    component.initialLeafFormConfig=leafFormConfigMock;
    component.childFormData = childMetaData;
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
    component.previewFormData(false);
    expect(component.initialize).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question date", () => {
    spyOn(component, "initialize").and.callThrough();
    component.questionInteractionType = "date";
    component.leafFormConfig=leafFormConfigMock;
    component.initialLeafFormConfig=leafFormConfigMock;
    component.childFormData = childMetaData;
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
    component.leafFormConfig=leafFormConfigMock;
    component.initialLeafFormConfig=leafFormConfigMock;
    component.childFormData = childMetaData;
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

  it("#initialize should call when question page for question mcq with interactionTypes", () => {
    component.questionSetId = "do_12345";
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    editorService.parentIdentifier = undefined;
    component.questionId = "do_11330103476396851218";
    component.leafFormConfig = leafFormConfigMock;
    spyOn(questionService, "readQuestion").and.returnValue(
      of(mockData.mcqQuestionMetaData)
    );
    spyOn(component, 'setQuestionTitle').and.callFake(() => {});
    spyOn(component, 'populateFormData').and.callFake(() => {});
    component.leafFormConfig = leafFormConfigMock;
    spyOn(component, "initialize").and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    expect(component.questionPrimaryCategory).toBeDefined();
    expect(component.questionInteractionType).toBeDefined();
    expect(component.populateFormData).toHaveBeenCalled();
    expect(component.setQuestionTitle).toHaveBeenCalled();
  });

  it("#initialize should call when question page for question mcq without interactionTypes", () => {
    let questionMetadata = mockData.mcqQuestionMetaData.result.question;
    questionMetadata = _.omit(questionMetadata, ['interactionTypes', 'primaryCategory'])
    component.questionSetId = "do_12345";
    spyOn(editorService, "fetchCollectionHierarchy").and.callFake(() => {
      return of(collectionHierarchyMock);
    });
    editorService.parentIdentifier = undefined;
    component.questionId = "do_11330103476396851218";
    component.leafFormConfig = leafFormConfigMock;
    spyOn(questionService, "readQuestion").and.returnValue(
      of({result: {question: {questionMetadata}}})
    );
    spyOn(component, 'setQuestionTitle').and.callFake(() => {});
    spyOn(component, 'populateFormData').and.callFake(() => {});
    component.leafFormConfig = leafFormConfigMock;
    spyOn(component, "initialize").and.callThrough();
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
    expect(component.questionPrimaryCategory).toBeUndefined();
    expect(component.questionInteractionType).toEqual("default");
    expect(component.populateFormData).toHaveBeenCalled();
    expect(component.setQuestionTitle).toHaveBeenCalled();
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
    component.questionFormConfig = leafFormConfigMock;
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
    component.questionFormConfig = leafFormConfigMock;
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
    component.questionInteractionType = "date";
    component.initialize();
    expect(component.initialize).toHaveBeenCalled();
  });

  it('#contentPolicyUrl() should return content policy url', () => {
    editorService.contentPolicyUrl = 'https://preprod.ntp.net.in/term-of-use.html';
    spyOn(component, 'contentPolicyUrl').and.callThrough();
    const contentPolicyURL = component.contentPolicyUrl;
    expect(contentPolicyURL).toBeDefined();
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

  it("Unit test for #populateFormData question markAsNotMandatory reqired yes", () => {
    spyOn(component,'populateFormData').and.callThrough();
    component.childFormData = {};
    component.isReadOnlyMode=false;
    component.questionInteractionType="choice";
    component.questionMetaData=mockData.mcqQuestionMetaData.result.question;
    component.leafFormConfig = leafFormConfigMock;
    component.questionId = "do_123";
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(component,'fetchFrameWorkDetails').and.callFake(()=>{});
    spyOn(component,'previewFormData').and.callFake(()=>{})
    component.populateFormData();
    expect(component.previewFormData).toHaveBeenCalled();
  });

  it("Unit test for #populateFormData without Question Id", () => {
    component.childFormData = {};
    component.questionId = undefined;
    component.questionInteractionType="choice";
    component.isReadOnlyMode=false;
    component.leafFormConfig = leafFormConfigMock;
    component.initialLeafFormConfig = leafFormConfigMock;
    component.questionFormConfig = leafFormConfigMock;
    component.questionMetaData=mockData.mcqQuestionMetaData.result.question;
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(component,'fetchFrameWorkDetails').and.callFake(()=>{});
    component.populateFormData();
   });

  it("Unit test for #populateFormData readonly mode true ", () => {
    spyOn(component,'populateFormData').and.callThrough();
    component.childFormData = {};
    component.isReadOnlyMode=true;
    component.questionInteractionType="choice";
    component.questionMetaData=mockData.mcqQuestionMetaData.result.question;
    component.leafFormConfig = leafFormConfigMock;
    component.initialLeafFormConfig = leafFormConfigMock;
    component.questionFormConfig = leafFormConfigMock;
    component.questionId = "do_123";
    component.questionSetHierarchy = collectionHierarchyMock.result.questionSet;
    spyOn(component,'previewFormData').and.callFake(()=>{})
    component.populateFormData();
    expect(component.previewFormData).toHaveBeenCalled(); 
  });

  it("should call previewFormData ", () => {
    spyOn(component, "previewFormData").and.callThrough();
    component.leafFormConfig = mockData.childMetadata.properties;
    component.initialLeafFormConfig = mockData.childMetadata.properties;
    component.childFormData = childMetaData;
    component.questionFormConfig = mockData.childMetadata.properties;
    component.previewFormData(true);
    expect(component.leafFormConfig).toEqual(mockData.childMetadata.properties);
    expect(component.previewFormData).toHaveBeenCalled();
  });
  it("should call valueChanges", () => {
    component.valueChanges(childMetaData);
    expect(component.childFormData).toEqual(childMetaData);
  });
  it("should call validateFormFields", () => {
    component.leafFormConfig = mockData.childMetadata;
    component.childFormData = childMetaData;
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

  it("call #getMcqQuestionHtmlBody() to verify questionBody", () => {
    const question = '<div class=\'question-body\' tabindex=\'-1\'><div class=\'mcq-title\' tabindex=\'0\'>{question}</div><div data-choice-interaction=\'response1\' class=\'{templateClass}\'></div></div>';
    const templateId = "mcq-vertical";
    component.getMcqQuestionHtmlBody(question, templateId);
  });

  it("Unit test for #sendForReview", () => {
    spyOn(component, "upsertQuestion");
    component.sendForReview();
    expect(component.upsertQuestion).toHaveBeenCalled();
  });

  it('Unit test for requestForChanges success', () => {
    component.questionId = 'do_12345';
    spyOn(component, 'requestForChanges').and.callThrough();
    editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'submitRequestChanges').and.returnValue(of({}))
    spyOn(toasterService, 'success').and.callFake(() => {})
    spyOn(component, 'redirectToChapterList').and.callFake(() => {});
    component.requestForChanges('test');
    expect(toasterService.success).toHaveBeenCalled();
    expect(component.redirectToChapterList).toHaveBeenCalled();
  });

  it('Unit test for requestForChanges error', () => {
    component.questionId = 'do_12345';
    spyOn(component, 'requestForChanges').and.callThrough();
    editorService = TestBed.inject(EditorService);
    spyOn(editorService, 'submitRequestChanges').and.returnValue(throwError({}))
    spyOn(toasterService, 'error').and.callFake(() => {})
    spyOn(component, 'redirectToChapterList').and.callFake(() => {});
    component.requestForChanges('test');
    expect(component.redirectToChapterList).not.toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
  });

  it("Unit test for #setQuestionId", () => {
    spyOn(component, "setQuestionTitle");
    component.setQuestionId("do_11330103476396851218");
    expect(component.questionId).toEqual("do_11330103476396851218");
    expect(component.setQuestionTitle);
  });
  it("#rejectQuestion() should call #requestForChanges", () => {
    const comment = "test comment";
    spyOn(component, "requestForChanges");
    component.showFormError = false;
    component.rejectQuestion(comment);
    expect(component.requestForChanges).toHaveBeenCalledWith(comment);
  });
  it("#handleRedirectToQuestionset() should call handleRedirectToQuestionset and redirectToQuestionset to be called ", () => {
    component.showConfirmPopup = false;
    component.questionId = "do_11326368076523929611";
    spyOn(component, "redirectToQuestionset").and.callFake(() => {});
    spyOn(component, "handleRedirectToQuestionset").and.callThrough();
    component.handleRedirectToQuestionset();
    expect(component.showConfirmPopup).toBeFalsy();
    expect(component.redirectToQuestionset).toHaveBeenCalled();
  });
  it("redirectToQuestionset should call handleRedirectToQuestionset and set showConfirmPopup", () => {
    component.showConfirmPopup = false;
    component.questionId = undefined;
    component.creationMode = 'edit';
    spyOn(component, "redirectToQuestionset").and.callFake(() => {});
    spyOn(component, "handleRedirectToQuestionset").and.callThrough();
    component.handleRedirectToQuestionset();
    expect(component.showConfirmPopup).toBeTruthy();
    expect(component.redirectToQuestionset).not.toHaveBeenCalled();
  });
  it("Unit test for #showHideSpinnerLoader", () => {
    component.showHideSpinnerLoader(true, "review");
    expect(component.buttonLoaders.saveButtonLoader).toEqual(true);
    expect(component.buttonLoaders.review).toEqual(true);
  });
  it("Unit test for #previewContent", () => {
    spyOn(component, 'validateQuestionData').and.callFake(() => {});
    spyOn(component, 'previewFormData').and.callFake(() => {});
    component.showFormError = false;
    component.questionMetadataFormStatus = true;
    component.questionId = 'do_12345';
    component.tempQuestionId = 'do_12345';
    component.questionSetHierarchy = {
      childNodes: ''
    };
    spyOn(component, 'setQumlPlayerData').and.callFake(() => {});
    component.toolbarConfig = {
      showPreview: true
    }
    spyOn(component, 'previewContent').and.callThrough();
    component.previewContent();
    expect(component.validateQuestionData).toHaveBeenCalled();
    expect(component.showFormError).toBeFalsy();
    expect(component.questionMetadataFormStatus).toBeTruthy();
  });
  it("#previewContent should call toasterService.error", () => {
    spyOn(component, 'validateQuestionData').and.callFake(() => {});
    component.showFormError = true;
    component.questionMetadataFormStatus = false;
    // tslint:disable-next-line:no-shadowed-variable
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'previewContent').and.callThrough();
    component.previewContent();
    expect(toasterService.error).toHaveBeenCalled();
  });
  it("Unit test for #setQumlPlayerData", () => {
    // spyOn(component, 'editorCursor.setQuestionMap').and.callFake(()=> {});
    spyOn(component, 'getQuestionMetadata').and.returnValue(mockData.mcqQuestionMetaData.result.question);
    component.questionSetHierarchy = {
      children: [],
      maxScore: '1'
    };
    spyOn(component, 'setQumlPlayerData').and.callThrough();
    component.setQumlPlayerData('do_12345');
    expect(component.getQuestionMetadata).toHaveBeenCalled();
    expect(component.questionSetHierarchy.maxScore).toBeDefined();
  });
  it("Unit test for #isEditable without queston id", () => {
    component.creationContext = creationContextMock;
    component.questionId=undefined;
    expect(component.isEditable("bloomsLevel")).toBeTruthy();
  });
  it("Unit test for #isEditable with queston id", () => {
    component.creationContext = creationContextMock;
    expect(component.isEditable("bloomsLevel")).toBeFalsy();
  });
  it("Unit test for #prepareQuestionBody", () => {
    spyOn(component, "prepareQuestionBody").and.callFake(() => {});
    component.prepareQuestionBody();
    expect(component.prepareQuestionBody).toHaveBeenCalled();
  });
  it("#submitHandler() should set showSubmitConfirmPopup true", () => {
    component.showSubmitConfirmPopup = false;
    spyOn(component, 'submitHandler').and.callThrough();
    spyOn(component, 'validateQuestionData').and.callFake(() => {
      component.showFormError = false;
    });
    spyOn(component, 'validateFormFields').and.callFake(() => {});
    component.submitHandler();
    expect(component.submitHandler).toHaveBeenCalled();
    expect(component.validateQuestionData).toHaveBeenCalled();
    expect(component.validateFormFields).toHaveBeenCalled();
    expect(component.showSubmitConfirmPopup).toBeTruthy();
  });
  it("#submitHandler() should not set showSubmitConfirmPopup true", () => {
    component.showSubmitConfirmPopup = false;
    spyOn(component, 'submitHandler').and.callThrough();
    spyOn(component, 'validateQuestionData').and.callFake(() => {
      component.showFormError = true;
    });
    spyOn(component, 'validateFormFields').and.callFake(() => {});
    component.submitHandler();
    expect(component.submitHandler).toHaveBeenCalled();
    expect(component.validateQuestionData).toHaveBeenCalled();
    expect(component.validateFormFields).toHaveBeenCalled();
    expect(component.showSubmitConfirmPopup).toBeFalsy();
  });
  it("#saveContent() should call saveContent and set showFormError ", () => {
    spyOn(component, "validateQuestionData").and.callFake(() => {});
    spyOn(component, "saveQuestion").and.callFake(() => {});
    component.showFormError = false;
    component.questionMetadataFormStatus = true;
    spyOn(component, 'saveContent').and.callThrough();
    component.saveContent();
    expect(component.validateQuestionData).toHaveBeenCalled();
    expect(component.showFormError).toBeFalsy();
    expect(component.questionMetadataFormStatus).toBeTruthy();
    expect(component.saveQuestion).toHaveBeenCalled();
  });
  it("#saveContent() should call toasterService.error ", () => {
    spyOn(component, "validateQuestionData").and.callFake(() => {});
    spyOn(component, "saveQuestion").and.callFake(() => {});
    component.showFormError = true;
    component.questionMetadataFormStatus = false;
    spyOn(toasterService, 'error').and.callFake(() => {});
    spyOn(component, 'saveContent').and.callThrough();
    component.saveContent();
    expect(component.validateQuestionData).toHaveBeenCalled();
    expect(component.saveQuestion).not.toHaveBeenCalled();
    expect(toasterService.error).toHaveBeenCalled();
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
    component.editorState = mockData.editorState.body;
    component.questionId = undefined;
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123",allowScoring:'Yes' } } };
    });
    spyOn(treeService, "getActiveNode").and.callFake(() => {
      return { data: { root: true } };
    });
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
    spyOn(questionService, "updateHierarchyQuestionUpdate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
    const metaData = mockData.textQuestionNetaData.result.question;
    component.questionPrimaryCategory = metaData.primaryCategory;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.selectedSolutionType='12345';
    component.questionInteractionType = "text";
    component.getQuestionMetadata();
    component.setQuestionTypeValues(metaData);
    component.prepareQuestionBody();
    component.updateQuestion();
    component.saveQuestion();
  });

  it('#getQuestionMetadata shpuld call when queston body is prepared',()=>{
    spyOn(component,'getQuestionMetadata').and.callThrough();
    component.editorState=mockData.sliderQuestionMetaData.result.question;
    component.selectedSolutionType="2432432"
    component.questionInteractionType='slider';
    component.getResponseDeclaration('slider')
    component.getQuestionMetadata();
    expect(component.getQuestionMetadata).toHaveBeenCalled();
  })

  it('#getQuestionMetadata() should return question metata when interactionType is choice', () => {
    component.mediaArr = [];
    component.editorState = interactionChoiceEditorState;
    component.selectedSolutionType = undefined;
    component.creationContext = undefined;
    component.questionInteractionType = 'choice';
    component.childFormData = {
      name: 'MCQ',
      bloomsLevel: null,
      board: 'CBSE',
      maxScore: 1
    };
    component.maxScore = 1;
    spyOn(component, 'getDefaultSessionContext').and.returnValue({
        creator: 'Vaibahv Bhuva',
        createdBy: '5a587cc1-e018-4859-a0a8-e842650b9d64'
      }
    );
    spyOn(component, 'getQuestionMetadata').and.callThrough();
    const metadata = component.getQuestionMetadata();
    expect(metadata.responseDeclaration.response1.maxScore).toEqual(1);
    expect(metadata.responseDeclaration.response1.correctResponse.outcomes.SCORE).toEqual(1);
  });

  it("#saveQuestion() should call saveQuestion for updateQuestion objectType not a question", () => {
    component.editorState = mockData.editorState;
    component.questionId = "do_11326368076523929611";
    spyOn(component, "updateQuestion");
    creationContextMock.objectType = "questionSet";
    component.creationContext = creationContextMock;
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123" } } };
    });
    spyOn(treeService, "getActiveNode").and.callFake(() => {
      return { data: { root: true } };
    });
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
    component.editorState = mockData.mcqQuestionMetaData.result.question;
    component.questionId = undefined;
    spyOn(component, "updateQuestion");
    creationContextMock.objectType = "QuestionSet";
    component.creationContext = creationContextMock;
    component.childFormData = childMetaData;
    component.setQuestionTypeValues(
      mockData.mcqQuestionMetaData.result.question
    );
    spyOn(questionService, "updateHierarchyQuestionCreate").and.returnValue(
      throwError("error")
    );
    component.saveQuestion();
    expect(component.updateQuestion);
  });

  it("#saveQuestion() should call saveQuestion for updateQuestion save successfully", () => {
    component.editorState = mockData.mcqQuestionMetaData.result.question;
    component.questionId = undefined;
    spyOn(component, "updateQuestion");
    creationContextMock.objectType = "QuestionSet";
    component.creationContext = creationContextMock;
    component.childFormData = childMetaData;
    component.setQuestionTypeValues(
      mockData.mcqQuestionMetaData.result.question
    );
    spyOn(questionService, "updateHierarchyQuestionCreate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
    component.saveQuestion();
    expect(component.updateQuestion);
  });

  it("#createQuestion() should call when child question", () => {
    spyOn(component, "createQuestion");
    component.editorState = mockData.mcqQuestionMetaData.result.question;
    component.questionId = "do_11326368076523929611";
    component.showOptions = true;
    component.questionId = "do_1134355571590184961168";
    component.selectedSectionId = "do_1134347209749299201119";
    component.showFormError = false;
    component.questionMetadataFormStatus = true;
    component.showOptions = true;
    component.isChildQuestion = true;
    component.condition = "eq";
    component.selectedOptions = 1;
    spyOn(questionService, "updateHierarchyQuestionCreate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
    // component.saveContent();
    component.updateQuestion();
    component.buildCondition("create");
    component.updateTreeCache(
      "Mid-day Meals",
      BranchingLogic,
      component.selectedSectionId
    );
    component.createQuestion();
    expect(component.createQuestion);
  });


  it("#createQuestion() should call when child question", () => {
    component.questionId = "do_11326368076523929611";
    component.editorState = mockData.mcqQuestionMetaData.result.question;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "choice";
    component.showOptions = false;
    spyOn(questionService, "updateHierarchyQuestionCreate").and.returnValue(
      throwError("error")
    );
    component.createQuestion();
  });

  it("#createQuestion() should call when child question api success", () => {
    component.questionId = "1234";
    component.editorState = mockData.mcqQuestionMetaData.result.question;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "choice";
    component.showOptions = false;
    spyOn(questionService, "updateHierarchyQuestionCreate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
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
    component.editorState = mockData.defaultQuestionMetaData.result.question;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "default";
    component.editorState.answer = "0";
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is default", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.defaultQuestionMetaData.result.question;
    component.questionInteractionType = "default";
    component.editorState.question = "<p> Hi how are you </p>";
    component.editorState.answer = "";
    component.validateQuestionData();
    expect(component.showFormError).toBeTruthy();
  });
  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is mcq", () => {
    component.sourcingSettings = sourcingSettingsMock;
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123",allowScoring:'Yes' } } };
    });
    component.editorState = mockData.mcqQuestionMetaData.result.question;
    editorService = TestBed.inject(EditorService);
    editorService.editorConfig.renderTaxonomy=false;
    component.editorState.question = "<p> Hi how are you </p>";
    component.editorState.answer = "";
    component.questionInteractionType = "choice";
    component.validateQuestionData();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is mcq when scoring is added", () => {
    component.sourcingSettings = sourcingSettingsMock;
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123",allowScoring:'Yes' } } };
    });
    mockData.mcqQuestionMetaData.result.question.responseDeclaration.response1.mapping=[
      {response:0,score:10},
      {response:1,score:10}
    ]
    component.editorState = mockData.mcqQuestionMetaData.result.question;
    editorService = TestBed.inject(EditorService);
    editorService.editorConfig.renderTaxonomy=false;
    component.editorState.question = "<p> Hi how are you </p>";
    component.editorState.answer = "";
    component.questionInteractionType = "choice";
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is text", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.textQuestionNetaData.result.question;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "text";
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is date", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.dateQuestionMetaDate.result.question;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "date";
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is slider", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.sliderQuestionMetaData.result.question;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "slider";
    component.sliderDatas =
      mockData.sliderQuestionMetaData.result.question.interactions.response1;
    component.validateQuestionData();
    expect(component.showFormError).toBeFalsy();
  });

  it("#validateQuestionData() should call validateQuestionData and questionInteractionType is slider empty data", () => {
    component.sourcingSettings = sourcingSettingsMock;
    component.editorState = mockData.editorState;
    component.editorState.question = "<p> Hi how are you </p>";
    component.questionInteractionType = "slider";
    component.sliderDatas = {};
    component.configService = configService;
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
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callFake(() => { });
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
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callFake(() => { });
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
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.callFake(() => { });
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
    spyOn(component,'subMenuChange').and.callThrough();
    component.subMenus = mockData.subMenus;
    component.showFormError=false;
    spyOn(component, 'saveContent').and.callFake(() => {});
    component.subMenuChange({ index: 1, value: "test" });
    expect(component.subMenus[1].value).toBe("test");
  });
  it("#subMenuChange() should set the sub-menu value for dependent question forerror is true ", () => {
    spyOn(component,'subMenuChange').and.callThrough();
    component.subMenus = mockData.subMenus;
    component.showFormError=false;
    spyOn(component, 'saveContent').and.callFake(() => {});
    component.subMenuChange({ index: 2, value: [{ id: 1 }] });
    expect(component.subMenus[2].value).toEqual([{ id: 1 }]);
    expect(component.showAddSecondaryQuestionCat).toBeTruthy();
  });
  it("#dependentQuestions() should return dependentQuestions ", () => {
    spyOn(component, "dependentQuestions");
    component.subMenus = mockData.subMenus;
    component.subMenuChange({ index: 2, value: "test" });
    expect(component.dependentQuestions.length).toBe(1);
    expect(component.dependentQuestions);
  });

  it("#saveContent() should call saveContent when questionId exits ", () => {
    spyOn(component, "validateQuestionData");
    spyOn(component, "validateFormFields");
    spyOn(component, "saveQuestion");
    spyOn(component, "updateQuestion");
    spyOn(component, "buildCondition");
    component.creationContext.objectType='questionSet';
    component.creationContext.mode='submit'
    component.questionId = "do_1134355571590184961168";
    component.selectedSectionId = "do_1134347209749299201119";
    component.showFormError = false;
    component.showOptions = true;
    component.isChildQuestion = true;
    component.condition = "eq";
    component.selectedOptions = 1;
    component.updateQuestion();
    component.buildCondition("update");
    component.updateTreeCache(
      "Mid-day Meals",
      BranchingLogic,
      component.selectedSectionId
    );
    component.saveContent();
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
    component.saveQuestions(
      mockData.mcqQuestionMetaData.result.question,
      "create"
    );
    expect(component.saveQuestion);
  });

  it("#saveQuestions call on click save button for update api success", () => {
    spyOn(questionService, "updateHierarchyQuestionCreate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
    component.saveQuestions(
      mockData.mcqQuestionMetaData.result.question,
      "update"
    );
  });

  it("#saveQuestions call on click save button for update api success", () => {
    spyOn(questionService, "updateHierarchyQuestionCreate").and.returnValue(
      throwError("error")
    );
    component.saveQuestions(
      mockData.mcqQuestionMetaData.result.question,
      "update"
    );
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
    spyOn(component, "getOptions").and.callThrough();
    editorService.optionsLength = undefined;
    component.getOptions();
    expect(component.getOptions).toHaveBeenCalled();
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
    component.selectedSectionId='do_1234'
    component.updateTreeCache(
      "Mid-day Meals",
      BranchingLogic,
      component.selectedSectionId
    );
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
    sourcingSettingsMock.showAddSecondaryQuestion = true;
    component.questionMetaData.hints = {
      en: [],
    };
    sourcingSettingsMock.showAddHints = false;
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
    component.maxScore = 1;
    spyOn(component, "getResponseDeclaration").and.callThrough();
    const responseDecleration = component.getResponseDeclaration("slider");
    expect(component.getResponseDeclaration).toHaveBeenCalled();
    expect(responseDecleration.response1['maxScore']).toEqual(1);
  });

  it("#saveUpdateQuestions call on click save button api fail case", () => {
    component.questionId = "1245";
    component.showAddSecondaryQuestionCat = true;

    component.editorState = mockData.mcqQuestionMetaData.result.question;
    const metaData = mockData.mcqQuestionMetaData.result.question;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "choice";
    component.getQuestionMetadata();
    component.setQuestionTypeValues(metaData);
    spyOn(questionService, "updateHierarchyQuestionUpdate").and.returnValue(
      throwError("error")
    );
    component.saveUpdateQuestions();
  });

  it("#saveUpdateQuestions call on click save button api success", () => {
    component.questionId = "1245";
    component.showAddSecondaryQuestionCat = true;

    component.editorState = mockData.mcqQuestionMetaData.result.question;
    const metaData = mockData.mcqQuestionMetaData.result.question;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "choice";
    component.getQuestionMetadata();
    component.setQuestionTypeValues(metaData);
    spyOn(questionService, "updateHierarchyQuestionUpdate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
    component.saveUpdateQuestions();
  });

  it("#setQuestionTypeValues call when question showEvidence is yes", () => {
    const metaData = mockData.mcqQuestionMetaData.result.question;
    childMetaData.allowMultiSelect = "No";
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "choice";
    component.setQuestionTypeValues(metaData);
  });

  it("#setQuestionTypeValues call when question howEvidence is no", () => {
    let metaData = mockData.mcqQuestionMetaData.result.question;
    childMetaData.showEvidence = "No";
    childMetaData.showRemarks = "Yes";
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "choice";
    component.setQuestionTypeValues(metaData);
  });

  it("#setQuestionTypeValues call when question for slider", () => {
    const metaData = mockData.sliderQuestionMetaData.result.question;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.sliderDatas =
      mockData.sliderQuestionMetaData.result.question.interactions.response1;
    component.questionInteractionType = "slider";
    component.setQuestionTypeValues(metaData);
  });

  it("#setQuestionTypeValues call when question for date", () => {
    const metaData = mockData.dateQuestionMetaDate.result.question;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "date";
    component.setQuestionTypeValues(metaData);
  });

  it("#setQuestionTypeValues call when question for text", () => {
    const metaData = mockData.textQuestionNetaData.result.question;
    component.questionPrimaryCategory = metaData.primaryCategory;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "text";
    component.setQuestionTypeValues(metaData);
  });

  it("#saveQuestions call on click save button", () => {
    spyOn(component, "saveQuestions");
    const metaData = mockData.textQuestionNetaData.result.question;
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

  it("#saveQuestions call on click save button api fail", () => {
    spyOn(component, "saveQuestions");
    const metaData = mockData.textQuestionNetaData.result.question;
    spyOn(questionService, "updateHierarchyQuestionCreate").and.returnValue(
      throwError("error")
    );
    component.saveQuestions(metaData, "update");
    expect(component.saveQuestion);
  });

  it("#prepareRequestBody call when question save called slider", () => {
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123",allowScoring:'Yes' } } };
    });
    spyOn(treeService, "getActiveNode").and.callFake(() => {
      return { data: { root: true } };
    });
    const metaData = mockData.sliderQuestionMetaData.result.question;
    component.questionPrimaryCategory = metaData.primaryCategory;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "slider";
    component.setQuestionTypeValues(metaData);
    component.prepareQuestionBody();
  });

  it("#prepareRequestBody call when question save called text", () => {
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123",allowScoring:'Yes' } } };
    });
    spyOn(treeService, "getActiveNode").and.callFake(() => {
      return { data: { root: true } };
    });
    const metaData = mockData.textQuestionNetaData.result.question;
    component.questionPrimaryCategory = metaData.primaryCategory;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "text";
    component.getQuestionMetadata();
    component.setQuestionTypeValues(metaData);
    component.prepareQuestionBody();
  });

  it("#setQuestionTitle() should set #toolbarConfig.title for question", () => {
    creationContextMock.objectType = "questionSet";
    component.questionId = "do_123";
    component.creationContext = creationContextMock;
    component.questionPrimaryCategory = "";
    component.setQuestionTitle();
    expect(component.questionId).toEqual("do_123");
  });

  it("#upsertQuestion() should call on question save api false case", () => {
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123",allowScoring:'Yes' } } };
    });
    const metaData = mockData.textQuestionNetaData.result.question;
    component.questionPrimaryCategory = metaData.primaryCategory;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "text";
    component.getQuestionMetadata();
    component.setQuestionTypeValues(metaData);
    component.prepareQuestionBody();
    const event = { button: "saveContent" };
    component.actionType = event.button;
    spyOn(questionService, "upsertQuestion").and.returnValue(
      of({
        result: {
          identifiers: {
            "1234": "do_123",
          },
        },
      })
    );
    component.upsertQuestion("");
  });

  it("#upsertQuestion() should call on question save api false case", () => {
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return { data: { metadata: { identifier: "0123",allowScoring:'Yes' } } };
    });
    const metaData = mockData.textQuestionNetaData.result.question;
    component.questionPrimaryCategory = metaData.primaryCategory;
    component.childFormData = childMetaData;
    component.subMenus = mockData.subMenus;
    component.questionInteractionType = "text";
    component.getQuestionMetadata();
    component.setQuestionTypeValues(metaData);
    component.prepareQuestionBody();
    spyOn(questionService, "upsertQuestion").and.returnValue(
      throwError("error")
    );
    spyOn(editorService, "apiErrorHandling").and.callFake(() => {});
    component.upsertQuestion("");
  });

  it("#updateQuestion() should call on question save isChildQuestion is true", () => {
    component.editorState = mockData.mcqQuestionMetaData.result.question;
    component.questionId = "do_11326368076523929611";
    component.showOptions = true;
    component.questionId = "do_1134355571590184961168";
    component.selectedSectionId = "do_1134347209749299201119";
    component.showFormError = false;
    component.showOptions = true;
    component.isChildQuestion = true;
    component.condition = "eq";
    component.selectedOptions = 1;
    component.sourcingSettings=sourcingSettingsMock;
    component.childFormData=childMetaData;
    component.saveContent();
    component.updateQuestion();
    component.buildCondition("update");
    component.updateTreeCache(
      "Mid-day Meals",
      BranchingLogic,
      component.selectedSectionId
    );
    spyOn(questionService, "updateHierarchyQuestionUpdate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
   component.saveUpdateQuestions();  
   component.updateQuestion(); 
  });

  it("#updateQuestion() should call on question save isChildQuestion is false", () => {
    spyOn(component,'updateQuestion').and.callThrough();
    component.sourcingSettings=sourcingSettingsMock;
    component.childFormData=childMetaData;
    component.isChildQuestion=false;
    component.questionId='1245'
    component.showAddSecondaryQuestionCat=true;
    spyOn(questionService, "updateHierarchyQuestionUpdate").and.callFake(() => {
      return of({
        result: {
          identifiers: {
            "1245": "do_123",
          },
        },
      });
    });
  spyOn(component, 'saveUpdateQuestions').and.callFake(()=>{});
   component.updateQuestion();
   expect(component.saveUpdateQuestions).toHaveBeenCalled();
  });

  xit("#updateQuestion() should call on question save isChildQuestion is false api fail", () => {
    spyOn(component,'updateQuestion').and.callThrough();
    component.sourcingSettings=sourcingSettingsMock;
    component.childFormData=childMetaData;
    component.isChildQuestion=false;
    component.questionId='1245'
    component.showAddSecondaryQuestionCat=true;
    spyOn(questionService, "updateHierarchyQuestionUpdate").and.returnValue(throwError('error'))
   component.saveUpdateQuestions();  
   component.updateQuestion(); 
  });

  it('#getBranchingLogic should call for branchingLogic', () => {
    spyOn(component, 'getBranchingLogic').and.callThrough();
    component.getBranchingLogic(RubricData);
    expect(RubricData[0].allowBranching).toBe('Yes');
  })

});
