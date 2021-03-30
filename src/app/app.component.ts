import { Component } from '@angular/core';
import { questionEditorConfig, collectionEditorConfig } from './data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sunbird-collection-editor';
  editor: any = localStorage.getItem('editorType') || '';
  editorConfig: any = this.editor === 'question' ? questionEditorConfig : collectionEditorConfig;

  editorEventListener(event) {
    this.editor = undefined;
    localStorage.removeItem('editorType');
    console.log(event);
  }

  setType(editorType) {
    if (editorType === 'question') {
      localStorage.setItem('editorType', 'question');
    } else {
      localStorage.setItem('editorType', 'collection');
    }
    window.location.reload();
  }
}
