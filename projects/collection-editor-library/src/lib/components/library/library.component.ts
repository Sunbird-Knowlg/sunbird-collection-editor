import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorTelemetryService } from '../../services';

@Component({
  selector: 'lib-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  @Input() libraryInput: any;
  @Output() libraryEmitter = new EventEmitter<any>();
  public pageId = 'library';
  constructor(private telemetryService: EditorTelemetryService) { }

  ngOnInit() {
    this.telemetryService.telemetryPageId = this.pageId;
  }

  back() {
    this.libraryEmitter.emit({});
  }

  onFilterChange(event: any) {
    console.log('event', event);
  }

}
