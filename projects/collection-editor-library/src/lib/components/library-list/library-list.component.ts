import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import {labelMessages} from '../labels';
import { EditorService } from '../../services/editor/editor.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';

@Component({
  selector: 'lib-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LibraryListComponent implements OnInit {
@Input() contentList;
@Input() showAddedContent: any;
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
