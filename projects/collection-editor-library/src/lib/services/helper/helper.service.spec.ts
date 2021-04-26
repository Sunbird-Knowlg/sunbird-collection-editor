import { TestBed } from '@angular/core/testing';
import { HelperService } from './helper.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

describe('HelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });
  });

  it('should be created', () => {
    const service: HelperService = TestBed.get(HelperService);
    expect(service).toBeTruthy();
  });
});
