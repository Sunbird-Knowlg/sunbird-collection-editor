import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';
import * as _ from 'lodash-es';
import { PublicDataService, DataService, EditorService } from '../index';
import { PLAYER_CONFIG } from '../../editor.config';
interface PlayerConfig {
  config: any;
  context: any;
  data: any;
  metadata: any;
}
@Injectable({
  providedIn: 'root'
})

export class HelperService {
  private _availableLicenses: Array<any>;
  private _channelData: any;
  constructor(private publicDataService: PublicDataService, private dataService: DataService, private editorService: EditorService) { }

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
    // return this._channelData;
    // tslint:disable-next-line:max-line-length
    return {contentPrimaryCategories: ['Course Assessment', 'eTextbook', 'Explanation Content', 'Learning Resource', 'Practice Question Set']};
  }
  public uniqueId(length = 32) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

  public getTimeSpentText(pdfPlayerStartTime) {
      const duration = new Date().getTime() - pdfPlayerStartTime;
      const minutes = Math.floor(duration / 60000);
      const seconds = Number(((duration % 60000) / 1000).toFixed(0));
      return (minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
  }

  /**
   * returns player config details.
   */
  getPlayerConfig(contentDetails): PlayerConfig {
    const configuration: any = _.cloneDeep(_.get(PLAYER_CONFIG, 'playerConfig'));
    configuration.context.contentId = contentDetails.contentId;
    configuration.context.sid = _.get(this.editorService.editorConfig, 'context.sid');
    configuration.context.uid = _.get(this.editorService.editorConfig, 'context.uid');
    configuration.context.timeDiff = _.get(this.editorService.editorConfig, 'context.timeDiff');
    configuration.context.contextRollup = _.get(this.editorService.editorConfig, 'context.contextRollup');
    // this.getRollUpData(this.userService.userProfile.hashTagIds);
    configuration.context.channel = _.get(this.editorService.editorConfig, 'context.channel');
    // const deviceId = (<HTMLInputElement asdocument.getElementById('deviceId'));
    configuration.context.did = _.get(this.editorService.editorConfig, 'context.did');
    // const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    // configuration.context.pdata.ver = buildNumber && buildNumber.value ?
    // buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    configuration.context.pdata.ver = 1.0;
    if (_.isUndefined(contentDetails.courseId)) {
      configuration.context.dims = '';
      // this.userService.dims;
    } else {
      const cloneDims = [];
        // _.cloneDeep(this.userService.dims) || [];
      cloneDims.push(contentDetails.courseId);
      if (contentDetails.batchId) {
        cloneDims.push(contentDetails.batchId);
      }
      configuration.context.dims = cloneDims;
    }
    const tags = [];
    _.forEach(_.get(this.editorService.editorConfig, 'user'), (org) => {
      if (org.hashTagId) {
        tags.push(org.hashTagId);
      }
    });
    configuration.context.tags = tags;
    configuration.context.app = [_.get(this.editorService.editorConfig, 'context.channel')];
    if (contentDetails.courseId) {
      configuration.context.cdata = [{
        id: contentDetails.courseId,
        type: 'course'
      }];
      if (contentDetails.batchId) {
        configuration.context.cdata.push({ type: 'batch',
        id: contentDetails.batchId} );
      }
    }
    configuration.context.pdata.id = _.get(this.editorService.editorConfig, 'context.pdata.id');
    configuration.metadata = contentDetails.contentData;
    configuration.data = contentDetails.contentData.mimeType !== PLAYER_CONFIG.MIME_TYPE.ecmlContent ?
      {} : contentDetails.contentData.body;
    configuration.config.enableTelemetryValidation = false,
    // environment.enableTelemetryValidation; // telemetry validation
    configuration.config.previewCdnUrl = undefined;
    // this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
    //  ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
    return configuration;
  }

  getRollUpData(data: Array<string> = []) {
    const rollUp = {};
    data.forEach((element, index) => rollUp['l' + (index + 1)] = element);
    return rollUp;
  }
}
