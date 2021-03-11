import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';
import * as _ from 'lodash-es';
import { PublicDataService} from '../public-data/public-data.service';
import { DataService} from '../data/data.service';
@Injectable({
  providedIn: 'root'
})

export class HelperService {
  // tslint:disable-next-line:variable-name
  private _availableLicenses: Array<any>;
  // tslint:disable-next-line:variable-name
  private _channelData: any;
  constructor(private publicDataService: PublicDataService, private dataService: DataService) { }

  initialize(channelId, defaultLicense?: any) {
    if (defaultLicense) {
      this._availableLicenses = defaultLicense;
    } else {
      this.getLicenses().subscribe();
    }
    this.getChannelData(channelId).subscribe(data => this._channelData = data);
  }

  getLicenses(): Observable<any> {
    const req = {
      url: `composite/v3/search`,
      data: {
        request: {
          filters: {
            objectType: 'license',
            status: ['Live']
          }
        }
      }
    };
    return this.publicDataService.post(req).pipe(map((res: any) => {
      return res.result;
    }), tap((data: any) => this._availableLicenses = _.get(data, 'license')), catchError(err => {
      const errInfo = { errorMsg: 'search failed' };
      return throwError(errInfo);
    }));
  }

  getAvailableLicenses() {
    return this._availableLicenses;
  }

  getChannelData(channelId): Observable<any> {
    const channelData = sessionStorage.getItem(channelId);
    if (!channelData) {
      const channelOptions = {
        url: 'channel/v1/read/' + channelId
      };
      return this.dataService.get(channelOptions).pipe(map((data: any) => data.result.channel));
    } else {
      return of(channelData);
    }
  }

  get channelData() {
    return {
      contentPrimaryCategories: ['Course Assessment', 'eTextbook', 'Explanation Content', 'Learning Resource', 'Practice Question Set']
    };
  }

}
