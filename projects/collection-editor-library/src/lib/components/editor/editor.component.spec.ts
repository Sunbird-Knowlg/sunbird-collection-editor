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
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';


const mockEditorService = {
  editorConfig: {
    config: {
      hierarchy: {
        level1: {
          name: 'Module',
          type: 'Unit',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Course Unit',
          iconClass: 'fa fa-folder-o',
          children: {}
        }
      }
    }
  }
};

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, FormsModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ EditorComponent, TelemetryInteractDirective ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [ EditorTelemetryService, EditorService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#showConfirmPopup should be false', ()=> {
    expect(component.showConfirmPopup).toBeFalsy();
  })

  it('#terms to be false', () => {
    expect(component.terms).toBeFalsy();
  })

  it('#showLibraryPage to be false', () => {
    expect(component.showLibraryPage).toBeFalsy();
  })

  it('#showQuestionTemplatePopup to be false', () => {
    expect(component.showQuestionTemplatePopup).toBeFalsy();
  })

  it('#showDeleteConfirmationPopUp to be false', () => {
    expect(component.showDeleteConfirmationPopUp).toBeFalsy();
  })

  it('#showPreview to be false', () => {
    expect(component.showPreview).toBeFalsy();
  })

  it('should call #impression() method after view init', () => {
    const telemetryService = TestBed.get(EditorTelemetryService)
    spyOn(telemetryService, 'impression').and.callFake(() => {
      return true;
    });
    component.ngAfterViewInit();
    expect(telemetryService.impression).toHaveBeenCalled();
  });

  xit('#redirectToChapterListTab() should emit #editorEmitter event', () => {
    let editorEmitter = new EventEmitter<any>()
    spyOn(editorEmitter, 'emit').and.callFake(() => {
      return true;
    });
    component.redirectToChapterListTab();
    expect(editorEmitter.emit).toHaveBeenCalled();
  });

  it('#updateToolbarTitle() should call #getActiveNode() method', () => {
    let treeService = TestBed.get(TreeService)
    component.toolbarConfig = {"title": "test"}
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return {'data': {'root': true}};
    });
    component.updateToolbarTitle({'event': {name: 'test'}});
    expect(treeService.getActiveNode).toHaveBeenCalled();
  });

  xit('#editorService.initialize() should be called on #ngOnInit()', () => {
    const editorService = TestBed.get(EditorService);
    spyOn(editorService, 'initialize').and.callFake(() => {
      return true;
    });

    const treeService = TestBed.get(TreeService);
    spyOn(treeService, 'initialize').and.callFake(() => {
      return true;
    });

    // spyOn(component.ngOnInit).and.callFake(()=> {
    //   return true;
    // })

    // component.ngOnInit();
    // expect(editorService.initialize).toHaveBeenCalled();
  })

  it('#previewContent() should call #saveContent()', () => {
    spyOn(component, 'saveContent').and.callFake(()=>{
      return Promise.resolve();
    });
    component.previewContent();
    expect(component.saveContent).toHaveBeenCalled();
  })

  it("#toolbarEventListener() shoudl call #saveContent() if event is saveContent", ()=> {
    spyOn(component, 'saveContent').and.callFake(()=>{
      return Promise.resolve();
    });
    let event = {
      button : 'saveContent'
    }
    component.toolbarEventListener(event);
    expect(component.saveContent).toHaveBeenCalled();
  })

  it("#toolbarEventListener() shoudl call #previewContent() if event is previewContent", ()=> {
    spyOn(component, 'previewContent');
    let event = {
      button : 'previewContent'
    }
    component.toolbarEventListener(event);
    expect(component.previewContent).toHaveBeenCalled();
  })

  it("#toolbarEventListener() should call #showLibraryComponentPage() if event is addFromLibrary", ()=> {
    spyOn(component, 'showLibraryComponentPage');
    let event = {
      button : 'addFromLibrary'
    }
    component.toolbarEventListener(event);
    expect(component.showLibraryComponentPage).toHaveBeenCalled();
  })

  it ("#toolbarEventListener() should call #submitHandler() if event is submitContent", ()=> {
    spyOn(component, 'submitHandler');
    let event = {
      button : 'submitContent'
    }
    component.toolbarEventListener(event);
    expect(component.submitHandler).toHaveBeenCalled();
  })

  it ("#toolbarEventListener() should set #showDeleteConfirmationPopUp to true if event is removeContent", ()=> {
    let event = {
      button : 'removeContent'
    }
    component.toolbarEventListener(event);
    expect(component.showDeleteConfirmationPopUp).toBeTruthy();
  })

  it ("#toolbarEventListener() should call #rejectContent() if event is rejectContent", ()=> {
    spyOn(component, 'rejectContent')
    let event = {
      button : 'rejectContent'
    }
    component.toolbarEventListener(event);
    expect(component.rejectContent).toHaveBeenCalled();
  })

  it("#toolbarEventListener() should call #publishContent() if event is publishContent", ()=> {
    spyOn(component, 'publishContent')
    let event = {
      button : 'publishContent'
    }
    component.toolbarEventListener(event);
    expect(component.publishContent).toHaveBeenCalled();
  })

  it("#toolbarEventListener() should call #updateToolbarTitle() if event is onFormValueChange", ()=> {
    spyOn(component, 'updateToolbarTitle')
    let event = {
      button : 'onFormValueChange'
    }
    component.toolbarEventListener(event);
    expect(component.updateToolbarTitle).toHaveBeenCalled();
  })

  it("#toolbarEventListener() should call #redirectToChapterListTab() if event is backContent", ()=> {
    spyOn(component, 'redirectToChapterListTab')
    let event = {
      button : 'backContent'
    }
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  })

  it("#toolbarEventListener() should call #redirectToChapterListTab() if event is sendForCorrections", ()=> {
    spyOn(component, 'redirectToChapterListTab')
    let event = {
      button : 'sendForCorrections'
    }
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  })

  it("#toolbarEventListener() should call #redirectToChapterListTab() if event is sourcingApprove", ()=> {
    spyOn(component, 'redirectToChapterListTab')
    let event = {
      button : 'sourcingApprove'
    }
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  })

  it("#toolbarEventListener() should call #redirectToChapterListTab() if event is sourcingReject", ()=> {
    spyOn(component, 'redirectToChapterListTab')
    let event = {
      button : 'sourcingReject'
    }
    component.toolbarEventListener(event);
    expect(component.redirectToChapterListTab).toHaveBeenCalled();
  })

  it('#saveContent() should call #validateFormStatus()', () => {
    spyOn(component, 'validateFormStatus')
    component.saveContent();
    expect(component.validateFormStatus).toHaveBeenCalled();
  })

  xit('#submitHandler() should call #validateFormStatus()', () => {
    spyOn(component, 'validateFormStatus')
    component.submitHandler();
    expect(component.validateFormStatus).toHaveBeenCalled();
  })

  it('#sendForReview() should call #saveContent()', () => {
    spyOn(component, 'saveContent').and.callFake(()=>{
      return Promise.resolve();
    })
    component.sendForReview();
    expect(component.saveContent).toHaveBeenCalled();
  })

  xit('#rejectContent() should call #submitRequestChanges() method', () => {
    let editorService = TestBed.get(EditorService);
    spyOn(editorService, 'submitRequestChanges').and.callFake(()=>{
      return Promise.resolve();
    });
    component.rejectContent('test');
    expect(editorService.submitRequestChanges).toHaveBeenCalled();
  })
});
