import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { PublicDataService } from '../public-data/public-data.service';

@Injectable({
  providedIn: 'root'
})
export class DialcodeService {

  constructor(public configService: ConfigService, private publicDataService: PublicDataService) { }

  reserveDialCode(indetifier, requestCount): Observable<any> {
    const req = {
      url: this.configService.urlConFig.URLS.DIALCODE.RESERVE + indetifier,
      data: {
        request: {
          dialcodes: {
              count: requestCount,
              qrCodeSpec: {
                  errorCorrectionLevel: 'H'
              }
          }
      }
      }
    };
    return this.publicDataService.post(req);
  }

  downloadQRCode(processId): Observable<any> {
    const req = {
      url: this.configService.urlConFig.URLS.DIALCODE.PROCESS + processId,
    };
    return this.publicDataService.get(req);
  }

}
