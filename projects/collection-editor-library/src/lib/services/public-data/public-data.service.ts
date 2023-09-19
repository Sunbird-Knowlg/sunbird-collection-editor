import { DataService } from './../data/data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicDataService extends DataService {

  /**
   * base Url for public api
   */
  baseUrl: string;
  _document: Document;

  public http: HttpClient;
  constructor(http: HttpClient) {
    super(http);
    this._document = document as Document
    const url = (this._document.defaultView as any).questionEditorBaseUrl;
    this.baseUrl = url? url + '/action/': 'action/';
  }
}
