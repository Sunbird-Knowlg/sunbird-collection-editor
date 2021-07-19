import { EditorService } from './../../services/editor/editor.service';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FancyTreeComponent } from './fancy-tree.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { config, treeData, tree, editorConfig } from './fancy-tree.component.spec.data';
import { Router } from '@angular/router';
import { TreeService } from '../../services/tree/tree.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { ConfigService } from '../../services/config/config.service';
import { SuiModule } from 'ng2-semantic-ui-v9';
describe('FancyTreeComponent', () => {
  let component: FancyTreeComponent;
  let fixture: ComponentFixture<FancyTreeComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService, TreeService, EditorService,
          { provide: Router, useClass: RouterStub }, ToasterService,
          { provide: ConfigService, useValue: config }],
      imports: [HttpClientTestingModule, SuiModule],
      declarations: [ FancyTreeComponent, TelemetryInteractDirective ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyTreeComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit() should call #buildTree()', () => {
    const editorService = TestBed.get(EditorService);
    component.nodes = {
      data: treeData
    };
    spyOnProperty(editorService, 'editorConfig', 'get').and.returnValue(editorConfig);
    spyOn(component, 'buildTree');
    component.ngOnInit();
    expect(component.buildTree).toHaveBeenCalled();
  });

  it('#addFromLibrary() should call #emitshowLibraryPageEvent()', () => {
    const editorService: EditorService = TestBed.get(EditorService);
    spyOn(editorService, 'emitshowLibraryPageEvent').and.returnValue('showLibraryPage');
    component.addFromLibrary();
    expect(editorService.emitshowLibraryPageEvent).toHaveBeenCalledWith('showLibraryPage');
  });

  it('#ngAfterViewInit() should call #getTreeConfig() and #renderTree()', () => {
    spyOn(component, 'getTreeConfig');
    spyOn(component, 'renderTree');
    component.ngAfterViewInit();
    expect(component.getTreeConfig).toHaveBeenCalled();
    expect(component.renderTree).toHaveBeenCalled();
  });

  it('#addFromLibrary() should call #emitshowLibraryPageEvent()', () => {
    const editorService: EditorService = TestBed.get(EditorService);
    spyOn(editorService, 'emitshowLibraryPageEvent');
    component.addFromLibrary();
    expect(editorService.emitshowLibraryPageEvent).toHaveBeenCalled();
  });

  it('#handleActionButtons() should call #removeNode() if action is delete', () => {
    const el = {id: 'delete'};
    spyOn(component, 'removeNode');
    component.handleActionButtons(el);
    expect(component.removeNode).toHaveBeenCalled();
  });

  it('#handleActionButtons() should call #addSibling() if action is addsibling', () => {
    const el = {id: 'addsibling'};
    spyOn(component, 'addSibling');
    component.handleActionButtons(el);
    expect(component.addSibling).toHaveBeenCalled();
  });

  it('#handleActionButtons() should call #addChild() if action is addchild', () => {
    const el = {id: 'addchild'};
    spyOn(component, 'addChild');
    component.handleActionButtons(el);
    expect(component.addChild).toHaveBeenCalled();
  });

  it('#createNewContent() should emit event', () => {
    spyOn(component.treeEventEmitter, 'emit');
    component.createNewContent();
    expect(component.treeEventEmitter.emit).toHaveBeenCalled();
  });

  it('#isFolder() should return false if config.objectType = QuestionSet and child.objectType = Question', () => {
    component.config = {
      objectType: 'QuestionSet'
    };
    const child = {
      objectType: 'Question'
    };

    const result = component.isFolder(child);
    expect(result).toEqual(false);
  });

  it('#isFolder() should return true if child.visibility = Parent', () => {
    component.config = {
      objectType: 'QuestionSet'
    };
    const child = {
      objectType: '',
      visibility: 'Parent'
    };

    const result = component.isFolder(child);
    expect(result).toEqual(true);
  });

  it('#isFolder() should return false if child.visibility != Parent', () => {
    component.config = {
      objectType: 'QuestionSet'
    };
    const child = {
      objectType: '',
      visibility: 'Child'
    };

    const result = component.isFolder(child);
    expect(result).toEqual(false);
  });

  it('#isContent() should return true if config.objectType = QuestionSet and child.objectType = Question', () => {
    component.config = {
      objectType: 'QuestionSet'
    };
    const child = {
      objectType: 'Question'
    };
    const result = component.isContent(child);
    expect(result).toEqual(true);
  });

  it('#getIconClass() should return class = fa fa-file-o', () => {
    component.config = {
      objectType: 'QuestionSet'
    };
    const child = {
      objectType: 'Question'
    };

    const result = component.getIconClass(child, 1);
    expect(result).toEqual('fa fa-file-o');
  });

  it('#getIconClass() should return class = fa fa-folder-o', () => {
    component.config = {
      objectType: 'QuestionSet'
    };
    const child = {
      objectType: '',
      visibility: 'Parent'
    };

    const result = component.getIconClass(child, 1);
    expect(result).toEqual('fa fa-folder-o');
  });

  it('#getIconClass() should return class = fa fa-file-o', () => {
    component.config = {
      objectType: 'QuestionSet'
    };
    const child = {
      objectType: '',
      visibility: ''
    };

    const result = component.getIconClass(child, 1);
    expect(result).toEqual('fa fa-file-o');
  });

  it('#dragDrop() should call #dropNotAllowed()', () => {
    const data = {
      hitMode: 'before',
      node: {
          data: {
            root: true
          },
      }
    };
    spyOn(component, 'dropNotAllowed');
    const node = {};
    component.dragDrop(node, data);
    expect(component.dropNotAllowed).toHaveBeenCalled();
  });

  it('#dragDrop() should call #dropNode()', () => {
    const data = {
      node: {
          data: {
            root: true
          },
      }
    };
    component.config = {
      maxDepth: 2
    };
    spyOn(component, 'dropNode').and.callFake(() => {
      return true;
    });
    const node = {};
    component.dragDrop(node, data);
    expect(component.dropNode).toHaveBeenCalled();
  });

  it('#dropNotAllowed() should return false', () => {
    const result = component.dropNotAllowed();
    expect(result).toBeFalsy();
  });

  it('#buildTree() should return tree objects', () => {
    const result = component.buildTree(treeData, tree, 2);
    expect(result.length).toBeGreaterThan(1);
  });

  it ('#checkContentAddition() should check node hitMode', () => {
    component.config = editorConfig;
    const targetNode = { folder: false, getLevel: () => 2 };
    let contentNode: any = { hitMode: 'before', otherNode : { data: { metadata: { primaryCategory: 'eTextbook'}}}};
    const result = component.checkContentAddition(targetNode, contentNode);
    expect(result).toBeTruthy();
    contentNode =  { hitMode: 'over' };
    const result1 = component.checkContentAddition(targetNode, contentNode);
    expect(result1).toBeFalsy();
  });

  it ('#checkContentAddition() should check contentType while rearrange resources', () => {
    component.config = editorConfig.config;
    const targetNode = { folder: true, getLevel: () => 3 };
    const contentNode: any = { hitMode: 'before', otherNode : { data: { metadata: { primaryCategory: 'eTextbook'}}}};
    const result = component.checkContentAddition(targetNode, contentNode);
    expect(result).toBeTruthy();
  });

  it ('#dropNotAllowed() should throw warning message', () => {
    const toasterService = TestBed.inject(ToasterService);
    spyOn(toasterService, 'warning').and.callThrough();
    const result = component.dropNotAllowed();
    expect(result).toBeFalsy();
    expect(toasterService.warning).toHaveBeenCalled();
  });

  it ('#dragDrop() should throw warning message when root node', () => {
    const toasterService = TestBed.inject(ToasterService);
    spyOn(toasterService, 'warning').and.callThrough();
    const targetNode = { folder: false, getLevel: () => 2 };
    const contentNode: any = { hitMode: 'before', node: { data: { root: true } }};
    const result = component.dragDrop(targetNode, contentNode);
    expect(result).toBeFalsy();
    expect(toasterService.warning).toHaveBeenCalled();
  });

  it ('#dragDrop() should drag node when maxDepth not empty', () => {
    component.config =  editorConfig.config;
    const targetNode = { folder: false, getLevel: () => 2 };
    spyOn(component, 'dropNode').and.callFake(() => {
      return true;
    });
    const contentNode: any = { hitMode: 'before', node: { data: { root: false } }};
    const result = component.dragDrop(targetNode, contentNode);
    expect(result).toBeTruthy();
  });

  it ('#dropNode() should drop node', () => {
    component.config =  editorConfig.config;
    const targetNode = { folder: false, getLevel: () => 2 };
    const contentNode: any = { hitMode: 'before', otherNode: { getLevel: () => 1, moveTo: () => true }, node: { data: { root: false } }};
    const result = component.dropNode(targetNode, contentNode);
    expect(result).toBeTruthy();
  });

});
