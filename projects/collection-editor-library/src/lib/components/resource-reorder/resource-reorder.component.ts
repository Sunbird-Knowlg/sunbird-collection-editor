import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation} from '@angular/core';
import { EditorService, ToasterService } from '../../services';
import * as _ from 'lodash-es';
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
  constructor(private editorService: EditorService, private toasterService: ToasterService) { }

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
      this.toasterService.success('Content is added to hierarchy...');
    }, err => {
      this.toasterService.error('Something went wrong...');
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
