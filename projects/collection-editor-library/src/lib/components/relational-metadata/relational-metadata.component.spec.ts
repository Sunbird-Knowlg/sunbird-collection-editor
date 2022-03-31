import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as _ from 'lodash-es';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RelationalMetadataComponent } from './relational-metadata.component';
import { mockData } from './relational-metadata.component.spec.data';
import { EditorService } from '../../services/editor/editor.service';
import { TreeService } from '../../services/tree/tree.service';

describe('RelationalMetadataComponent', () => {
  let component: RelationalMetadataComponent;
  let fixture: ComponentFixture<RelationalMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RelationalMetadataComponent ],
      providers: [EditorService, TreeService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationalMetadataComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #attachDefaultValues() when #contentId is not the same', () => {
   spyOn(component, 'attachDefaultValues').and.callThrough();
   component.contentMetadata = {
    identifier: 'do_456'
   };
   component.contentId = 'do_123';
   component.ngOnChanges();
   expect(component.attachDefaultValues).toHaveBeenCalled();
  });

  it('should not call #attachDefaultValues() when #contentId is the same', () => {
    spyOn(component, 'attachDefaultValues').and.callThrough();
    component.contentMetadata = {
     identifier: 'do_123'
    };
    component.contentId = 'do_123';
    component.ngOnChanges();
    expect(component.attachDefaultValues).not.toHaveBeenCalled();
   });

  it('should set #formFieldProperties when relationalMetdata form is set', () => {
    spyOn(component, 'ifFieldIsEditable').and.callThrough();
    component.contentMetadata = mockData.contentMetadata;
    component.formConfig = mockData.relationalMetadataConfig;
    component.attachDefaultValues();
    expect(component.formFieldProperties).toBeDefined();
    expect(component.ifFieldIsEditable).toHaveBeenCalled();
   });

  it('should not set #formFieldProperties when relationalMetdata form is empty', () => {
    spyOn(component, 'ifFieldIsEditable').and.callThrough();
    component.contentMetadata = mockData.contentMetadata;
    component.formConfig = [];
    component.attachDefaultValues();
    expect(component.formFieldProperties).toBeDefined();
    expect(component.ifFieldIsEditable).not.toHaveBeenCalled();
   });

  it('#isReviewMode() should return #false when #editorMode is "edit" ', () => {
    const result = component.isReviewMode();
    expect(result).toBeFalsy();
   });

  it('#ifFieldIsEditable() should return #true', () => {
    const result = component.ifFieldIsEditable('relName');
    expect(result).toBeTruthy();
   });

  it('#ifFieldIsEditable() should return #false when editorMode is "review"', () => {
    const editorService = TestBed.inject(EditorService);
    editorService.initialize(mockData.editorConfig);
    const result = component.ifFieldIsEditable('relName');
    expect(result).toBeFalsy();
   });

  it('#onFormStatusChange() should emit the form status', () => {
    spyOn(component.statusChanges, 'emit');
    const testStatus = {valid: true};
    component.onFormStatusChange(testStatus);
    expect(component.statusChanges.emit).toHaveBeenCalledWith(testStatus);
  });

  it('#onFormValueChange() should emit the form values', () => {
    spyOn(component.valueChanges, 'emit');
    const testData = {name: 'Test Book'};
    const treeService = TestBed.inject(TreeService);
    spyOn(treeService, 'getActiveNode').and.callFake(() => {
      return { data: { metadata: { relationalMetadata: { name: 'Test' }} } };
    });
    component.onFormValueChange(testData);
    expect(component.valueChanges.emit).toHaveBeenCalledWith(testData);
  });

});
