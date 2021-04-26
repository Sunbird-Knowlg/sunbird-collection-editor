import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QumlplayerPageComponent } from './qumlplayer-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('QumlplayerPageComponent', () => {
  let component: QumlplayerPageComponent;
  let fixture: ComponentFixture<QumlplayerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ QumlplayerPageComponent, TelemetryInteractDirective ],
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
});
