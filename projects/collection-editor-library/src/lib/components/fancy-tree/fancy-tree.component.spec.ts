import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FancyTreeComponent } from './fancy-tree.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import {mockData} from './fancy-tree.component.spec.data';
import { Router } from '@angular/router';
import { TreeService } from '../../services/tree/tree.service';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { EditorService } from '../../services/editor/editor.service';
describe('FancyTreeComponent', () => {
  let component: FancyTreeComponent;
  let fixture: ComponentFixture<FancyTreeComponent>;

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService,TreeService,EditorService, { provide: Router, useClass: RouterStub }],
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
  it('should call addFromLibrary ', () => {
    const editorService: EditorService = TestBed.get(EditorService);
    spyOn(editorService, 'emitshowLibraryPageEvent').and.returnValue('showLibraryPage');
    component.addFromLibrary();
    expect(editorService.emitshowLibraryPageEvent).toHaveBeenCalledWith('showLibraryPage');
  });
  it('should call addFromLibraryButton for checking enable/disable for root level node', () => {
    component.config = mockData.config;
    component.addFromLibraryButton(0);
    expect(component.showLibraryButton).toBeFalsy;
  });
  it('should call addFromLibraryButton for checking enable/disable for level1 node', () => {
    component.config = mockData.config;
    component.addFromLibraryButton(1);
    expect(component.showLibraryButton).toBeFalsy;
  });
  it('should call addFromLibraryButton for checking enable/disable for level2 node', () => {
    component.config = mockData.config;
    component.addFromLibraryButton(2);
    expect(component.showLibraryButton).toBeTruthy;
  });
});


