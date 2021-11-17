import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BulkJobService } from './bulk-job.service';
import { APP_BASE_HREF } from '@angular/common';

describe('BulkJobService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}]
  }));

  it('should be created', () => {
    const service: BulkJobService = TestBed.get(BulkJobService);
    expect(service).toBeTruthy();
  });
});
