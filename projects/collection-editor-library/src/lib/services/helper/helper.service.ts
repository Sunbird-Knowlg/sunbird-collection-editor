import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, skipWhile, tap} from 'rxjs/operators';
import * as _ from 'lodash-es';
import { PublicDataService} from '../public-data/public-data.service';
import { DataService} from '../data/data.service';
import { ConfigService } from '../config/config.service';
@Injectable({
  providedIn: 'root'
})

export class HelperService {
  // tslint:disable-next-line:variable-name
  private _availableLicenses: Array<any>;
  // tslint:disable-next-line:variable-name
  private _channelData: any;
  // tslint:disable-next-line:variable-name
  private _channelData$ = new BehaviorSubject<any>(undefined);

  public readonly channelData$: Observable<any> = this._channelData$
  .asObservable().pipe(skipWhile(data => data === undefined || data === null));

  constructor(private publicDataService: PublicDataService, private configService: ConfigService, private dataService: DataService) { }

  initialize(channelId) {
    this.getLicenses().subscribe((data: any) => this._availableLicenses = _.get(data, 'license'));
    this.getChannelData(channelId).subscribe(data => {
      this._channelData = data;
      this._channelData$.next({ err: null, channelData: this._channelData });
    });
  }

  public get channelInfo(): any {
    return this._channelData;
  }

  public get contentPrimaryCategories() : any {
    return _.get(this.channelInfo, 'contentPrimaryCategories') || [] ;
  }

  getLicenses(): Observable<any> {
    const req = {
      url: `${this.configService.urlConFig.URLS.compositSearch}`,
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
    }), catchError(err => {
      const errInfo = { errorMsg: _.get(this.configService, 'labelConfig.messages.error.030') };
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
        url: _.get(this.configService.urlConFig, 'URLS.channelRead') + channelId
      };
      return this.dataService.get(channelOptions).pipe(map((data: any) => data.result.channel));
    } else {
      return of(channelData);
    }
  }

  get channelData() {
    return {
      contentPrimaryCategories: this.configService.editorConfig.contentPrimaryCategories
    };
  }

  hmsToSeconds(str) {
    const p = str.split(':');
    let s = 0; let m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return _.toString(s);
  }

  getTimerFormat(field) {
    const validationObj = _.find(_.get(field, 'validations'), {type: 'time'});
    if (!_.isEmpty(validationObj)) {
      return validationObj.value;
    } else {
      return 'HH:mm:ss';
    }
  }

  getAllUsers(rootOrgIds, userIds?) {
    const req = {
      url: `user/v1/search?fields=orgName`,
      data: {
        request: {
          query: '',
          filters: {
              'organisations.roles': [
                  'CONTENT_CREATOR' //CONTENT_CREATOR
              ],
              rootOrgId: rootOrgIds,
          },
          fields: [
              'email',
              'firstName',
              'identifier',
              'lastName',
              'organisations',
              'rootOrgName',
              'phone'
          ],
          offset: 0,
          limit: 200
        }
      }
    };

    if (userIds) {
      // tslint:disable-next-line:no-string-literal
      req.data.request.filters['userId'] = userIds;
    }

    return this.publicDataService.post(req);
  }

  updateCollaborator(contentId, collaboratorList) {
    const req = {
      url: `content/v1/collaborator/update/` + contentId,
      data: {
          request: {
              content: {
                  collaborators: collaboratorList
              }
          }
      }
    };
    return this.publicDataService.patch(req);
  }
}
