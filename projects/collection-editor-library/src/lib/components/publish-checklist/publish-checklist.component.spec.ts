import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishChecklistComponent } from './publish-checklist.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorService } from '../../services/editor/editor.service';
import {mockData} from './publish-checklist.component.spec.data';
describe('PublishChecklistComponent', () => {
  let component: PublishChecklistComponent;
  let fixture: ComponentFixture<PublishChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [EditorService],
      declarations: [PublishChecklistComponent, TelemetryInteractDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('#ngOnInit should call ngOnInit and enable/disable button', () => {
    component.publishchecklist = {};
    component.ngOnInit();
    expect(component.isButtonEnable).toBeTruthy();
  });
  it('#ngOnInit should call ngOnInit and enable/disable button', () => {
    component.publishchecklist = mockData.publishchecklist;
    component.ngOnInit();
    expect(component.isButtonEnable).toBeFalsy();
  });
  it('#handlePopUpEvents should close popup', () => {
    spyOn(component.publishEmitter, 'emit');
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    const type = 'closeModal'
    component.isClosable = true;
    component.handlePopUpEvents(type,modal);
    expect(component.publishEmitter.emit).toHaveBeenCalledWith({ button: type });
    expect(modal.deny).toHaveBeenCalled();
  });
  it('#handlePopUpEvents should close popup with publishContent', () => {
    spyOn(component.publishEmitter, 'emit');
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    component.publishchecklist = {};
    component.isClosable = true;
    component.actionType = 'publishContent';
    component.handlePopUpEvents('submit',modal);
    expect(component.publishEmitter.emit).toHaveBeenCalledWith({ button: 'publishContent',});
    expect(modal.deny).toHaveBeenCalled();
  });
  it('#handlePopUpEvents should close popup with publishContent when publishchecklist is configured', () => {
    spyOn(component.publishEmitter, 'emit');
    const modal = {
      deny: jasmine.createSpy('deny')
    };
    component.actionType = 'publishContent';
    component.isClosable = true;
    component.publishchecklist = mockData.publishchecklist;
    component.fieldsAvailable = mockData.checkedData;
    component.handlePopUpEvents('submit',modal);
    expect(component.publishEmitter.emit).toHaveBeenCalledWith({ button: 'publishContent', publishData: {publishChecklist:mockData.listData }});
    expect(modal.deny).toHaveBeenCalled();
  });
  it('#onStatusChanges should call onStatusChanges and enable/disable button', () => {
    const event = {isValid: true}
    component.onStatusChanges(event);
    expect(component.isButtonEnable).toBeTruthy();
  });
  it('#onStatusChanges should call onStatusChanges and enable/disable button', () => {
    const event = mockData.checkedData
    component.valueChanges(event);
    expect(component.fieldsAvailable).toBeDefined();
  });
});