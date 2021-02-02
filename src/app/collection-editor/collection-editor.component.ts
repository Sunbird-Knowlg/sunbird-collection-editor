import { Component, OnInit } from '@angular/core';
import { editorConfig } from '../data';

@Component({
  selector: 'app-collection-editor',
  templateUrl: './collection-editor.component.html',
  styleUrls: ['./collection-editor.component.scss']
})
export class CollectionEditorComponent implements OnInit {
  editorConfig = editorConfig;
  constructor() { }

  ngOnInit() {
  }

}
