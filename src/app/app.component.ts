import { Component } from '@angular/core';
import { editorConfig } from './data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sunbird-collection-editor';
  editorConfig = editorConfig;
  showEditor = true;

  editorEventListener(event) {
    this.showEditor = false;
    console.log(event);
  }
}
