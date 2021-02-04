import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash-es';
import { data } from './data';
import {labelMessages} from '../labels';
@Component({
  selector: 'lib-library-filter',
  templateUrl: './library-filter.component.html',
  styleUrls: ['./library-filter.component.scss']
})
export class LibraryFilterComponent implements OnInit, OnChanges {

  labelMessages = labelMessages;
  @Input() sessionContext: any;
  // @Input() filters: any;
  // @Input() activeFilterData: any;
  filters = data.filters;
  activeFilterData = data.activeFilterData;
  @Input() filterOpenStatus: boolean;
  @Output() filterChangeEvent: EventEmitter<any> = new EventEmitter();
  searchFilterForm: FormGroup;
  public isFilterShow = false;
  public telemetryPageId: string;

  constructor( private sbFormBuilder: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges() {
    this.isFilterShow = this.filterOpenStatus;
  }

  initializeForm() {
    this.searchFilterForm = this.sbFormBuilder.group({
      contentType: [this.activeFilterData.contentType],
      subject: [this.activeFilterData.subject],
      gradeLevel: [this.activeFilterData.gradeLevel],
      medium: [this.activeFilterData.medium],
      chapter: [this.activeFilterData.chapter ? this.activeFilterData.chapter : []],
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
