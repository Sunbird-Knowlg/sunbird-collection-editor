import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QumlplayerPageComponent } from './qumlplayer-page.component';

describe('QumlplayerPageComponent', () => {
  let component: QumlplayerPageComponent;
  let fixture: ComponentFixture<QumlplayerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QumlplayerPageComponent ]
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
