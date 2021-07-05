import { TestBed } from '@angular/core/testing';
import { HelperService } from './helper.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PublicDataService} from '../public-data/public-data.service';
import { of, throwError } from 'rxjs';
describe('HelperService', () => {
  let helperService;
  let publicDataService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpClient]
    });
    helperService = TestBed.inject(HelperService);
    publicDataService = TestBed.inject(PublicDataService);
  });

  it('should be created', () => {
    const service: HelperService = TestBed.inject(HelperService);
    expect(service).toBeTruthy();
  });

  it('#getAllUser() should call publicDataService.post()', () => {
    const userSearchBody = {
      request: {
        filters: {
            'organisations.roles': 'CONTENT_CREATOR',
            rootOrgId: '12345'
        }
      }
    };
    spyOn(publicDataService, 'post').and.returnValue(of({}));
    spyOn(helperService, 'getAllUser').and.callThrough();
    helperService.getAllUser(userSearchBody);
    expect(publicDataService.post).toHaveBeenCalled();
  });

  it('#updateCollaborator() should call publicDataService.patch()', () => {
    spyOn(publicDataService, 'patch').and.returnValue(of({}));
    spyOn(helperService, 'updateCollaborator').and.callThrough();
    helperService.updateCollaborator('do_12345', ['12345']);
    expect(publicDataService.patch).toHaveBeenCalled();
  });
});
