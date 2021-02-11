import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { EditorService, TreeService, FrameworkService, HelperService } from '../../services';
import * as _ from 'lodash-es';

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
  public metaDataFields: any;
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
    this.metaDataFields = _.get(this.nodeMetadata, 'data.metadata');
    const categoryMasterList = this.frameworkDetails.frameworkData;
    const formConfig  = (this.metaDataFields.visibility === 'Default') ?
     _.cloneDeep(this.rootFormConfig) : _.cloneDeep(this.unitFormConfig);
    _.forEach(formConfig, (section) => {
      _.forEach(section.fields, field => {

        const frameworkCategory = _.find(categoryMasterList, category => {
          return category.code === field.sourceCategory && !_.includes(field.code, 'target');
        });
        if (field.sourceCategory) {
          field.default = _.get(this.metaDataFields, field.sourceCategory);
        } else {
          field.default = _.get(this.metaDataFields, field.code);
        }

        if (!_.isEmpty(frameworkCategory)) {
          field.terms = frameworkCategory.terms;
        }

        if (field.code === 'license' && this.helperService.getAvailableLicenses()) {
          const licenses = this.helperService.getAvailableLicenses();
          if (licenses && licenses.length) {
            field.range = _.map(licenses, 'name');
          }
        }
        if (field.code === 'additionalCategories') {
          field.range = _.get(this.editorService.editorConfig, 'context.additionalCategories');
        }
      });
    });



    if (!_.isEmpty(this.frameworkDetails.targetFrameworks)) {
      _.forEach(this.frameworkDetails.targetFrameworks, (framework) => {
        _.forEach(formConfig, (section) => {
          _.forEach(section.fields, field => {
            const frameworkCategory = _.find(framework.categories, category => {
              return category.code === field.sourceCategory && _.includes(field.code, 'target');
            });
            field.default = _.get(this.metaDataFields, field.code);

            if (!_.isEmpty(frameworkCategory)) { // field.code
              field.terms = frameworkCategory.terms;
            }
          });
        });
      });
    }


    this.formFieldProperties = _.cloneDeep(formConfig);
    console.log(this.formFieldProperties);

  }

  outputData(eventData) {
    // if (eventData) {
    //   console.log('eventData outputData------>', eventData);
    // }
  }

  onStatusChanges(eventData) {
    console.log('eventData statusChanges------>', eventData);
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
