import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation} from '@angular/core';
import { EditorService } from '../../services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { IeventData } from '../../interfaces';
import {labelMessages} from '../labels';
@Component({
  selector: 'lib-resource-reorder',
  templateUrl: './resource-reorder.component.html',
  styleUrls: ['./resource-reorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResourceReorderComponent implements OnInit {
  labelMessages = labelMessages;
  unitSelected: string;
  @Input() selectedContentDetails;
  @Input() collectionId;
  @Input() collectionUnits;
  @Input() programContext;
  @Input() prevUnitSelect;
  showMoveButton = false;
  @ViewChild('modal', {static: true}) modal;
  @Output() moveEvent = new EventEmitter<any>();
  constructor(private editorService: EditorService) { }

  ngOnInit() {
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }

  addResource() {
    this.editorService.addResourceToHierarchy(this.collectionId, this.prevUnitSelect, this.selectedContentDetails.identifier)
    .subscribe((data) => {
      this.modal.deny();
      this.moveEvent.emit({
        action: 'contentAdded',
        data: this.selectedContentDetails
      });
      alert('Content is added to hierarchy...');
    }, err => {
      alert('Something went wrong...');
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
