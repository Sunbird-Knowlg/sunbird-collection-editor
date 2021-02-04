import { EditorService } from './../../services/editor/editor.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash-es';
import { data } from './data';
import {labelMessages} from '../labels';
import { FrameworkService } from '../../services';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';

@Component({
  selector: 'lib-library-filter',
  templateUrl: './library-filter.component.html',
  styleUrls: ['./library-filter.component.scss']
})
export class LibraryFilterComponent implements OnInit {

  labelMessages = labelMessages;
  @Input() sessionContext: any;
  filters = data.filters;
  activeFilterData = data.activeFilterData;
  @Input() filterOpenStatus: boolean;
  @Output() filterChangeEvent: EventEmitter<any> = new EventEmitter();
  public frameworkDetails: any = {};
  private onComponentDestroy$ = new Subject<any>();
  searchFilterForm: FormGroup;
  public isFilterShow = false;
  public telemetryPageId: string;
  public editorConfig: any;

  constructor( private sbFormBuilder: FormBuilder,
    private editorService: EditorService,
    private frameworkService: FrameworkService) { }

  ngOnInit() {
    this.editorConfig = this.editorService.editorConfig.config;
    this.initializeForm();
    this.fetchFrameWorkDetails();
  }

  initializeForm() {
    let contentTypes = _.get(this.editorConfig, 'hierarchy.level2.children.Content') || [];
    this.searchFilterForm = this.sbFormBuilder.group({
      contentType: [this.activeFilterData.contentType],
      subject: [this.activeFilterData.subject],
      gradeLevel: [this.activeFilterData.gradeLevel],
      medium: [this.activeFilterData.medium],
      chapter: [this.activeFilterData.chapter ? this.activeFilterData.chapter : []],
    });
  }

  fetchFrameWorkDetails() {
    this.frameworkService.frameworkData$.pipe(
      takeUntil(this.onComponentDestroy$),
      filter(data => _.get(data, `frameworkdata.${this.frameworkService.organisationFramework}`)),
      take(1)
    ).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.frameworkService.organisationFramework].categories;
        this.frameworkDetails.frameworkData = frameworkData;
        this.frameworkDetails.topicList = _.get(_.find(frameworkData, {
          code: 'topic'
        }), 'terms');
        this.frameworkDetails.targetFrameworks = _.filter(frameworkDetails.frameworkdata, (value, key) => {
          return _.includes(this.frameworkService.targetFrameworkIds, key);
        });
        console.log(this.frameworkDetails.targetFrameworks);
      }
    });
  }

  showfilter() {
    this.isFilterShow = !this.isFilterShow;
    this.filterChangeEvent.emit({
      action: 'filterStatusChange',
      filterStatus: this.isFilterShow
    });
  }

  resetFilter() {
    this.searchFilterForm.reset();
    this.applyFilter();
  }

  applyFilter() {
    this.filterChangeEvent.emit({
      action: 'filterDataChange',
      filters: this.searchFilterForm.value
    });
  }

}
