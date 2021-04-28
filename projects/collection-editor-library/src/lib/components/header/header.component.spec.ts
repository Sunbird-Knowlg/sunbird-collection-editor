import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [HeaderComponent, TelemetryInteractDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    spyOn(component, 'handleActionButtons');
    component.ngOnInit();
    expect(component.handleActionButtons).toHaveBeenCalled();
  });
  it('should call handleActionButtons', () => {
    spyOn(component, 'editorService');
    component.handleActionButtons();
    expect(component.visibility).toBeDefined();
  });
  it('should create call openRequestChangePopup', () => {
    component.openRequestChangePopup('sendForCorrections');
    expect(component.showRequestChangesPopup).toBeTruthy();
    expect(component.actionType).toBe('sendForCorrections');
  });
  it('should call buttonEmitter', () => {
    const data = { type: 'previewContent' };
    spyOn(component.toolbarEmitter, 'emit');
    spyOn(component, 'buttonEmitter').and.returnValue(data);
    component.buttonEmitter(data);
    expect(component.buttonEmitter).toHaveBeenCalledWith(data);
  });
  it('should call ngOnDestroy', () => {
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    component.ngOnDestroy();
    expect(component.modal.deny).toHaveBeenCalled();
  });
});
