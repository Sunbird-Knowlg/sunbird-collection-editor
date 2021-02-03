import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorTelemetryService } from '../../services';
import {EditorService} from '../../services/editor/editor.service'
@Component({
  selector: 'lib-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  @Input() libraryInput: any;
  @Output() libraryEmitter = new EventEmitter<any>();
  public pageId = 'library';
  public contentList: any;
  selectedContent:any;
  constructor(private telemetryService: EditorTelemetryService, private editorService: EditorService ) { }

  ngOnInit() {
    this.telemetryService.telemetryPageId = this.pageId;
    this.fetchContentList();
  }

  back() {
    this.libraryEmitter.emit({});
  }

  onFilterChange(event: any) {
    console.log('event', event);
  }
  fetchContentList() {
    const option = {
      url: 'composite/v3/search',
    data: {
      "request":{"filters":{}}
    }
    };
    this.editorService.fetchContentListDetails(option).subscribe((response: any) => {
      console.log(response, 'result')
        this.contentList = response.result.content;
        this.selectedContent = this.contentList[0];
      });
  }
  onContentChangeEvent(event: any) {
    this.selectedContent = event.content;
  }
}