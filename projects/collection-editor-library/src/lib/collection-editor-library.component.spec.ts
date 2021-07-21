import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionEditorLibraryComponent } from './collection-editor-library.component';

describe('CollectionEditorLibraryComponent', () => {
  let component: CollectionEditorLibraryComponent;
  let fixture: ComponentFixture<CollectionEditorLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionEditorLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionEditorLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
