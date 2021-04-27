import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QumlplayerPageComponent } from './qumlplayer-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { mockData } from './qumlplayer-page.component.spec.data';
describe('QumlplayerPageComponent', () => {
  let component: QumlplayerPageComponent;
  let fixture: ComponentFixture<QumlplayerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ QumlplayerPageComponent, TelemetryInteractDirective ],
      providers: [EditorTelemetryService, EditorService],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QumlplayerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnChanges', () => {
    spyOn(component, 'initQumlPlayer');
    component.ngOnChanges();
    expect(component.initQumlPlayer).toHaveBeenCalled();
  });
  it('should call initQumlPlayer', () => {
    component.showPlayerPreview = false;
    component.prevQuestionId = 'do_11326368076523929623';
    component.initQumlPlayer();
    expect(component.prevQuestionId).not.toBe(mockData.questionMetaData.identifier);
  });
  it('should call switchToPotraitMode', () => {
    component.showPotrait = false;
    component.switchToPotraitMode();
    expect(component.showPotrait).toBeTruthy();
  });
  it('should call switchToLandscapeMode', () => {
    component.showPotrait = true;
    component.switchToLandscapeMode();
    expect(component.showPotrait).toBeFalsy();
  });
  it('should call removeQuestion', () => {
    spyOn(component.toolbarEmitter, 'emit');
    component.removeQuestion();
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith({button: 'removeContent'});
  });
  it('should call editQuestion', () => {
    spyOn(component.toolbarEmitter, 'emit');
    component.editQuestion();
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith({button: 'editContent'});
  });
});
