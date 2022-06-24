import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlainTreeComponent } from './plain-tree.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { editorConfig, treeData } from '../fancy-tree/fancy-tree.component.spec.data';
import { collectionHierarchyMock } from '../question/question.component.spec.data';
import { EditorService } from '../../services/editor/editor.service';
import { mockTreedata } from './plain-tree.component.spec.data';

describe('PlainTreeComponent', () => {
  let component: PlainTreeComponent;
  let fixture: ComponentFixture<PlainTreeComponent>;
  let editorService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PlainTreeComponent ],
      providers: [
        EditorService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainTreeComponent);
    editorService = TestBed.get(EditorService);
    component = fixture.componentInstance;
    spyOnProperty(editorService, 'editorConfig', 'get').and.returnValue(editorConfig);
    // component.ngAfterViewInit();
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#buildTreeData should call', () => {
     spyOn(component, 'buildTreeData').and.callThrough();
     component.buildTreeData(mockTreedata);
     expect(component.buildTreeData).toHaveBeenCalledWith(mockTreedata);
  });

  it('#ngAfterViewInit() should call #getTreeConfig() and #renderTree()', () => {
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    spyOn(component, 'renderTree');
    spyOn(component, 'getTreeConfig');
    component.ngAfterViewInit();
    expect(component.renderTree).toHaveBeenCalled();
    expect(component.getTreeConfig).toHaveBeenCalled();
  });

  it('#getQuestionsList should call', () => {
    spyOn(component, 'getQuestionsList').and.callThrough();
    spyOn(component.treeEmitter, 'emit');
    component.getQuestionsList('do_123');
    expect(component.treeEmitter.emit).toHaveBeenCalledWith({identifier : 'do_123'});
  });
});
