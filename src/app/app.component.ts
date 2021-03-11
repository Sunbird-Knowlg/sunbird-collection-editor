import { Component } from '@angular/core';
import { questionEditorConfig, collectionEditorConfig } from './data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sunbird-collection-editor';
  editor: any = localStorage.getItem('contentType') || 'question';
  showEditor = true;
  editorConfig: any = this.editor === 'question' ? questionEditorConfig : collectionEditorConfig;
  editorEventListener(event) {
    this.showEditor = false;
    console.log(event);
  }

  setType(contentType) {
    if (contentType === 'question') {
      localStorage.setItem('contentType', 'question');
    } else {
      localStorage.setItem('contentType', 'collection');
    }
    window.location.reload();
  }
}
