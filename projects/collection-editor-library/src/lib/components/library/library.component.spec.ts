import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import {mockData} from './library.component.spec.data';
import { Router } from '@angular/router';
import { TreeService } from '../../services/tree/tree.service';
describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService,TreeService,  { provide: Router, useClass: RouterStub }],
      imports: [HttpClientTestingModule],
      declarations: [ LibraryComponent, TelemetryInteractDirective ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call openFilter', () => {
    component.openFilter();
    expect(component.isFilterOpen).toBeTruthy;
  });
  it('should call filterContentList and child nodes are empty', () => {
    component.childNodes = [];
    component.contentList = mockData.initialContentList;
    component.showAddedContent = false;
    component.filterContentList(false);
    expect(component.contentList).toEqual(mockData.initialContentList);
    expect(component.selectedContent).toEqual(mockData.initialContentList[0]); 
  });
  it('should call filterContentList and child nodes are not empty and show added content is disabled', () => {
    component.childNodes = ['do_11309885724445900818860'];
    component.contentList = mockData.initialContentList;
    component.showAddedContent = false;
    component.filterContentList(false);
    expect(component.contentList).toEqual(mockData.secondContentList);
    expect(component.selectedContent).toEqual(mockData.initialContentList[1]); 
  });
  it('should call filterContentList and child nodes are not empty and show added content is enabled', () => {
    component.childNodes = ['do_11309885724445900818860'];
    component.contentList = mockData.secondContentList;
    component.showAddedContent = true;
    component.filterContentList(false);
    expect(component.selectedContent).toEqual(mockData.secondContentList[0]);
  });
  it('should call onContentChangeEvent ', () => {
    component.onContentChangeEvent(mockData.selectedContent);
    expect(component.selectedContent).toEqual(mockData.selectedContent.content);
  });
});
