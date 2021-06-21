import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCollaboratorComponent } from './manage-collaborator.component';

describe('ManageCollaboratorComponent', () => {
  let component: ManageCollaboratorComponent;
  let fixture: ComponentFixture<ManageCollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCollaboratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
