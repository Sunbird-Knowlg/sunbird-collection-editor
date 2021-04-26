import { TestBed } from '@angular/core/testing';
import { DialcodeService } from './dialcode.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('DialcodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });
  });

  it('should be created', () => {
    const service: DialcodeService = TestBed.get(DialcodeService);
    expect(service).toBeTruthy();
  });
});
