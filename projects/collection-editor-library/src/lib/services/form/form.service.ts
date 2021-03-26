
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CacheService } from 'ng2-cache-service';
import * as _ from 'lodash-es';
import { Observable, of } from 'rxjs';
import { ServerResponse } from '../../interfaces/serverResponse';
import { PublicDataService } from './../public-data/public-data.service';
import { ConfigService } from '../../services/config/config.service';

@Injectable({
  providedIn: 'root'
})

export class FormService {
  public publicDataService: PublicDataService;
  constructor(publicDataService: PublicDataService, private cacheService: CacheService, private configService: ConfigService) {
    this.publicDataService = publicDataService;
  }

  getFormConfig(formInputParams): Observable<any> {
    const channelOptions: any = {
      url: this.configService.urlConFig.URLS.dataDrivenForms.READ,
      data: {
        request: {
          type: formInputParams.formType,
          action: formInputParams.formAction,
          subType: formInputParams.contentType,
          rootOrgId: formInputParams.rootOrgId, // TODO check this
        }
      }
    };
    const formKey = `${channelOptions.data.request.type}${channelOptions.data.request.action}
    ${channelOptions.data.request.subType}${channelOptions.data.request.rootOrgId}${formInputParams.framework}`;
    const key = btoa(formKey);
    if (this.cacheService.get(key)) {
      const data = this.cacheService.get(key);
      return of(data);
    } else {
      if (formInputParams.framework) {
        channelOptions.data.request.framework = formInputParams.framework;
      }
      return this.publicDataService.post(channelOptions).pipe(map(
        (formConfig: ServerResponse) => {
          this.setForm(formKey, formConfig.result.form.data.fields);
          return formConfig.result.form.data.fields;
        }));
    }
  }

  setForm(formKey, formData) {
     const key = btoa(formKey);
     this.cacheService.set(key, formData, {maxAge: 600}); // TODO check this
  }
}
