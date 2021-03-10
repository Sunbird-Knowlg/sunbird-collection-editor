import { Component } from '@angular/core';
import { questionEditorConfig, collectionEditorConfig } from './data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sunbird-collection-editor';
  editor: any = 'collection';
  showEditor = true;
  editorConfig: any = collectionEditorConfig;
  editorEventListener(event) {
    this.showEditor = false;
    console.log(event);
  }

  setType(contentType) {
    if (contentType === 'question') {
      this.editorConfig = questionEditorConfig;
    } else {
      this.editorConfig = collectionEditorConfig;
    }
    this.editor = contentType;
  }
}
