import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignPageNumberComponent } from './assign-page-number.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeService } from '../../services/tree/tree.service';
import { mockTreeService } from '../fancy-tree/fancy-tree.component.spec.data';
import { EditorService } from '../../services/editor/editor.service';
import { of, throwError } from 'rxjs';

const mockEditorService = {
  getToolbarConfig: () => { },
  getHierarchyObj: () => { },
  treeData: {}
};

describe('AssignPageNumberComponent', () => {
  let component: AssignPageNumberComponent;
  let fixture: ComponentFixture<AssignPageNumberComponent>;
  // tslint:disable-next-line:one-variable-per-declaration
  let treeService, editorService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AssignPageNumberComponent],
      providers: [
        { provide: TreeService, useValue: mockTreeService },
        { provide: EditorService, useValue: mockEditorService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPageNumberComponent);
    treeService = TestBed.inject(TreeService);
    editorService = TestBed.inject(EditorService);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should called', () => {
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(editorService, 'getToolbarConfig').and.returnValue({
      title: 'Observation Form'
    });
    component.toolbarConfig.title = 'Observation Form';
    component.ngOnInit();
    expect(component.toolbarConfig).toBeDefined();
    expect(component.toolbarConfig.title).toEqual('Observation Form');
  });

  it('#toolbarEventListener() should call #handleRedirectToQuestionSet() if event is backContent', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    spyOn(component, 'redirectToQuestionSet').and.callThrough();
    const event = {
      button: 'backContent'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToQuestionSet).toHaveBeenCalled();
  });

  it('#redirectToQuestionSet() should emit #assignPageEmitter event', () => {
    spyOn(component.assignPageEmitter, 'emit');
    component.redirectToQuestionSet();
    expect(component.assignPageEmitter.emit).toHaveBeenCalledWith({ status: false });
  });

});
