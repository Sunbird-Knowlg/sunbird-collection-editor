import { Component, OnInit } from '@angular/core';
import { courseEditorConfig } from './data';
import { HttpClient } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

const configMapper = {
  course: courseEditorConfig
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sunbird Collection Editor';
  editor: any;
  public editorConfig;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const editorType = localStorage.getItem('editorType');
    const identifier = localStorage.getItem('identifier');
    if(editorType && identifier) {
      this.setType(editorType, identifier);
    } else if(editorType) {
      this.setType(editorType);
    }
  }

  editorEventListener(event) {
    this.editorConfig = undefined;
    localStorage.removeItem('editorType');
    localStorage.removeItem('identifier');
    console.log(event);
  }

  setType(editorType, identifier?) {

    let editorConfig: any = configMapper[editorType];
    localStorage.setItem('editorType', editorType);
    if(editorConfig?.context?.identifier) {
      this.editorConfig = editorConfig;
      // window.location.reload();
    } else if( editorType && identifier) {
      editorConfig.context.identifier = identifier;
      this.editorConfig = editorConfig;
    } else {
      this.createContent().subscribe((data) => {
        editorConfig.context.identifier = data.result.identifier;
        localStorage.setItem('identifier', data.result.identifier);
        this.editorConfig = editorConfig;
      });
    }

    // if (editorType === 'questionSet') {
    //   localStorage.setItem('editorType', 'questionSet');
    // } else if (editorType === 'course') {
    //   localStorage.setItem('editorType', 'course');
    // } else if (editorType === 'collection') {
    //   localStorage.setItem('editorType', 'collection');
    // } else if (editorType === 'observation') {
    //   localStorage.setItem('editorType', 'observation');
    // } else if (editorType === 'survey') {
    //   localStorage.setItem('editorType', 'survey');
    // } else if (editorType === 'rubrics') {
    //   localStorage.setItem('editorType', 'rubrics');
    // }
    // window.location.reload();
  }


  createContent() {
    const httpOptions = {
      headers: { 'Content-Type': 'application/json' }
    };
    const requestParam = {
      url: '/api/content/v2/create',
      data: {
        "request": {
            "content": {
                "code": "sunbird",
                "name": "Untitled Course",
                "description": "Enter description for Course",
                "createdBy": "2cdbb99b-1dfd-48e1-b282-a7e8b37102fe",
                "organisation": [
                    "Sunbird Bootcamp march 2023"
                ],
                "createdFor": [
                    "01374279726315929680"
                ],
                "mimeType": "application/vnd.ekstep.content-collection",
                "resourceType": "Course",
                "creator": "bccreator_table1_mar2023 bccreator_table1_lname",
                "targetFWIds": [
                    "ekstep_ncert_k-12"
                ],
                "primaryCategory": "Course"
            }
        }
    }
    };
    return this.http.post(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: any) => {
        if (data.responseCode !== 'OK') {
          return throwError(data);
        }
        return of(data);
      }));
  }

}
