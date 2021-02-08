import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { EditorService } from '../../services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { IeventData } from '../../interfaces';
import {labelMessages} from '../labels';
@Component({
  selector: 'lib-resource-reorder',
  templateUrl: './resource-reorder.component.html',
  styleUrls: ['./resource-reorder.component.scss']
})
export class ResourceReorderComponent implements OnInit {
  labelMessages = labelMessages;
  unitSelected: string;
  @Input() collectionId;
  @Input() collectionUnits;
  @Input() programContext;
  @Input() prevUnitSelect;
  showMoveButton = false;
  @ViewChild('modal', {static: true}) modal;
  selectedContentDetails: any;
  @Output() moveEvent = new EventEmitter<any>();
  private onComponentDestroy$ = new Subject<any>();
  constructor(private editorService: EditorService) { }

  ngOnInit() {
    this.editorService.nodeData$.pipe(takeUntil(this.onComponentDestroy$)).subscribe((contentdata: IeventData) => {
      this.selectedContentDetails = _.get(contentdata, 'metadata');
    });
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }

  addResource() {
    this.editorService.addResourceToHierarchy(this.collectionId, this.prevUnitSelect, this.selectedContentDetails.identifier)
    .subscribe((data) => {
      this.modal.deny();
      alert('content is added to Hierarchy');
    }, err => {
    });
  }

  closePopup() {
    this.moveEvent.emit({
      action: 'closeHierarchyPopup',
      contentId: '',
      collection: {
        identifier: ''
      }
    });
  }
}
