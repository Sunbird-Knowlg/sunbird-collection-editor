import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import * as _ from 'lodash-es';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnDestroy, OnInit {
  @Input() pageId: any;
  @Input() labelConfigData: any;
  @Output() toolbarEmitter = new EventEmitter<any>();
  @ViewChild('FormControl', {static: false}) FormControl: NgForm;
  public visibility: any;
  public showReviewModal: boolean;
  public showRequestChangesPopup: boolean;
  public showPublishCollectionPopup: boolean;
  public rejectComment: string;
  public contentComment: string;
  constructor(private editorService: EditorService, public telemetryService: EditorTelemetryService) { }

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

  ngOnDestroy() {}
}
