import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data/data.service';
import { PublicDataService } from '../../services/public-data/public-data.service';
import { ServerResponse } from '../../interfaces/serverResponse';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { EditorService } from '../editor/editor.service';
@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public http: HttpClient;
  constructor(public dataService: DataService, http: HttpClient, private configService: ConfigService,
              private publicDataService: PublicDataService, private editorService: EditorService) {
    this.http = http;
  }

  readQuestion(questionId, leafFormConfigfields? ) {
    // tslint:disable-next-line:max-line-length
    let field = this.configService.editorConfig.readQuestionFields;
    field = leafFormConfigfields ? field + leafFormConfigfields :  field;
    const option = {
      url: `${this.configService.urlConFig.URLS.QUESTION.READ}${questionId}`,
      param: {
        fields: field
      }
    };
    return this.publicDataService.get(option);
  }

  upsertQuestion(questionId, questionBody) {
    let mode = questionId ? 'UPDATE' : 'CREATE';
    const req = {
      url: `${this.configService.urlConFig.URLS[this.editorService.editorConfig.config.objectType][mode]}${mode === 'UPDATE' ? questionId : ''}`,
      data: {
        request: questionBody
      }
    }
    return mode === 'UPDATE' ? this.publicDataService.patch(req)
      : this.publicDataService.post(req);
  }

  updateQuestion(questionId, requestObj) {
    const objectType = _.get(this.editorService.editorConfig, 'config.objectType');
    const req = {
      url: `${this.configService.urlConFig.URLS[objectType].SYSYTEM_UPDATE}${questionId}`,
      data: {
        request: requestObj
      }
    };
    return this.publicDataService.patch(req);
  }

  updateHierarchyQuestionCreate(hierarchyBody): Observable<ServerResponse> {
    const requestObj = {
      data: hierarchyBody
    };
    const req = {
      url: this.configService.urlConFig.URLS[this.editorService.editorConfig.config.objectType].HIERARCHY_UPDATE,
      data: {
        request: requestObj
      }
    };
    return this.publicDataService.patch(req);
  }

  updateHierarchyQuestionUpdate(hierarchyBody): Observable<ServerResponse> {
    const requestObj = {
      data: hierarchyBody
    };
    const req = {
      url: this.configService.urlConFig.URLS[this.editorService.editorConfig.config.objectType].HIERARCHY_UPDATE,
      data: {
        request: requestObj
      }
    };
    return this.publicDataService.patch(req);
  }

  getAssetMedia(req?: object) {
    const reqParam = {
      url: _.get(this.configService.urlConFig, 'URLS.compositSearch'),
      data: {
        request: {
          filters: {
            contentType: 'Asset',
            compatibilityLevel: {
              min: 1,
              max: 2
            },
            status: ['Live'],
          },
          limit: 50,
        }
      }
    };
    reqParam.data.request = req ? _.merge({}, reqParam.data.request, req) : reqParam;
    return this.publicDataService.post(reqParam);
  }

  createMediaAsset(req?: object) {
    const reqParam = {
      url: _.get(this.configService.urlConFig, 'URLS.ASSET.CREATE'),
      data: {
        request: {
          asset: {
            primaryCategory: 'asset',
            language: ['English'],
            code: UUID.UUID(),
          }
        }
      }
    };
    reqParam.data.request = req ? _.merge({}, reqParam.data.request, req) : reqParam;
    return this.publicDataService.post(reqParam);
  }

  uploadMedia(req, assetId: any) {
    let reqParam = {
      url: `${this.configService.urlConFig.URLS.ASSET.UPLOAD}${assetId}`,
      data: req.data
    };
    reqParam = req ? _.merge({}, reqParam, req) : reqParam;
    return this.publicDataService.post(reqParam);
  }

  generatePreSignedUrl(req, contentId: any) {
    const reqParam = {
      url: `${this.configService.urlConFig.URLS.CONTENT.UPLOAD_URL}${contentId}`,
      data: {
        request: req
      }
    };
    return this.publicDataService.post(reqParam);
  }

  getVideo(videoId) {
    const reqParam = {
      url: `${this.configService.urlConFig.URLS.ASSET.READ}${videoId}`
    };
    return this.publicDataService.get(reqParam);
  }

  getQuestionList(req, field?: any) {
    const param = {
      fields: field ? field : ''
    };
    const reqParam = {
      url: this.configService.urlConFig.URLS.QuestionSet.QUESTION_LIST,
      param: { ...param },
      data: {
        request: {
          search: {
            identifier: req
          }
        }
      }
    };
    return this.publicDataService.post(reqParam);
  }

}
