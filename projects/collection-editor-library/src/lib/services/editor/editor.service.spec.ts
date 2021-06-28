import { TestBed } from '@angular/core/testing';
import { EditorService } from './editor.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('EditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });
  });

  it('should be created', () => {
    const service: EditorService = TestBed.get(EditorService);
    expect(service).toBeTruthy();
  });
  it('#contentsCountAddedInLibraryPage() should increase value of contentsCount', () => {
    const service: EditorService = TestBed.get(EditorService);
    service.contentsCount = 0;
    service.contentsCountAddedInLibraryPage(undefined);
    expect(service.contentsCount).toBe(1);
  });
  it('#contentsCountAddedInLibraryPage() should set value of contentsCount to zero', () => {
    const service: EditorService = TestBed.get(EditorService);
    service.contentsCount = 2;
    service.contentsCountAddedInLibraryPage(true);
    expect(service.contentsCount).toBe(0);
  });
});
