import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlainTreeComponent } from './plain-tree.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { treeData } from '../fancy-tree/fancy-tree.component.spec.data';
import { collectionHierarchyMock } from '../question/question.component.spec.data';
import { EditorService } from '../../services/editor/editor.service';

const mockEditorService = {
  editorConfig: {
    config: {
      renderTaxonomy: false,
      hierarchy: {
        level1: {
          name: 'Module',
          type: 'Unit',
          mimeType: 'application/vnd.sunbird.questionset',
          contentType: 'Observation',
          iconClass: 'fa fa-folder-o',
          children: {},
        },
      },
    },
  },
  parentIdentifier: '',
  optionsLength: 4,
  selectedChildren: {
    primaryCategory: 'Multiselect Multiple Choice Question',
    label: 'Multiple Choice Question',
    interactionType: 'choice',
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

xdescribe('PlainTreeComponent', () => {
  let component: PlainTreeComponent;
  let fixture: ComponentFixture<PlainTreeComponent>;
  let editorService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PlainTreeComponent ],
      providers: [
        { provide: EditorService, useValue: mockEditorService }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainTreeComponent);
    editorService = TestBed.get(EditorService);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngAfterViewInit() should call #getTreeConfig() and #renderTree()', () => {
    editorService = mockEditorService;
    spyOn(component, 'renderTree');
    spyOn(component, 'getTreeConfig');
    component.ngAfterViewInit();
    expect(component.renderTree).toHaveBeenCalled();
    expect(component.getTreeConfig).toHaveBeenCalled();
  });
});
