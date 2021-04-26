import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialcodeComponent } from './dialcode.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DialcodeComponent', () => {
  let component: DialcodeComponent;
  let fixture: ComponentFixture<DialcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
      declarations: [ DialcodeComponent, TelemetryInteractDirective ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
