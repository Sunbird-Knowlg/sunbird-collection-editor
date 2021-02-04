import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { data } from './data';
@Component({
  selector: 'lib-resource-reorder',
  templateUrl: './resource-reorder.component.html',
  styleUrls: ['./resource-reorder.component.scss']
})
export class ResourceReorderComponent implements OnInit {

  @Input() selectedContentDetails;
  // @Input() collectionUnits;
  // @Input() contentId;
  // @Input() sessionContext;
  @Input() programContext;
  // @Input() prevUnitSelect;
  collectionUnits = data.collectionUnit;
  contentId = data.contentId;
  sessionContext = data.sessionContext;
  prevUnitSelect = data.prevUnitSelect;
  showMoveButton = false;
  @Output() moveEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    console.log('this.selectedContentDetails', this.selectedContentDetails);
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }

  setCollectionUnitBreadcrumb(): void {
  }

  addResource() {
  }

  cancelMove() {
    this.moveEvent.emit({
      action: 'cancelMove',
      contentId: '',
      collection: {
        identifier: ''
      }
    });
  }

  moveResource() {
  }

}
