import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {labelMessages} from '../labels';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
@Component({
  selector: 'lib-library-player',
  templateUrl: './library-player.component.html',
  styleUrls: ['./library-player.component.scss']
})
export class LibraryPlayerComponent implements OnInit {
@Input() contentListDetails;
@Output() moveEvent = new EventEmitter<any>();
labelMessages = labelMessages;
  constructor(public telemetryService: EditorTelemetryService) { }

  ngOnInit() {
  }

  addToLibrary() {
    this.moveEvent.emit({
      action: 'openHierarchyPopup'
    });
  }

}
