import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceReorderComponent } from './resource-reorder.component';

describe('ResourceReorderComponent', () => {
  let component: ResourceReorderComponent;
  let fixture: ComponentFixture<ResourceReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
