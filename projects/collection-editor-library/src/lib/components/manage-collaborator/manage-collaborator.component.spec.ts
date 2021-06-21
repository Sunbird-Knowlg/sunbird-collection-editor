import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageCollaboratorComponent } from './manage-collaborator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('ManageCollaboratorComponent', () => {
  let component: ManageCollaboratorComponent;
  let fixture: ComponentFixture<ManageCollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ ManageCollaboratorComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCollaboratorComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
