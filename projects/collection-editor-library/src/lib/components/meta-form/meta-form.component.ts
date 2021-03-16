import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { takeUntil, filter } from 'rxjs/operators';
import { TreeService } from '../../services/tree/tree.service';
import { EditorService } from '../../services/editor/editor.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { HelperService } from '../../services/helper/helper.service';
@Component({
  selector: 'lib-meta-form',
  templateUrl: './meta-form.component.html',
  styleUrls: ['./meta-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MetaFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() rootFormConfig: any;
  @Input() unitFormConfig: any;
  @Input() nodeMetadata: any;
  @Output() toolbarEmitter = new EventEmitter<any>();
  private onComponentDestroy$ = new Subject<any>();
  public frameworkDetails: any = {};
  public formFieldProperties: any;
  constructor(private editorService: EditorService, private treeService: TreeService,
              private frameworkService: FrameworkService, private helperService: HelperService) { }

  ngOnChanges() {
    this.fetchFrameWorkDetails();
  }

  ngOnInit() {
  }

  fetchFrameWorkDetails() {
    this.frameworkService.frameworkData$.pipe(
      takeUntil(this.onComponentDestroy$),
      filter(data => _.get(data, `frameworkdata.${this.frameworkService.organisationFramework}`))
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
        this.attachDefaultValues();
      }
    });
  }

  attachDefaultValues() {
    const metaDataFields = _.get(this.nodeMetadata, 'data.metadata');
    // if (_.isEmpty(metaDataFields)) { return; }
    const categoryMasterList = this.frameworkDetails.frameworkData;
    let formConfig: any = (metaDataFields.visibility === 'Default') ? _.cloneDeep(this.rootFormConfig) : _.cloneDeep(this.unitFormConfig);
    formConfig = formConfig && _.has(_.first(formConfig), 'fields') ? formConfig : [{name: '', fields: formConfig}];
    if (!_.isEmpty(this.frameworkDetails.targetFrameworks)) {
      _.forEach(this.frameworkDetails.targetFrameworks, (framework) => {
        _.forEach(formConfig, (section) => {
          _.forEach(section.fields, field => {
            const frameworkCategory = _.find(framework.categories, category => {
              return category.code === field.sourceCategory && _.includes(field.code, 'target');
            });
            if (!_.isEmpty(frameworkCategory)) { // field.code
              field.terms = frameworkCategory.terms;
            }
          });
        });
      });
    }

    _.forEach(formConfig, (section) => {
      _.forEach(section.fields, field => {

        if (metaDataFields && _.has(metaDataFields, field.code)) {
          field.default = _.get(metaDataFields, field.code);
        }

        const frameworkCategory = _.find(categoryMasterList, category => {
          return (category.code === field.sourceCategory || category.code === field.code) && !_.includes(field.code, 'target');
        });
        if (!_.isEmpty(frameworkCategory)) {
          field.terms = frameworkCategory.terms;
        }

        if (field.code === 'license' && this.helperService.getAvailableLicenses()) {
          const licenses = this.helperService.getAvailableLicenses();
          if (licenses && licenses.length) {
            field.range = _.isArray(licenses) ? _.map(licenses, 'name') : [licenses];
          }
        }

        if (field.code === 'additionalCategories') {
          const additionalCategories = _.get(this.editorService.editorConfig, 'context.additionalCategories');
          if (!_.isEmpty(additionalCategories)) {
            field.range = additionalCategories;
          }
        }

        if ((_.isEmpty(field.range) || _.isEmpty(field.terms)) &&
          !field.editable && !_.isEmpty(field.default)) {
          if (_.has(field, 'terms')) {
            field.terms = [];
            if (_.isArray(field.default)) {
              field.terms = field.default;
            } else {
              field.terms.push(field.default);
            }
          } else {
            field.range = [];
            if (_.isArray(field.default)) {
              field.range = field.default;
            } else {
              field.range.push(field.default);
            }
          }
        }

        if (field.inputType === 'nestedselect') {
          _.map(field.range, val => {
            return {
              value: val.value || val,
              label: val.value || val
            };
          });
        }

        if (this.editorService.editorMode === 'review' || this.editorService.editorMode === 'read') {
          _.set(field, 'editable', false);
        }

      });
    });

    this.formFieldProperties = _.cloneDeep(formConfig);
    console.log(this.formFieldProperties);
  }

  outputData(eventData: any) { }

  onStatusChanges(event) {
    this.toolbarEmitter.emit({ button: 'onFormStatusChange', event });
  }

  valueChanges(event: any) {
    console.log(event);
    this.toolbarEmitter.emit({ button: 'onFormValueChange', event });
    this.treeService.updateNode(event);
  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
