import { Component } from '@angular/core';
import { questionSetEditorConfig, collectionEditorConfig, courseEditorConfig, questionEditorConfig } from './data';

const configMapper = {
  questionSet: questionSetEditorConfig,
  question: questionEditorConfig,
  collection : collectionEditorConfig,
  course: courseEditorConfig
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sunbird Collection Editor';
  editor: any = localStorage.getItem('editorType') || '';
  public editorConfig: any = configMapper[this.editor];

  editorEventListener(event) {
    this.editor = undefined;
    localStorage.removeItem('editorType');
    console.log(event);
  }

  setType(editorType) {
    if (editorType === 'questionSet') {
      localStorage.setItem('editorType', 'questionSet');
    } else if (editorType === 'course') {
      localStorage.setItem('editorType', 'course');
    }  else if (editorType === 'collection') {
      localStorage.setItem('editorType', 'collection');
    }
      else if(editorType === 'question') {
        localStorage.setItem('editorType', 'question');
      }
    window.location.reload();
  }
}
