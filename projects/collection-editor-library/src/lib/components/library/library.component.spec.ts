import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { LibraryComponent } from './library.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { RouterTestingModule } from '@angular/router/testing';
import * as mockData from './library.component.spec.data';
import { TreeService } from '../../services/tree/tree.service';
import { EditorService } from '../../services/editor/editor.service';
const testData = mockData.mockData;

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [EditorTelemetryService, TreeService, EditorService],
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

  it('#fetchCollectionHierarchy should call after ngOnInit', fakeAsync(() => {
    const treeService = TestBed.get(TreeService);
    const editorService = TestBed.get(EditorService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { getLevel: () => 2 };
    });
    spyOn(editorService, 'fetchCollectionHierarchy').and.callThrough();
    component.ngOnInit();
    expect(editorService.fetchCollectionHierarchy).toHaveBeenCalled();
  }));

  it('#generateNodeMeta() should return expected result', fakeAsync(() => {
    const generatedNodeData = component.generateNodeMeta(testData.nodeData);
    expect(generatedNodeData).toEqual(testData.generatedNodeData);
  }));

  it('#getUnitWithChildren() should return expected result', fakeAsync(() => {
    const collectionHierarchy = component.getUnitWithChildren(testData.collectionHierarchyData, testData.collectionId);
    expect(collectionHierarchy).toEqual(testData.collectionHierarchy);
  }));

});
