import { TreeService } from './../../services/tree/tree.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryFilterComponent } from './library-filter.component';
import { FormsModule } from '@angular/forms';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { Router } from '@angular/router';
import { CommonFormElementsModule } from 'common-form-elements';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FancyTreeComponent } from '../fancy-tree/fancy-tree.component';
import { SuiModule } from 'ng2-semantic-ui/dist';
import * as $ from 'jquery';
import 'jquery.fancytree';
import { EditorService } from '../../services/editor/editor.service';
import { By } from '@angular/platform-browser';

const mockEditorService = {
  editorConfig: {
    config : {
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

describe('LibraryFilterComponent', () => {
  let component: LibraryFilterComponent;
  let fixture: ComponentFixture<LibraryFilterComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService, { provide: Router, useClass: RouterStub }, TreeService, { provide: EditorService, useValue: mockEditorService }],
      declarations: [LibraryFilterComponent, TelemetryInteractDirective],
      imports: [FormsModule, CommonFormElementsModule, HttpClientTestingModule, SuiModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryFilterComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should called setFilterDefaultValues', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(component, 'setFilterDefaultValues').and.callThrough();
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    component.ngOnInit();
    expect(component.setFilterDefaultValues).toHaveBeenCalled();
  });

  it('should called fetchFrameWorkDetails', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    component.ngOnInit();
    expect(component.fetchFrameWorkDetails).toHaveBeenCalled();
  });

  it('should called emitApplyFilter', () => {
    spyOn(component, 'emitApplyFilter');
    component.applyFilter();
    expect(component.emitApplyFilter).toHaveBeenCalled();
  });

  it('should call onQueryEnter', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    component.ngOnInit();

    const fixture = TestBed.createComponent(LibraryFilterComponent);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('keyup.enter', {});
    fixture.detectChanges();

    spyOn(component, 'onQueryEnter');
  });

  it('should call showfilter', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    component.ngOnInit();

    const fixture = TestBed.createComponent(LibraryFilterComponent);
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('div'));
    div.triggerEventHandler('click', {});
    fixture.detectChanges();
    spyOn(component, 'showfilter');
  });

  it('should call resetFilter', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    component.ngOnInit();

    const fixture = TestBed.createComponent(LibraryFilterComponent);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', {});
    fixture.detectChanges();
    spyOn(component, 'resetFilter');
  });

  it('should call applyFilter', () => {
    const treeService = TestBed.get(TreeService);
    spyOn(component, 'fetchFrameWorkDetails').and.callThrough();
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    component.ngOnInit();

    const fixture = TestBed.createComponent(LibraryFilterComponent);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', {});
    fixture.detectChanges();
    spyOn(component, 'applyFilter');
  });
});
