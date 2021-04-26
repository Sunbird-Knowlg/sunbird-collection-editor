import { TestBed } from '@angular/core/testing';
import { TreeService } from './tree.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('TreeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });
  });

  it('should be created', () => {
    const service: TreeService = TestBed.get(TreeService);
    expect(service).toBeTruthy();
  });
});
