import { Injectable } from '@angular/core';
import * as urlConfig from './url.config.json';
import * as categoryConfig from './category.config.json';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  urlConFig = (urlConfig as any);
  categoryConfig = (categoryConfig as any);

  constructor() { }
}
