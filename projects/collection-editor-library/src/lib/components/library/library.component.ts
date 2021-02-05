import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorTelemetryService } from '../../services';
import * as _ from 'lodash-es';
import {EditorService} from '../../services/editor/editor.service';
@Component({
  selector: 'lib-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  @Input() libraryInput: any;
  @Input() collectionData: any;
  @Output() libraryEmitter = new EventEmitter<any>();
  public pageId = 'library';
  public contentList: any;
  selectedContent: any;
  public childNodes: any;
  showAddedContent = false;
  showLoader = true;
  isFilterOpen = false;
  showSelectResourceModal = false;
  public selectedContentDetails: string;
  collectionUnits: any;
  constructor(private telemetryService: EditorTelemetryService, private editorService: EditorService ) { }

  ngOnInit() {
    this.telemetryService.telemetryPageId = this.pageId;
    this.fetchContentList();
    this.collectionUnits = _.get(this.collectionData, 'children');

    console.log('this.collectionUnits', this.collectionUnits);
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
      // this.filterContentList();
      this.showLoader = false;
      });
  }

  // filterContentList(selectedContentId?) {
  //   if (_.isEmpty(this.contentList)) { return; }
  //   _.forEach(this.contentList, (value, key) => {
  //     value.isAdded = _.includes(this.childNodes, value.identifier);
  //   });
  //   if (selectedContentId) {
  //     this.selectedContentDetails = _.pick(
  //       _.find(this.contentList, { identifier: selectedContentId }), ['name', 'identifier', 'isAdded']
  //     );
  //   } else {
  //     const selectedContentIndex = this.showAddedContent ? 0 : _.findIndex(this.contentList, { isAdded: false });
  //     this.selectedContentDetails = _.pick(this.contentList[selectedContentIndex], ['name', 'identifier', 'isAdded']);
  //   }
  // }

  onContentChangeEvent(event: any) {
    this.selectedContent = event.content;
  }

  showResourceTemplate(event) {
    switch (event.action) {
      case 'showFilter':
        this.openFilter();
        break;
      case 'beforeMove':
        this.showSelectResourceModal = true;
        break;
      case 'cancelMove':
        this.showSelectResourceModal = false;
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
