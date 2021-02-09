import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TreeService, EditorService, HelperService} from '../../services';
import { labelConfig } from '../../editor.config';
import * as _ from 'lodash-es';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'lib-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditorHeaderComponent implements OnInit, OnDestroy {

  @Output() toolbarEmitter = new EventEmitter<any>();
  @ViewChild('FormControl', {static: false}) FormControl: NgForm;
  private onComponentDestroy$ = new Subject<any>();
  public labelConfigData: any;
  public editorConfig: any;
  public visibility: any;
  public showReviewModal: boolean;
  public showRequestChangesPopup: boolean;
  public rejectComment: string;
  public contentComment: string;
  public formStatus: boolean;
  constructor(private editorService: EditorService, private treeService: TreeService, private helperService: HelperService) { }

  ngOnInit() {
    this.labelConfigData = _.clone(labelConfig);
    this.editorConfig = _.cloneDeep(this.editorService.editorConfig);
    this.editorService.nodeData$.pipe(takeUntil(this.onComponentDestroy$)).subscribe((data) => {
      console.log('incoming data --->', data);
      setTimeout(() => {
        this.handleActionButtons(); // Header buttons should behave based on tree updated
      }, 100);
    });
    this.helperService.formStatus$.pipe(takeUntil(this.onComponentDestroy$)).subscribe((data) => {
      this.formStatus = data.isValid; // Header buttons should behave based on tree updated
    });
  }

  handleActionButtons() {
    console.log(this.treeService.getFirstChild().getFirstChild(), '---------+++++++');
    this.visibility = {};
    this.visibility['saveContent'] = this.editorConfig.config.mode === 'edit';
    // tslint:disable-next-line:max-line-length
    this.visibility['submitContent'] = this.editorConfig.config.mode === 'edit' && this.treeService.getFirstChild().getFirstChild();
    this.visibility['rejectContent'] = this.editorConfig.config.mode === 'review';
    this.visibility['publishContent'] = this.editorConfig.config.mode === 'review';
  }

  buttonEmitter(action) {
    this.toolbarEmitter.emit({button: action.type, ...(action.comment && {comment: this.rejectComment})});
  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
