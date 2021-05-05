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
  @Input() buttonLoaders: any;
  @Input() showComment: any;
  @Output() toolbarEmitter = new EventEmitter<any>();
  @ViewChild('FormControl', {static: false}) FormControl: NgForm;
  @ViewChild('modal', {static: false}) public modal;
  public visibility: any;
  public showReviewModal: boolean;
  public showRequestChangesPopup: boolean;
  public showPublishCollectionPopup: boolean;
  public rejectComment: string;
  public actionType: string;
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
    this.visibility.sendForCorrectionsContent = this.editorService.editorMode === 'sourcingreview';
    this.visibility.sourcingApproveContent = this.editorService.editorMode === 'sourcingreview';
    this.visibility.sourcingRejectContent = this.editorService.editorMode === 'sourcingreview';
    this.visibility.previewContent = _.get(this.editorService, 'editorConfig.config.objectType') === 'QuestionSet';
    // tslint:disable-next-line:max-line-length
    this.visibility.dialcode = this.editorService.editorMode === 'edit' && _.get(this.editorService, 'editorConfig.config.qrCode.show');
  }

  openRequestChangePopup(action: string) {
    this.actionType = action;
    this.showRequestChangesPopup = true;
  }

  buttonEmitter(action) {
    this.toolbarEmitter.emit({button: action.type, ...(action.comment && {comment: this.rejectComment})});
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
