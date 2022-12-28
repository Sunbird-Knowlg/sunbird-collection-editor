import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FancyTreeComponent } from './fancy-tree.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { config, treeData, tree, editorConfig, mockTreeService, mockData,
  observationWithRubricsMockData } from './fancy-tree.component.spec.data';
import { Router } from '@angular/router';
import { TreeService } from '../../services/tree/tree.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { ConfigService } from '../../services/config/config.service';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { HelperService } from '../../services/helper/helper.service';
import * as _ from 'lodash-es';

describe('FancyTreeComponent', () => {
  let component: FancyTreeComponent;
  let fixture: ComponentFixture<FancyTreeComponent>;
  let helperService;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService, HelperService,
          { provide: Router, useClass: RouterStub }, ToasterService,
          { provide: ConfigService, useValue: config },
          { provide: TreeService, useValue: mockTreeService },
          { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } }
        ],
      imports: [HttpClientTestingModule, SuiModule],
      declarations: [ FancyTreeComponent, TelemetryInteractDirective ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyTreeComponent);
    helperService = TestBed.inject(HelperService);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('#ngOnInit() should call #initialize() when primaryCategory os obs with rubrics', () => {
    // tslint:disable-next-line:no-shadowed-variable
    const treeService = TestBed.inject(TreeService);
    component.nodes = {
      data: observationWithRubricsMockData.data
    };
    editorConfig.config.renderTaxonomy = true ;
    spyOn(component, 'ngOnInit').and.callThrough();
    spyOn(component, 'initialize').and.callThrough();
    component.ngOnInit();
    expect(component.initialize).toHaveBeenCalled();
  });


  it('#addFromLibrary() should call #emitshowLibraryPageEvent()', () => {
    spyOn(component.treeEventEmitter, 'emit').and.callThrough();
    component.addFromLibrary();
    expect(component.treeEventEmitter.emit).toHaveBeenCalledWith({ type: 'showLibraryPage' });
  });

  it('#ngAfterViewInit() should call #getTreeConfig() and #renderTree()', () => {
    spyOn(component, 'getTreeConfig').and.callFake(() => {});
    spyOn(component, 'renderTree').and.callFake(() => {});
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getTreeConfig).toHaveBeenCalled();
    expect(component.renderTree).toHaveBeenCalled();
  });

  it('call #eachNodeActionButton() to verify #visibility for root node', () => {
    spyOn(component, 'eachNodeActionButton').and.callThrough();
    component.config = mockData.config;
    const rootNode = {
      getLevel: () => 1,
      folder: true,
      data: { root: true },
    };
    component.eachNodeActionButton(rootNode);
    expect(component.visibility.addFromLibrary).toBeFalsy();
    expect(component.visibility.createNew).toBeFalsy();
    expect(component.visibility.addChild).toBeTruthy();
    expect(component.visibility.addSibling).toBeFalsy();
    expect(component.eachNodeActionButton).toHaveBeenCalled();
  });

  it('call #eachNodeActionButton() to verify #visibility for child node', () => {
    component.config = mockData.config;
    const node = {
      getLevel: () => 2,
      folder: true,
      data: { root: false },
    };
    component.eachNodeActionButton(node);
    expect(component.visibility.addChild).toBeTruthy();
    expect(component.visibility.addSibling).toBeTruthy();
    expect(component.visibility.addFromLibrary).toBeFalsy();
    expect(component.visibility.createNew).toBeFalsy();
  });

  it('call #eachNodeActionButton() to verify #visibility for leaf node', () => {
    component.config = mockData.config;
    const node = {
      getLevel: () => 3,
      folder: true,
      data: { root: false },
    };
    component.eachNodeActionButton(node);
    expect(component.visibility.addChild).toBeFalsy();
    expect(component.visibility.addSibling).toBeTruthy();
    expect(component.visibility.addFromLibrary).toBeFalsy();
    expect(component.visibility.createNew).toBeFalsy();
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
    spyOn(component, 'dropNode').and.callFake(() => {
      return true;
    });
    const targetNode = { folder: false, getLevel: () => 2 };
    // tslint:disable-next-line:max-line-length
    const contentNode: any = { hitMode: 'after', otherNode: { data: {id: 'do_11330103476396851218'}, getLevel: () => 1, moveTo: () => true }, node: { data: { root: false } }};
    component.dropNode(targetNode, contentNode);
    const result = component.dragDrop(targetNode, contentNode);
    expect(result).toBeTruthy();
  });

});
