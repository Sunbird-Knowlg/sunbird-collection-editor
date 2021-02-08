import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorTelemetryService } from '../../services';
import {EditorService} from '../../services/editor/editor.service';
import {labelMessages} from '../labels';
import * as _ from 'lodash-es';
@Component({
  selector: 'lib-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  @Input() libraryInput: any;
  @Output() libraryEmitter = new EventEmitter<any>();
  @Input() collectionData: any;
  public pageId = 'library';
  public contentList: any;
  selectedContent: any;
  public showAddedContent: Boolean = false;
  showLoader = true;
  public isFilterOpen = false;
  labelMessages = labelMessages;
  public childNodes: any;
  constructor(private telemetryService: EditorTelemetryService, private editorService: EditorService ) { }

  ngOnInit() {
    this.telemetryService.telemetryPageId = this.pageId;
    this.childNodes = _.get(this.collectionData, 'childNodes');
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
      this.contentList = response.result.content;
      this.filterContentList();
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
        case 'showAddedContent':
        this.showAddedContent = event.status;
          this.filterContentList();
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
  filterContentList() {
      if (_.isEmpty(this.contentList)) { return; }
      _.forEach(this.contentList, (value, key) => {
        value.isAdded = _.includes(this.childNodes, value.identifier);
      });

      const selectedContentIndex = this.showAddedContent ? 0 : _.findIndex(this.contentList, { 'isAdded': false });
      this.selectedContent = this.contentList[selectedContentIndex];
    }
  }
