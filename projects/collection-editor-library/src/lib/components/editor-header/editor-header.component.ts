import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TreeService, EditorService, HelperService} from '../../services';
import * as _ from 'lodash-es';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'lib-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditorHeaderComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('toolbarConfig') labelConfigData: any;
  @Output() toolbarEmitter = new EventEmitter<any>();
  @ViewChild('FormControl', {static: false}) FormControl: NgForm;
  private onComponentDestroy$ = new Subject<any>();
  public editorConfig: any;
  public visibility: any;
  public showReviewModal: boolean;
  public showRequestChangesPopup: boolean;
  public rejectComment: string;
  public contentComment: string;
  constructor(private editorService: EditorService, private treeService: TreeService, private helperService: HelperService) { }

  ngOnInit() {
    this.handleActionButtons();
  }

  handleActionButtons() {
    this.visibility = {};
    this.visibility.saveContent = this.editorService.editorMode === 'edit';
    this.visibility.submitContent = this.editorService.editorMode === 'edit';
    this.visibility.rejectContent = this.editorService.editorMode === 'review';
    this.visibility.publishContent = this.editorService.editorMode === 'review';
  }

  buttonEmitter(action) {
    this.toolbarEmitter.emit({button: action.type, ...(action.comment && {comment: this.rejectComment})});
  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
