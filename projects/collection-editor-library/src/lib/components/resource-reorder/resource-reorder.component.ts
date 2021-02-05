import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditorService } from '../../services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IeventData } from '../../interfaces';
// import { data } from './data';
@Component({
  selector: 'lib-resource-reorder',
  templateUrl: './resource-reorder.component.html',
  styleUrls: ['./resource-reorder.component.scss']
})
export class ResourceReorderComponent implements OnInit {

  unitSelected: string;
  @Input() selectedContentDetails;
  @Input() collectionUnits;
  // @Input() contentId;
  // @Input() sessionContext;
  @Input() programContext;
  @Input() prevUnitSelect;
  // collectionUnits = data.collectionUnit;
  // contentId = data.contentId;
  // sessionContext = data.sessionContext;
  // prevUnitSelect = data.prevUnitSelect;
  showMoveButton = false;
  @Output() moveEvent = new EventEmitter<any>();
  private onComponentDestroy$ = new Subject<any>();
  constructor(private editorService: EditorService) { }

  ngOnInit() {
    console.log('this.selectedContentDetails', this.selectedContentDetails);
    console.log('this.collectionUnits', this.collectionUnits);
  }

  onSelectBehaviour(e) {
    e.stopPropagation();
  }

  setCollectionUnitBreadcrumb(): void {
  }

  addResource() {
    this.editorService.nodeData$.pipe(takeUntil(this.onComponentDestroy$)).subscribe((data: IeventData) => {
      console.log('editorService data', data);
    });
    console.log('this.prevUnitSelect', this.prevUnitSelect);

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
