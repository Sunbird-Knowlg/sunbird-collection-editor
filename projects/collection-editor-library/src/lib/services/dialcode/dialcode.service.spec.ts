import { TestBed } from '@angular/core/testing';

import { DialcodeService } from './dialcode.service';

describe('DialcodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialcodeService = TestBed.get(DialcodeService);
    expect(service).toBeTruthy();
  });
});
