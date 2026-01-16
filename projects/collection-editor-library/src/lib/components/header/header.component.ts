import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ConfigService } from '../../services/config/config.service';
import * as _ from 'lodash-es';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  @Input() publishchecklist: any;
  @Input() set requestChange(action: string) {
    if (action) {
      this.openRequestChangePopup(action);
    }
  }
  @Output() toolbarEmitter = new EventEmitter<any>();
  @Output() bulkUploadEmitter = new EventEmitter<any>();
  @ViewChild('FormControl') FormControl: NgForm;
  @ViewChild('modal') public modal;
  @Output() qualityParamEmitter = new EventEmitter<any>();
  public visibility: any;
  public showReviewModal: boolean;
  public showPublishCollectionPopup: boolean;
  public showRequestChangesPopup: boolean;
  public rejectComment: string;
  public actionType: string;
  public objectType: string;
  public sourcingStatusText: string;
  public sourcingStatusClass: string;
  public originPreviewUrl: string;
  public correctionComments: string;
  public unsubscribe$ = new Subject<void>();
  public bulkUploadStatus = false;
  public uploadContentStatus = false;

  constructor(private editorService: EditorService,
    public telemetryService: EditorTelemetryService,
    public configService: ConfigService) { }

  async ngOnInit() {
    console.log('HeaderComponent: ngOnInit triggered');
    this.editorService.bulkUploadStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe((status) => {
      console.log('Bulk upload status changed:', status);
      if (status === 'processing') {
        this.bulkUploadStatus = true;
      } else {
        this.bulkUploadStatus = false;
      }
    });
    this.editorService.treeService.treeStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe((status) => {
      if (status === 'added' || status === 'removed' || status === 'loaded') {
        this.updateContentStatus();
      }
    });
    this.objectType = _.get(this.editorService, 'editorConfig.config.objectType');
    await this.handleActionButtons();
    this.getSourcingData();
    this.updateContentStatus();
  }

  updateContentStatus() {
    const contentChildren = this.editorService.getContentChildrens();
    this.uploadContentStatus = contentChildren.length > 0;
  }


  async handleActionButtons() {
    this.visibility = {};
    // Edit button visibility
    // 1. if the editor in edit mode
    // 2. if ReviewModificationAllowed is allowed and review/org-reviewer is viewing and the question is not added from library the question
    this.visibility.editContent = this.editorService.editorMode === 'edit' || ((this.editorService.editorMode === 'orgreview' || this.editorService.editorMode === 'sourcingreview') && this.editorService.isReviewModificationAllowed && !_.get(this.editorService, 'editorConfig.context.isAddedFromLibrary', false));
    this.visibility.saveContent = this.editorService.editorMode === 'edit' || ((this.editorService.editorMode === 'orgreview' || this.editorService.editorMode === 'sourcingreview') && this.editorService.isReviewModificationAllowed);
    this.visibility.submitContent = this.editorService.editorMode === 'edit';
    this.visibility.rejectContent = this.editorService.editorMode === 'review' || this.editorService.editorMode === 'orgreview';
    this.visibility.publishContent = this.editorService.editorMode === 'review' || this.editorService.editorMode === 'orgreview';
    this.visibility.sendForCorrectionsContent = this.editorService.editorMode === 'sourcingreview' && !_.get(this.editorService, 'editorConfig.context.isAddedFromLibrary', false);
    this.visibility.sourcingApproveContent = this.editorService.editorMode === 'sourcingreview';
    this.visibility.sourcingRejectContent = this.editorService.editorMode === 'sourcingreview';
    this.visibility.previewContent = _.get(this.editorService, 'editorConfig.config.objectType') === 'QuestionSet';
    this.visibility.dialcode = this.editorService.editorMode === 'edit';
    // tslint:disable-next-line:max-line-length
    this.visibility.bulkUpload = _.get(this.editorService, 'editorConfig.config.objectType') === 'QuestionSet' && this.editorService.editorMode === 'edit';
    this.visibility.showOriginPreviewUrl = _.get(this.editorService, 'editorConfig.config.showOriginPreviewUrl');
    this.visibility.showSourcingStatus = _.get(this.editorService, 'editorConfig.config.showSourcingStatus');
    this.visibility.showCorrectionComments = _.get(this.editorService, 'editorConfig.config.showCorrectionComments');
    this.visibility.hideSubmitForReviewBtn = _.get(this.editorService, 'editorConfig.config.hideSubmitForReviewBtn') || false;
    this.visibility.addCollaborator = _.get(this.editorService, 'editorConfig.config.showAddCollaborator');
    this.visibility.showPaginationBtn = _.get(this.editorService, 'editorConfig.config.enablePagination');
  }

  getSourcingData() {
    this.sourcingStatusText = (this.visibility.showSourcingStatus) ? _.get(this.editorService, 'editorConfig.context.sourcingResourceStatus') : '';
    this.sourcingStatusClass = (this.visibility.showSourcingStatus) ? _.get(this.editorService, 'editorConfig.context.sourcingResourceStatusClass') : '';
    this.originPreviewUrl = (this.visibility.showOriginPreviewUrl) ? _.get(this.editorService, 'editorConfig.context.originPreviewUrl') : '';
    this.correctionComments = (this.visibility.showCorrectionComments) ? _.get(this.editorService, 'editorConfig.context.correctionComments') : '';
  }

  openRequestChangePopup(action: string) {
    this.actionType = action;
    this.showRequestChangesPopup = true;
  }

  buttonEmitter(action) {
    this.toolbarEmitter.emit({ button: action.type, ...(action.comment && { comment: this.rejectComment }) });
  }

  openPublishCheckListPopup(action) {
    this.actionType = action;
    this.showPublishCollectionPopup = true;
  }

  firstLevelPublish() {
    if (this.editorService.isReviewerQualityCheckEnabled) {
      this.toolbarEmitter.emit({ button: 'saveQualityParameters' });
    } else {
      this.buttonEmitter({ type: 'publishQuestion' });
    }
  }

  publishEmitter(event) {
    this.showPublishCollectionPopup = false;
    if (event.button === 'publishContent' || event.button === 'publishQuestion' || event.button === 'sourcingApprove' || event.button === 'sourcingApproveQuestion') {
      this.toolbarEmitter.emit(event);
    }
  }

  bulkUploadListener(event) {
    this.bulkUploadEmitter.emit(event);
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
