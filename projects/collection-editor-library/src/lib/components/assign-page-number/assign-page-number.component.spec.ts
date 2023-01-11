import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AssignPageNumberComponent } from "./assign-page-number.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TreeService } from "../../services/tree/tree.service";
import { mockTreeService } from "../fancy-tree/fancy-tree.component.spec.data";
import { EditorService } from "../../services/editor/editor.service";
import { of, throwError } from "rxjs";
import { QuestionService } from "../../services/question/question.service";
import {
  mockCreateArray,
  mockPageNumberArray,
  mockQuestionData,
  mockRenderingSequence,
  mockTreeData,
} from "./assign-page-number.component.spec.data";

const mockEditorService = {
  getToolbarConfig: () => {},
  getHierarchyObj: () => {},
  treeData: {},
};

describe("AssignPageNumberComponent", () => {
  let component: AssignPageNumberComponent;
  let fixture: ComponentFixture<AssignPageNumberComponent>;
  // tslint:disable-next-line:one-variable-per-declaration
  let treeService, editorService, questionService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AssignPageNumberComponent],
      providers: [
        QuestionService,
        { provide: TreeService, useValue: mockTreeService },
        { provide: EditorService, useValue: mockEditorService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPageNumberComponent);
    treeService = TestBed.inject(TreeService);
    editorService = TestBed.inject(EditorService);
    questionService = TestBed.inject(QuestionService);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("#ngOnInit should called", () => {
    spyOn(editorService, "getToolbarConfig").and.returnValue({
      title: "Observation Form",
    });
    editorService.treeData = mockTreeData;
    spyOn(component, "ngOnInit").and.callThrough();
    spyOn(component, "createSequence").and.callFake(() => {});
    spyOn(component, "treeEventListener").and.callFake(() => {});
    component.ngOnInit();
    expect(component.toolbarConfig).toBeDefined();
    expect(component.toolbarConfig.title).toEqual("Observation Form");
    expect(component.treeData).toBe(editorService.treeData);
    expect(component.treeEventListener).toHaveBeenCalled();
    expect(component.createSequence).toHaveBeenCalled();
  });

  it("#toolbarEventListener() should call #handleRedirectToQuestionSet() if event is backContent", () => {
    spyOn(component, "toolbarEventListener").and.callThrough();
    spyOn(component, "redirectToQuestionSet").and.callThrough();
    const event = {
      button: "backContent",
    };
    component.toolbarEventListener(event);
    expect(component.redirectToQuestionSet).toHaveBeenCalled();
  });
  it("#redirectToQuestionSet() should emit #assignPageEmitter event", () => {
    spyOn(component, "redirectToQuestionSet").and.callThrough();
    spyOn(component.assignPageEmitter, "emit").and.callThrough();
    component.redirectToQuestionSet();
    expect(component.assignPageEmitter.emit).toHaveBeenCalledWith({
      status: false,
    });
  });

  it("#treeEventListener should call api call success", () => {
    spyOn(component, "treeEventListener").and.callThrough();
    spyOn(editorService, "getHierarchyObj").and.callFake(() => {
      return {
        "1234": {
          children: [],
        },
      };
    });
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return {
        data: { metadata: { identifier: "0123", allowScoring: "Yes" } },
      };
    });
    spyOn(treeService, "getHierarchyObj").and.callFake(() => {
      return { 1234: { children: ["1234567"] } };
    });
    spyOn(questionService, "getQuestionList").and.returnValue(
      of({
        result: {
          questions: [
            {
              editorState: {
                options: [
                  {
                    answer: false,
                    value: {
                      body: "<p>Yes</p>",
                      value: 0,
                    },
                  },
                ],
                question: "<p>Yes or No?</p>",
              },
              identifier: "do_1234",
              languageCode: ["en"],
            },
          ],
          count: 1,
        },
      })
    );
    // component.treeEventListener({ event: { identifier: "1234" } });
  });

  it("#treeEventListener should call api call fail", () => {
    spyOn(component, "treeEventListener").and.callThrough();
    spyOn(editorService, "getHierarchyObj").and.callFake(() => {
      return {
        "1234": {
          children: [],
        },
      };
    });
    spyOn(treeService, "getFirstChild").and.callFake(() => {
      return {
        data: { metadata: { identifier: "0123", allowScoring: "Yes" } },
      };
    });
    spyOn(treeService, "getHierarchyObj").and.callFake(() => {
      return { 1234: { children: ["1234567"] } };
    });
    spyOn(questionService, "getQuestionList").and.returnValue(throwError({}));
    component.treeEventListener({ event: { identifier: "1234" } });
  });

  it(`#treeEventListener should call setPageNumber()`, () => {
    spyOn(component, "setPageNumber").and.callThrough();
    component.criteriaId = "do_1134460323602841601200";
    component.rendering_sequence = mockRenderingSequence;
    component.pageNumArray = mockPageNumberArray;
    component.questions = mockQuestionData;
    component.setPageNumber({ event: { identifier: "1234" } });
    expect(component.setPageNumber).toHaveBeenCalledWith({
      event: { identifier: "1234" },
    });
  });

  it("#onValueChange should call to assign the page numbers", () => {
    spyOn(component, "onValueChange").and.callThrough();
    component.questions = mockQuestionData;
    component.criteriaId = "do_1134460323602841601200";
    component.rendering_sequence = mockRenderingSequence;
    component.pageNumArray = mockPageNumberArray;
    const question = mockQuestionData[0];
    component.onValueChange(1, question, 1);
    expect(component.onValueChange).toHaveBeenCalledWith(1, question, 1);
    expect(question.page_no).toBe(1);
  });

  it("#createSequence should call to create the sequence for pagination", () => {
    spyOn(component, "createSequence").and.callThrough();
    component.treeData = mockTreeData;
    component.createSequence(component.treeData);
    expect(component.createSequence).toHaveBeenCalledWith(component.treeData);
  });

  it("#findSequenceCriteria should call to check the rendering sequence", () => {
    spyOn(component, "findSequenceCriteria").and.callThrough();
    component.criteriaId = "do_1134460323602841601200";
    component.rendering_sequence = mockRenderingSequence;
    component.findSequenceCriteria();
    expect(component.criteriaId).toBe("do_1134460323602841601200");
  });

  it("#clearInput should call to check the rendering sequence", () => {
    spyOn(component, "clearInput").and.callThrough();
    component.questions = mockQuestionData;
    component.criteriaId = "do_1134460323602841601200";
    component.rendering_sequence = mockRenderingSequence;
    component.pageNumArray = mockPageNumberArray;
    const question = mockQuestionData[0];
    component.clearInput(1, question, 1);
    expect(component.clearInput).toHaveBeenCalledWith(1, question, 1);
    expect(question.page_no).toBe(1);
  });

  it("#updateRenderingSequence should call to update the rendering sequence", () => {
    spyOn(component, "updateRenderingSequence").and.callThrough();
    component.createArray = mockCreateArray;
    component.pageNumArray = mockPageNumberArray;
    component.updateRenderingSequence();
    expect(component.createArray.length).toEqual(2);
  });

  it("#setNewArrayToCreateArray should call to create the new array", () => {
    spyOn(component, "setNewArrayToCreateArray").and.callThrough();
    component.numArray = [1, 2, 3];
    component.setNewArrayToCreateArray();
    expect(component.createArray.length).toEqual(3);
  });

  it(`updateRenderingSequence() should be called`, () => {
    spyOn(component, "updateRenderingSequence").and.callThrough();
    component.createArray = mockCreateArray;
    component.pageNumArray = mockPageNumberArray;
    component.updateRenderingSequence();
    expect(component.updateRenderingSequence).toHaveBeenCalled();
    expect(component.createArray.length).toEqual(2);
  });
});
