import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorTelemetryService } from '../../services';
import { EditorService } from '../../services/editor/editor.service';
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
  constructor(private telemetryService: EditorTelemetryService, private editorService: EditorService) { }

  ngOnInit() {
    this.telemetryService.telemetryPageId = this.pageId;
    this.fetchContentList();
  }

  back() {
    this.libraryEmitter.emit({});
  }

  onFilterChange(event: any) {
    switch (event.action) {
      case 'filterDataChange':
        console.log(event.filters);
        this.fetchContentList(event.filters);
        break;
      case 'filterStatusChange':
        this.isFilterOpen = event.filterStatus;
        break;
    }
  }

  fetchContentList(filters?) {
    const option = {
      url: 'composite/v3/search',
      data: {
        request: { filters: {...filters} }
      }
    };
    this.editorService.fetchContentListDetails(option).subscribe((response: any) => {
      console.log(response, 'result');
      this.contentList = response.result.content;
      this.selectedContent = this.contentList[0];
      this.showLoader = false;
    });
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
