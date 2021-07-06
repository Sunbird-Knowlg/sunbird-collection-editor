import { EditorService } from './../../services/editor/editor.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TreeService } from '../../services/tree/tree.service';
import { editorConfig, nativeElement, getCategoryDefinitionResponse, hierarchyResponse,
  categoryDefinition } from './editor.component.spec.data';
import { ConfigService } from '../../services/config/config.service';
import { of } from 'rxjs';
import { DialcodeService } from '../../services/dialcode/dialcode.service';
import { treeData } from './../fancy-tree/fancy-tree.component.spec.data';
import * as urlConfig from '../../services/config/url.config.json';
import * as labelConfig from '../../services/config/label.config.json';
import * as categoryConfig from '../../services/config/category.config.json';
import { FrameworkService } from '../../services/framework/framework.service';
import { HelperService } from '../../services/helper/helper.service';

describe('EditorComponent', () => {
  const configStub = {
    urlConFig: (urlConfig as any).default,
    labelConfig: (labelConfig as any).default,
    categoryConfig: (categoryConfig as any).default
  };

  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  let editorService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ EditorComponent, TelemetryInteractDirective ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ EditorTelemetryService, EditorService, DialcodeService,
        { provide: ConfigService, useValue: configStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    editorService = TestBed.inject(EditorService);
    component.editorConfig = editorConfig;
    spyOnProperty(editorService, 'editorConfig', 'get').and.returnValue(editorConfig);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#showConfirmPopup should be false', () => {
    expect(component.showConfirmPopup).toBeFalsy();
  });

  it('#terms to be false', () => {
    expect(component.terms).toBeFalsy();
  });

  it('#showLibraryPage to be false', () => {
    expect(component.showLibraryPage).toBeFalsy();
  });

  it('#showDeleteConfirmationPopUp to be false', () => {
    expect(component.showDeleteConfirmationPopUp).toBeFalsy();
  });

  it('#showPreview to be false', () => {
    expect(component.showPreview).toBeFalsy();
  });

  it('#showQuestionTemplatePopup to be false', () => {
    expect(component.showQuestionTemplatePopup).toBeFalsy();
  });

  it('#addCollaborator to be undefined', () => {
    expect(component.addCollaborator).toBeUndefined();
  });

  it('#buttonLoaders values should be set', () => {
    expect(component.buttonLoaders.saveAsDraftButtonLoader).toBeFalsy();
    expect(component.buttonLoaders.addFromLibraryButtonLoader).toBeFalsy();
    expect(component.buttonLoaders.previewButtonLoader).toBeFalsy();
    expect(component.buttonLoaders.showReviewComment).toBeFalsy();
  });

  it('#ngOnInit() should call all methods inside it', () => {
    spyOn(editorService, 'initialize').and.callFake(() => {});
    spyOn(editorService, 'getToolbarConfig').and.returnValue({title: 'abcd', showDialcode: 'No'});
    const treeService = TestBed.inject(TreeService);
    spyOn(treeService, 'initialize').and.callFake(() => {});
    spyOn(component, 'mergeCollectionExternalProperties').and.returnValue(of(hierarchyResponse));
    const frameworkService = TestBed.inject(FrameworkService);
    spyOn(frameworkService, 'initialize').and.callFake(() => {});
    spyOn(frameworkService, 'getTargetFrameworkCategories').and.callFake(() => {});
    const helperService = TestBed.inject(HelperService);
    spyOn(helperService, 'initialize').and.callFake(() => {});
    spyOn(editorService, 'getCategoryDefinition').and.returnValue(of(getCategoryDefinitionResponse));
    component.ngOnInit();
    expect(component.editorMode).toBeDefined();
    expect(editorService.initialize).toHaveBeenCalled();
    expect(treeService.initialize).toHaveBeenCalled();
    expect(component.collectionId).toBeDefined();
    expect(editorService.getToolbarConfig).toHaveBeenCalled();
    expect(component.toolbarConfig).toBeDefined();
    expect(component.organisationFramework).toBeDefined();
    expect(component.targetFramework).toBeDefined();
    expect(frameworkService.initialize).toHaveBeenCalled();
    expect(frameworkService.getTargetFrameworkCategories).toHaveBeenCalled();
    expect(helperService.initialize).toHaveBeenCalled();
    expect(editorService.getCategoryDefinition).toHaveBeenCalled();
  });

  it('#setEditorForms() should set variable values', () => {
    spyOn(component, 'setEditorForms').and.callThrough();
    component.setEditorForms(categoryDefinition);
    expect(component.unitFormConfig).toBeDefined();
    expect(component.rootFormConfig).toBeDefined();
    expect(component.libraryComponentInput.searchFormConfig).toBeDefined();
    expect(component.leafFormConfig).toBeDefined();
  });

  it('#ngAfterViewInit() should call #impression()', () => {
    const telemetryService = TestBed.inject(EditorTelemetryService);
    telemetryService.telemetryPageId = 'collection_editor';
    spyOn(telemetryService, 'impression').and.callFake(() => {});
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(telemetryService.impression).toHaveBeenCalled();
  });

  it('#redirectToChapterListTab() should emit #editorEmitter event', () => {
    component.actionType = 'dummyCase';
    component.collectionId = 'do_12345';
    spyOn(component.editorEmitter, 'emit');
    component.redirectToChapterListTab();
    expect(component.editorEmitter.emit).toHaveBeenCalled();
  });

  it('#updateToolbarTitle() should call #getActiveNode() method and set title name as test', () => {
    const treeService = TestBed.inject(TreeService);
    component.toolbarConfig = {title: ''};
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return {data: {root: true}};
    });
    component.updateToolbarTitle({event: {name: 'test'}});
    expect(treeService.getActiveNode).toHaveBeenCalled();
    expect(component.toolbarConfig.title).toEqual('test');
  });

  it('#updateToolbarTitle() should call #getActiveNode() method and set title name as Untitled', () => {
    const treeService = TestBed.inject(TreeService);
    component.toolbarConfig = {title: ''};
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return {data: {root: true}};
    });
    component.updateToolbarTitle({event: {name: ''}});
    expect(treeService.getActiveNode).toHaveBeenCalled();
    expect(component.toolbarConfig.title).toEqual('Untitled');
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

  it('#toolbarEventListener() should call #saveContent() if event is saveContent', () => {
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve();
    });
    const event = {
      button : 'saveContent'
    };
    component.toolbarEventListener(event);
    expect(component.saveContent).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #previewContent() if event is previewContent', () => {
    spyOn(component, 'previewContent').and.callFake(() => {});
    const event = {
      button : 'previewContent'
    };
    component.toolbarEventListener(event);
    expect(component.previewContent).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #showLibraryComponentPage() if event is addFromLibrary', () => {
    spyOn(component, 'showLibraryComponentPage').and.callFake(() => {});
    const event = {
      button : 'addFromLibrary'
    };
    component.toolbarEventListener(event);
    expect(component.showLibraryComponentPage).toHaveBeenCalled();
  });

  it ('#toolbarEventListener() should call #submitHandler() if event is submitContent', () => {
    spyOn(component, 'submitHandler').and.callFake(() => {});
    const event = {
      button : 'submitContent'
    };
    component.toolbarEventListener(event);
    expect(component.submitHandler).toHaveBeenCalled();
  });

  it ('#toolbarEventListener() should set #showDeleteConfirmationPopUp to true if event is removeContent', () => {
    const event = {
      button : 'removeContent'
    };
    component.toolbarEventListener(event);
    expect(component.showDeleteConfirmationPopUp).toBeTruthy();
  });

  it ('#toolbarEventListener() should call #rejectContent() if event is rejectContent', () => {
    spyOn(component, 'redirectToQuestionTab').and.callFake(() => {});
    const event = {
      button : 'editContent',
      comment: 'abcd'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToQuestionTab).toHaveBeenCalled();
  });


  it ('#toolbarEventListener() should call #rejectContent() if event is rejectContent', () => {
    spyOn(component, 'rejectContent').and.callFake(() => {});
    const event = {
      button : 'rejectContent',
      comment: 'abcd'
    };
    component.toolbarEventListener(event);
    expect(component.rejectContent).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #publishContent() if event is publishContent', () => {
    spyOn(component, 'publishContent').and.callFake(() => {});
    const event = {
      button : 'publishContent'
    };
    component.toolbarEventListener(event);
    expect(component.publishContent).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should set formStatusMapper', () => {
    const treeService = TestBed.inject(TreeService);
    spyOn(treeService, 'getActiveNode').and.returnValue({data: {id: '12345'}});
    spyOn(component, 'updateToolbarTitle');
    const event = {
      button : 'onFormStatusChange',
      event: {isValid: true}
    };
    component.toolbarEventListener(event);
  });

  it('#toolbarEventListener() should call #updateToolbarTitle() if event is onFormValueChange', () => {
    spyOn(component, 'updateToolbarTitle').and.callFake(() => {});
    const event = {
      button : 'onFormValueChange'
    };
    component.toolbarEventListener(event);
    expect(component.updateToolbarTitle).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #redirectToChapterListTab() if event is backContent', () => {
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    const event = {
      button : 'backContent'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #redirectToChapterListTab() if event is sendForCorrections', () => {
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    const event = {
      button : 'sendForCorrections',
      comment: 'abcd'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #redirectToChapterListTab() if event is sourcingApprove', () => {
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    const event = {
      button : 'sourcingApprove'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#toolbarEventListener() should call #redirectToChapterListTab() if event is sourcingReject', () => {
    spyOn(component, 'redirectToChapterListTab').and.callFake(() => {});
    const event = {
      button : 'sourcingReject',
      comment: 'abcd'
    };
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it ('#toolbarEventListener() should set showReviewModal to true ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    component.showReviewModal = false;
    const event = {
      button : 'showReviewcomments'
    };
    component.toolbarEventListener(event);
    expect(component.showReviewModal).toBeTruthy();
  });

  it ('#toolbarEventListener() should set showReviewModal to false ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    component.showReviewModal = true;
    const event = {
      button : 'showReviewcomments'
    };
    component.toolbarEventListener(event);
    expect(component.showReviewModal).toBeFalsy();
  });

  it ('#toolbarEventListener() should call #toggleCollaboratorModalPoup()', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    spyOn(component, 'toggleCollaboratorModalPoup').and.callFake(() => {});
    const event = {
      button : 'addCollaborator'
    };
    component.toolbarEventListener(event);
    expect(component.actionType).toBe('addCollaborator');
    expect(component.toggleCollaboratorModalPoup).toHaveBeenCalled();
  });

  it ('#toggleCollaboratorModalPoup() should set addCollaborator to true', () => {
    component.addCollaborator = false;
    spyOn(component, 'toggleCollaboratorModalPoup').and.callThrough();
    component.toggleCollaboratorModalPoup();
    expect(component.addCollaborator).toEqual(true);
  });

  it ('#toggleCollaboratorModalPoup() should set addCollaborator to false', () => {
    component.addCollaborator = true;
    spyOn(component, 'toggleCollaboratorModalPoup').and.callThrough();
    component.toggleCollaboratorModalPoup();
    expect(component.addCollaborator).toEqual(false);
  });

  it ('#toolbarEventListener() should set showReviewModal to true ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    component.showReviewModal = undefined;
    const event = {
      button : 'showCorrectioncomments'
    };
    component.toolbarEventListener(event);
    expect(component.contentComment).toBeUndefined();
    expect(component.showReviewModal).toEqual(true);
  });

  it ('#toolbarEventListener() should set showReviewModal to false ', () => {
    spyOn(component, 'toolbarEventListener').and.callThrough();
    component.showReviewModal = true;
    const event = {
      button : 'showCorrectioncomments'
    };
    component.toolbarEventListener(event);
    expect(component.contentComment).toBeUndefined();
    expect(component.showReviewModal).toEqual(false);
  });

  it('#handleModalDismiss should call #toggleCollaboratorModalPoup()', () => {
    spyOn(component, 'toggleCollaboratorModalPoup').and.callFake(() => {});
    spyOn(component, 'handleModalDismiss').and.callThrough();
    component.handleModalDismiss({});
    expect(component.toggleCollaboratorModalPoup).toHaveBeenCalled();
  });

  it('#saveContent() should call #validateFormStatus()', () => {
    spyOn(component, 'validateFormStatus').and.callFake(() => {});
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

  it('#sendForReview() should call #saveContent()', () => {
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve();
    });
    component.sendForReview();
    expect(component.saveContent).toHaveBeenCalled();
  });

  it('#rejectContent() should call #submitRequestChanges() and #redirectToChapterListTab()', async () => {
    component.collectionId = 'do_1234';
    spyOn(editorService, 'submitRequestChanges').and.returnValue(of({}));
    spyOn(component, 'redirectToChapterListTab');
    component.rejectContent('test');
    expect(editorService.submitRequestChanges).toHaveBeenCalled();
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  it('#publishContent should call #publishContent() and #redirectToChapterListTab()', () => {
    spyOn(editorService, 'publishContent').and.returnValue(of({}));
    spyOn(component, 'redirectToChapterListTab');
    component.publishContent();
    expect(editorService.publishContent).toHaveBeenCalled();
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  });

  xit('#showLibraryComponentPage() should set #addFromLibraryButtonLoader to true and call #saveContent()', () => {
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve();
    });
    component.showLibraryComponentPage();
    expect(component.buttonLoaders.addFromLibraryButtonLoader).toEqual(true);
    expect(component.saveContent).toHaveBeenCalled();
  });

  it('#libraryEventListener() should set pageId to collection_editor', async () => {
    const res = {};
    spyOn(component, 'mergeCollectionExternalProperties').and.returnValue(of(res));
    component.libraryEventListener({});
    expect(component.pageId).toEqual('collection_editor');
  });

  it('#treeEventListener() should call #updateTreeNodeData()', () => {
    const event = { type: 'test' };
    spyOn(component, 'updateTreeNodeData').and.callFake(() => {});
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
      return {data: {metadata: treeData}};
    });
    component.collectionTreeNodes = { data: {}};
    spyOn(component, 'updateSubmitBtnVisibility');
    component.treeEventListener(event);
    expect(component.updateSubmitBtnVisibility).toHaveBeenCalled();
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
    spyOn(component, 'updateTreeNodeData').and.callFake(() => {});
    spyOn(editorService, 'checkIfContentsCanbeAdded').and.returnValue(true);
    spyOn(component, 'saveContent').and.callFake(() => {
      return Promise.resolve();
    });
    component.treeEventListener(event);
    expect(component.saveContent).toHaveBeenCalled();
    expect(component.buttonLoaders.addFromLibraryButtonLoader).toBeTruthy();
    expect(component.showQuestionTemplatePopup).toBeFalsy();
  });

  it('#handleTemplateSelection should set #showQuestionTemplatePopup to false', () => {
    component.handleTemplateSelection({});
    expect(component.showQuestionTemplatePopup).toEqual(false);
  });

  it('#handleTemplateSelection should return false', () => {
    const event = { type : 'close' };
    const result = component.handleTemplateSelection(event);
    expect(result).toEqual(false);
  });

  it('#handleTemplateSelection should call #redirectToQuestionTab()', async () => {
    const event = 'Multiple Choice Question';
    // const editorService = TestBed.get(EditorService);
    spyOn(editorService, 'getCategoryDefinition').and.returnValue(of(getCategoryDefinitionResponse));
    spyOn(component, 'redirectToQuestionTab');
    component.handleTemplateSelection(event);
    expect(component.redirectToQuestionTab).toHaveBeenCalled();
  });

  it('call #redirectToQuestionTab() to verify #questionComponentInput data', async () => {
    const mode = 'update';
    const interactionType = 'choice';
    component.collectionId = 'do_123';
    component.redirectToQuestionTab(mode, interactionType);
    expect(component.questionComponentInput).toEqual(
      {
        questionSetId: component.collectionId,
        questionId: undefined,
        type: interactionType
      }
    );
    expect(component.pageId).toEqual('question');
  });

  it('#questionEventListener() should set #pageId to collection_editor', async () => {
    spyOn(component, 'mergeCollectionExternalProperties').and.returnValue(of({}));
    expect(component.pageId).toEqual('collection_editor');
  });

  it('#showCommentAddedAgainstContent should return false', async () => {
    component.collectionTreeNodes = {
      data: {
        status: 'Live',
        rejectComment: 'test'
      }
    };
    const result = component.showCommentAddedAgainstContent();
    expect(result).toEqual(false);
  });

  it('#showCommentAddedAgainstContent should return true', () => {
    component.collectionTreeNodes = {
      data: {
        status: 'Draft',
        rejectComment: 'test'
      }
    };
    const result = component.showCommentAddedAgainstContent();
    expect(component.contentComment).toEqual('test');
    expect(result).toEqual(true);
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
      return {data: {metadata: treeData}};
    });
    spyOn(component, 'updateSubmitBtnVisibility');
    component.deleteNode();
    expect(treeService.removeNode).toHaveBeenCalled();
    expect(component.updateSubmitBtnVisibility).toHaveBeenCalled();
    expect(component.showDeleteConfirmationPopUp).toEqual(false);
  });

  it('#treeEventListener should call treeEventListener for createNewContent and checkIfContentsCanbeAdded returns false', () => {
    const event = {
      type: 'createNewContent'
    };
    spyOn(editorService, 'checkIfContentsCanbeAdded').and.returnValue(false);
    spyOn(component, 'saveContent');
    spyOn(component, 'updateTreeNodeData').and.returnValue(true);
    component.treeEventListener(event);
    expect(component.saveContent).not.toHaveBeenCalled();
  });
  it('#showLibraryComponentPage should call showLibraryComponentPage', () => {
    spyOn(editorService, 'checkIfContentsCanbeAdded').and.returnValue(false);
    spyOn(component, 'saveContent');
    component.showLibraryComponentPage();
    expect(component.saveContent).not.toHaveBeenCalled();
  });
});
