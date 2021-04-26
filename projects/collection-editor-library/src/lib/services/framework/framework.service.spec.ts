import { TestBed } from '@angular/core/testing';
import { FrameworkService } from './framework.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('FrameworkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });
  });

  it('should be created', () => {
    const service: FrameworkService = TestBed.get(FrameworkService);
    expect(service).toBeTruthy();
  });
});