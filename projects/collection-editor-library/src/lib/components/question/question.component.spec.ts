import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuestionComponent } from './question.component';
import { Router } from '@angular/router';
import { QuestionService } from '../../services/question/question.service';
import { PlayerService } from '../../services/player/player.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import {mockData} from './question.component.spec.data';
describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionComponent, TelemetryInteractDirective ],
      imports: [HttpClientTestingModule, SuiModule],
      providers: [EditorTelemetryService, QuestionService, ToasterService,
         PlayerService, EditorService, { provide: Router, useClass: RouterStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call populateFormData ', () => {
    component.leafFormConfig = mockData.childMetadata;
    component.questionMetaData = mockData.questionMetaData;
    component.populateFormData();
    expect(component.questionMetaData).toBe(mockData.questionMetaData);
    expect(component.leafFormConfig).toBe(mockData.childMetadata);
  });
  it('should call previewFormData ', () => {
    component.leafFormConfig = mockData.childMetadata;
    component.previewFormData(true);
    expect(component.leafFormConfig).toEqual(mockData.childMetadata);
  });
  it('should call valueChanges', () => {
    component.valueChanges(mockData.formData);
    expect(component.childFormData).toEqual(mockData.formData);
  });
  it('should call validateFormFields', () => {
    component.leafFormConfig = mockData.childMetadata;
    component.childFormData = mockData.formData;
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.callThrough();
    component.validateFormFields();
    expect(component.showFormError).toBeFalsy();
  });
});
