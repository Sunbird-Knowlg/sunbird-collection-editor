import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QumlPlayerComponent } from './quml-player.component';

describe('QumlPlayerComponent', () => {
  let component: QumlPlayerComponent;
  let fixture: ComponentFixture<QumlPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QumlPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QumlPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
