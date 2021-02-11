import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditorService } from '../../services';
import { EditorTelemetryService } from '../../services';
import {labelMessages} from '../labels';
@Component({
  selector: 'lib-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss']
})
export class LibraryListComponent implements OnInit {
@Input() contentList;
@Input() showAddedContent: Boolean;
@Output() contentChangeEvent = new EventEmitter<any>();
@Output() moveEvent = new EventEmitter<any>();
@Input() selectedContent: any;
labelMessages = labelMessages;
  constructor(public editorService: EditorService, public telemetryService: EditorTelemetryService ) { }

  ngOnInit() {
  }

  onContentChange(selectedContent: any) {
    this.contentChangeEvent.emit({content: selectedContent});
  }

  changeFilter() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.moveEvent.emit({
      action: 'showFilter'
    });
  }

  onShowAddedContentChange() {
   this.moveEvent.emit({
    action: 'showAddedContent',
    status: this.showAddedContent
  });
  }

  addToLibrary() {
    this.moveEvent.emit({
      action: 'openHierarchyPopup'
    });
  }

}
