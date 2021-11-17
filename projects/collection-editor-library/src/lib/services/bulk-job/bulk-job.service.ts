import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data/data.service';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class BulkJobService {

  constructor(private dataService: DataService, public configService: ConfigService) { }

  getBulkOperationStatus(reqData): Observable<any> {
    const req = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.SEARCH}`,
      data: {
        request: reqData
      }
    };
    return this.dataService.post(req);
  }

  searchContentWithProcessId(processId) {
    const reqData = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.STATUS}`,
      data: {
        request: {
          processId
        }
      }
    };
    return this.dataService.post(reqData);
  }

  createBulkJob(reqData): Observable<any> {
    const req = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.CREATE}`,
      data: {
        request: reqData
      }
    };
    return this.dataService.post(req);
  }

  updateBulkJob(reqData): Observable<any> {
    const req = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.UPDATE}`,
      data: {
        request: reqData
      }
    };
    return this.dataService.patch(req);
  }

  createBulkImport(reqData, headers): Observable<any> {
    const req = {
      url: `${this.configService.urlConFig.URLS.BULKJOB.UPLOAD}`,
      data: {
        request: reqData
      },
      header: headers
    };
    return this.dataService.post(req);
  }
}
