import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorTelemetryService } from '../../services';
import {EditorService} from '../../services/editor/editor.service';
import {labelMessages} from '../labels';
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
  selectedContent: any;
  showAddedContent = true;
  showLoader = true;
  public isFilterOpen = false;
  labelMessages = labelMessages;
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
    if (event.action === 'filterStatusChange') {
      this.isFilterOpen = event.filterStatus;
    }
  }
  fetchContentList() {
    const option = {
      url: 'composite/v3/search',
    data: {
      request: {filters: {}}
    }
    };
    this.editorService.fetchContentListDetails(option).subscribe((response: any) => {
      console.log(response, 'result');
      this.contentList = response.result.content;
      this.selectedContent = this.contentList[0];
      this.onSelectContent(this.selectedContent);
      this.showLoader = false;
      });
  }
  onSelectContent(content) {
    this.editorService.emitSelectedNodeMetaData({type: 'nodeSelect', metadata: content});
  }
  onContentChangeEvent(event: any) {
    this.selectedContent = event.content;
  }

  showResourceTemplate(event) {
    switch (event.action) {
      case 'showFilter':
        this.openFilter();
        break;
      default:
        break;
    }
  }

  openFilter(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.isFilterOpen = true;
  }
}
