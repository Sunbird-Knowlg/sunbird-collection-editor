import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestChecklistComponent } from './request-checklist.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorService } from '../../services/editor/editor.service';
import {mockData} from './request-checklist.component.spec.data'
describe('RequestChecklistComponent', () => {
  let component: RequestChecklistComponent;
  let fixture: ComponentFixture<RequestChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [EditorService],
      declarations: [RequestChecklistComponent, TelemetryInteractDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#ngOnInit should call ngOnInit and enable/disable button', () => {
    component.requestforchangeschecklist = {};
    component.ngOnInit();
    expect(component.isButtonEnable).toBeTruthy();
  });
  it('#ngOnInit should call ngOnInit and enable/disable button', () => {
    component.requestforchangeschecklist = mockData.requestforchangeschecklist;
    component.ngOnInit();
    expect(component.isButtonEnable).toBeFalsy();
  });
  it('#onStatusChanges should call onStatusChanges and enable/disable button', () => {
    const event = {isValid: true}
    component.onStatusChanges(event);
    expect(component.isButtonEnable).toBeTruthy();
  });
  it('#onStatusChanges should call onStatusChanges and enable/disable button', () => {
    const event = mockData.checkedData
    component.valueChanges(event);
    expect(component.checkBoxSelected).toBeDefined();
  });
  it('#handlePopUpEvents should close popup', () => {
    spyOn(component.requestEmitter, 'emit');
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    const type = 'closeModal'
    component.handlePopUpEvents(type,modal);
    expect(component.requestEmitter.emit).toHaveBeenCalledWith({ button: type });
    expect(modal.deny).toHaveBeenCalled();
  });
  it('#handlePopUpEvents should close popup with rejectContent', () => {
    spyOn(component.requestEmitter, 'emit');
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    component.requestforchangeschecklist = null;
    component.rejectComment = 'sample comment'
    component.handlePopUpEvents('rejectContent',modal);
    expect(component.requestEmitter.emit).toHaveBeenCalledWith({ button: 'rejectContent', rejectComment: component.rejectComment, rejectReasons: [] });
    expect(modal.deny).toHaveBeenCalled();
  });
  it('#handlePopUpEvents should close popup with rejectContent', () => {
    spyOn(component.requestEmitter, 'emit');
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    component.requestforchangeschecklist = mockData.requestforchangeschecklist;
    component.checkBoxSelected = mockData.checkedData;
    component.rejectComment = 'sample comment'
    component.handlePopUpEvents('rejectContent',modal);
    expect(component.requestEmitter.emit).toHaveBeenCalledWith({ button: 'rejectContent', rejectComment: component.rejectComment, rejectReasons: mockData.rejectReasons });
    expect(modal.deny).toHaveBeenCalled();
  });
});
