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
  private _channelPrimaryCategories: any;
  // tslint:disable-next-line:variable-name
  private _channelData$ = new BehaviorSubject<any>(undefined);

  public treeDepth = 0;

  public readonly channelData$: Observable<any> = this._channelData$
  .asObservable().pipe(skipWhile(data => data === undefined || data === null));
  private shuffle = new BehaviorSubject<any>(false);
  shuffleValue = this.shuffle.asObservable();

  constructor(private publicDataService: PublicDataService, private configService: ConfigService, private dataService: DataService) { }

  initialize(channelId) {
    this.getLicenses().subscribe((data: any) => this._availableLicenses = _.get(data, 'license'));
    this.getChannelData(channelId).subscribe(data => {
      this._channelData = data;
      this._channelPrimaryCategories =  _.get(this._channelData, 'primaryCategories') || [];
      this._channelData$.next({ err: null, channelData: this._channelData });
    });
  }

  setShuffleValue(value) {
    this.shuffle.next(value);
  }

  public get channelInfo(): any {
    return this._channelData;
  }

  public get channelPrimaryCategories(): any {
    return this._channelPrimaryCategories;
  }

  public get contentPrimaryCategories() : any {
    const channeltargetObjectTypeGroup = _.groupBy(this.channelPrimaryCategories, 'targetObjectType');
    return _.get(channeltargetObjectTypeGroup, 'Content') || [];
  }

  public get questionPrimaryCategories() : any {
    const channeltargetObjectTypeGroup = _.groupBy(this.channelPrimaryCategories, 'targetObjectType');
    return _.get(channeltargetObjectTypeGroup, 'Question') || [];
  }

  public get collectionPrimaryCategories() : any {
    const channeltargetObjectTypeGroup = _.groupBy(this.channelPrimaryCategories, 'targetObjectType');
    return _.get(channeltargetObjectTypeGroup, 'Collection') || [];
  }

  public get questionsetPrimaryCategories() : any {
    const channeltargetObjectTypeGroup = _.groupBy(this.channelPrimaryCategories, 'targetObjectType');
    return _.get(channeltargetObjectTypeGroup, 'QuestionSet') || [];
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

  getAllUser(userSearchBody) {
    const req = {
      url:  _.get(this.configService.urlConFig, 'URLS.USER.SEARCH'),
      param: {fields: 'orgName'},
      data: {
        request: userSearchBody.request
      }
    };

    return this.publicDataService.post(req);
  }

  updateCollaborator(contentId, collaboratorList) {
    const req = {
      url: _.get(this.configService.urlConFig, 'URLS.CONTENT.UPDATE_COLLABORATOR') + contentId,
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

  addDepthToHierarchy(arr, depth = 0, index = 0) {
    if (arr && index < arr.length) {
      _.forEach(arr, child => {
        child.depth = depth;
        if (depth > this.treeDepth) { this.treeDepth = depth; }
        if (_.get(child, 'children.length')) {
          return this.addDepthToHierarchy(child.children, depth + 1, 0);
        }
        return this.addDepthToHierarchy(child, depth, index + 1);

      });
    }
    return;
  }

}
