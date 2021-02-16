import { TestBed } from '@angular/core/testing';
import { CollectionEditorLibraryService } from './collection-editor-library.service';

describe('CourseEditorLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CollectionEditorLibraryService = TestBed.get(CollectionEditorLibraryService);
    expect(service).toBeTruthy();
  });
});
