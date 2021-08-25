import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { TreeService } from '../../services/tree/tree.service';
import { EditorService } from '../../services/editor/editor.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ConfigService } from '../../services/config/config.service';
import { HelperService } from '../../services/helper/helper.service';

@Component({
  selector: 'lib-library-filter',
  templateUrl: './library-filter.component.html',
  styleUrls: ['./library-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LibraryFilterComponent implements OnInit, OnChanges {
  @Input() sessionContext: any;
  @Input() filterValues: any;
  @Input() filterOpenStatus: boolean;
  @Input() searchFormConfig: any;
  @Input() frameworkId: any;
  @Output() filterChangeEvent: EventEmitter<any> = new EventEmitter();
  public filterConfig: any;
  public isFilterShow = false;
  public filterFields: any;
  public telemetryPageId: string;
  private onComponentDestroy$ = new Subject<any>();
  public frameworkDetails: any = {};
  public currentFilters: any;
  public searchQuery: string;

  constructor(private frameworkService: FrameworkService,
              public editorService: EditorService,
              public telemetryService: EditorTelemetryService,
              public treeService: TreeService,
              public configService: ConfigService,
              private helperService: HelperService) { }

  ngOnInit() {
    this.filterFields = this.searchFormConfig;
    const selectedNode = this.treeService.getActiveNode();
    let contentTypes = _.flatten(
      _.map(_.get(this.editorService.editorConfig.config, `hierarchy.level${selectedNode.getLevel() - 1}.children`), (val) => {
      return val;
    }));

    if (_.isEmpty(contentTypes)) {
      contentTypes = _.map(this.helperService.contentPrimaryCategories, 'name');
    }

    this.currentFilters = {
      primaryCategory: contentTypes,
      board: [],
      medium: [],
      gradeLevel: [],
      subject: [],
    };
    this.setFilterDefaultValues();
    this.fetchFrameWorkDetails();
  }

  setFilterDefaultValues() {
    _.forEach(this.filterFields, (field) => {
      if (this.filterValues[field.code]) {
        field.default = this.filterValues[field.code];
      }
    });
  }

  ngOnChanges() {
    this.isFilterShow = this.filterOpenStatus;
  }

  fetchFrameWorkDetails() {
    this.frameworkService.frameworkData$.pipe(
      takeUntil(this.onComponentDestroy$),
      filter(data => _.get(data, `frameworkdata.${this.frameworkId}`)),
      take(1)
    ).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.frameworkId].categories;
        this.frameworkDetails.frameworkData = frameworkData;
        this.frameworkDetails.topicList = _.get(_.find(frameworkData, {
          code: 'topic'
        }), 'terms');
        this.frameworkDetails.targetFrameworks = _.filter(frameworkDetails.frameworkdata, (value, key) => {
          return _.includes(this.frameworkService.targetFrameworkIds, key);
        });
        this.populateFilters();
      }
    });
  }

  populateFilters() {
    const categoryMasterList = this.frameworkDetails.frameworkData;
    _.forEach(categoryMasterList, (category) => {
      _.forEach(this.filterFields, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.terms = category.terms;
        }
      });
    });

    const index = this.filterFields.findIndex(e => _.get(e, 'code') === 'primaryCategory');
    if (index !== -1) {
      this.filterFields[index].range = this.currentFilters.primaryCategory;
    }

    this.filterConfig = [{
      name: 'searchForm',
      fields: this.filterFields
    }];
  }

  onQueryEnter(event) {
    this.emitApplyFilter();
    return false;
  }

  showfilter() {
    this.isFilterShow = !this.isFilterShow;
    this.filterChangeEvent.emit({
      action: 'filterStatusChange',
      filterStatus: this.isFilterShow
    });
  }

  resetFilter() {
    this.filterValues = {
      primaryCategory: _.map(this.helperService.contentPrimaryCategories, 'name')
    };
    this.searchQuery = '';
    _.forEach(this.filterFields, (field) => {
      field.default = '';
    });

    this.filterConfig = null;
    this.filterConfig = [{
      name: 'searchForm',
      fields: _.cloneDeep(this.filterFields)
    }];

    this.emitApplyFilter();
  }

  applyFilter() {
    this.emitApplyFilter();
  }

  emitApplyFilter() {
    this.filterChangeEvent.emit({
      action: 'filterDataChange',
      filters: this.filterValues,
      query: this.searchQuery
    });
  }
  outputData($event) {
  }
  onStatusChanges($event) {
  }
  valueChanges($event) {
    this.filterValues = $event;
  }
}
