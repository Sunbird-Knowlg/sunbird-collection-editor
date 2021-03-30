import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
@Component({
  selector: 'lib-library-player',
  templateUrl: './library-player.component.html',
  styleUrls: ['./library-player.component.scss']
})
export class LibraryPlayerComponent implements OnInit {
@Input() contentListDetails;
@Output() moveEvent = new EventEmitter<any>();
  constructor(public telemetryService: EditorTelemetryService, public configService: ConfigService) { }

  ngOnInit() {
  }

  addToLibrary() {
    this.moveEvent.emit({
      action: 'openHierarchyPopup'
    });
  }

}
