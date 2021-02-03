import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditorService } from '../../services';

@Component({
  selector: 'lib-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss']
})
export class LibraryListComponent implements OnInit {
@Input() contentList;
@Output() contentChangeEvent = new EventEmitter<any>();

  constructor(public editorService: EditorService) { }

  ngOnInit() {
  }
  onSelectContent(content) {
    this.editorService.emitSelectedNodeMetaData({type: 'nodeSelect', metadata: content});
  }
  onContentChange(selectedContent: any) {
    this.contentChangeEvent.emit({content: selectedContent});
  }
}
