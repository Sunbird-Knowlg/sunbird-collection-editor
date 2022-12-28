import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancytreeWrapperComponent } from './fancytree-wrapper.component';

describe('FancytreeWrapperComponent', () => {
  let component: FancytreeWrapperComponent;
  let fixture: ComponentFixture<FancytreeWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancytreeWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancytreeWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
