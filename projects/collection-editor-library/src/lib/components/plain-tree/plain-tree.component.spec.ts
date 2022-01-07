import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTreeComponent } from './plain-tree.component';

describe('PlainTreeComponent', () => {
  let component: PlainTreeComponent;
  let fixture: ComponentFixture<PlainTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlainTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
