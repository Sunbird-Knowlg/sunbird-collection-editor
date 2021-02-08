import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditorTelemetryService } from '../../services';
import * as _ from 'lodash-es';
import {EditorService} from '../../services/editor/editor.service';
import {labelMessages} from '../labels';
@Component({
  selector: 'lib-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  labelMessages = labelMessages;
  @Input() libraryInput: any;
  @Input() collectionData: any;
  @Output() libraryEmitter = new EventEmitter<any>();
  public pageId = 'library';
  public contentList: any;
  public selectedContent: any;
  public childNodes: any;
  showSelectResourceModal = false;
  collectionUnits: any;
  collectionHierarchy = [];
  collectionId: string;
  public showAddedContent = false;
  public showLoader = true;
  public isFilterOpen = false;
  collectionhierarcyData: any;
  constructor(private telemetryService: EditorTelemetryService, private editorService: EditorService ) { }

  ngOnInit() {
    this.collectionId = _.get(this.libraryInput, 'collectionId');
    this.editorService.fetchCollectionHierarchy(this.libraryInput).subscribe((response: any) => {
      this.collectionhierarcyData = response.result.content;
      this.collectionUnits = _.get(this.collectionhierarcyData, 'children');
      this.collectionHierarchy = this.getUnitWithChildren(this.collectionhierarcyData, this.collectionId);
      });
    this.telemetryService.telemetryPageId = this.pageId;
    this.childNodes = _.get(this.collectionData, 'childNodes');
    this.fetchContentList();
  }

  back() {
    this.libraryEmitter.emit({});
  }

  onFilterChange(event: any) {
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
      this.contentList = response.result.content;
      this.filterContentList();
      this.showLoader = false;
      });
  }

  getUnitWithChildren(data, collectionId) {
    const self = this;
    const childData = data.children;
    if (_.isEmpty(childData)) { return []; }
    const tree = childData.map(child => {
      // if (child.identifier === this.collectionUnitId) {
      //   this.selectedUnitName = child.name;
      // }
      const treeItem = this.generateNodeMeta(child);
      const treeUnit = self.getUnitWithChildren(child, collectionId);
      const treeChildren = treeUnit && treeUnit.filter(item => item.contentType === 'TextBookUnit');
      // tslint:disable-next-line:no-string-literal
      treeItem['children'] = (treeChildren && treeChildren.length > 0) ? treeChildren : null;
      return treeItem;
    });
    return tree;
  }

  generateNodeMeta(node) {
    const nodeMeta = {
      identifier: node.identifier,
      name: node.name,
      contentType: node.contentType,
      topic: node.topic,
      status: node.status,
      creator: node.creator,
      createdBy: node.createdBy || null,
      parentId: node.parent || null,
      organisationId: _.has(node, 'organisationId') ? node.organisationId : null,
      prevStatus: node.prevStatus || null,
    };
    return nodeMeta;
  }


  onContentChangeEvent(event: any) {
    this.selectedContent = event.content;
  }

  showResourceTemplate(event) {
    switch (event.action) {
      case 'showFilter':
        this.openFilter();
        break;
      case 'openHierarchyPopup':
        this.showSelectResourceModal = true;
        break;
      case 'closeHierarchyPopup':
        this.showSelectResourceModal = false;
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

      const selectedContentIndex = this.showAddedContent ? 0 : _.findIndex(this.contentList, { isAdded: false });
      this.selectedContent = this.contentList[selectedContentIndex];
    }
  }
