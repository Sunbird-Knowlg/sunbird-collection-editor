import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data/data.service';
import { PublicDataService } from '../../services/public-data/public-data.service';
import { ServerResponse } from '../../interfaces/serverResponse';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public http: HttpClient;
  public questionMap =  {};
  constructor(public dataService: DataService, http: HttpClient, private publicDataService: PublicDataService) {
    this.http = http;
  }

  setQuestionMap(key, value) {
    this.questionMap[key] = value;
  }

  clearQuestionMap() {
    this.questionMap = {};
  }

  readQuestion(questionId, leafFormConfigfields? ) {
    // tslint:disable-next-line:max-line-length
    let field = 'body,primaryCategory,mimeType,qType,answer,templateId,responseDeclaration,interactionTypes,interactions,name,solutions,editorState,media,';
    field = leafFormConfigfields ? field + leafFormConfigfields :  field;
    const option = {
      url: `question/v1/read/${questionId}`,
      param: {
        fields: field
      }
    };
    return this.publicDataService.get(option);
  }

  getQuestionList(questionIds: string[]) {
    const option = {
      url: 'question/v1/list',
      data: {
        request: {
          search: {
            identifier: questionIds
          }
        }
      }
    };
    return this.publicDataService.post(option).pipe(map(data => _.get(data, 'result')));
  }

  updateHierarchyQuestionCreate(hierarchyBody): Observable<ServerResponse> {
    const requestObj = {
      data: hierarchyBody
    };
    const req = {
      url: 'questionset/v1/hierarchy/update',
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
      url: 'questionset/v1/hierarchy/update',
      data: {
        request: requestObj
      }
    };
    return this.publicDataService.patch(req);
  }

  getAssetMedia(req?: object) {
    const reqParam = {
      url: 'composite/v3/search',
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
      url: 'content/v3/create',
      data: {
        request: {
          content: {
            contentType: 'Asset',
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
      url: `content/v3/upload/${assetId}`,
      data: req.data
    };
    reqParam = req ? _.merge({}, reqParam, req) : reqParam;
    return this.publicDataService.post(reqParam);
  }

  generatePreSignedUrl(req, contentId: any) {
    const reqParam = {
      url: `content/v3/upload/url/${contentId}`,
      data: {
        request: req
      }
    };
    return this.publicDataService.post(reqParam);
  }

  getVideo(videoId) {
    const reqParam = {
      url: `content/v3/read/${videoId}`
    };
    return this.publicDataService.get(reqParam);
  }

}
