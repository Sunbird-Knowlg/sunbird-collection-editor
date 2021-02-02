import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { EditorService, TreeService, FrameworkService, HelperService } from '../../services';
import { IeventData } from '../../interfaces';
import * as _ from 'lodash-es';

@Component({
  selector: 'lib-meta-form',
  templateUrl: './meta-form.component.html',
  styleUrls: ['./meta-form.component.scss']
})
export class MetaFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() rootFormConfig: any;
  @Input() unitFormConfig: any;
  @Input() formFieldValues: any;
  private onComponentDestroy$ = new Subject<any>();
  public metaDataFields: any;
  public formOutputData: any;
  public frameworkDetails: any = {};
  public formFieldProperties: any;
  public valueChange: boolean;
  public formDataConfig;
  public rootLevelConfig = ['title', 'description', 'board', 'medium', 'gradeLevel', 'subject', 'topic',
  'boardIds', 'gradeLevelIds', 'subjectIds', 'mediumIds', 'topicsIds',
  'targetFWIds', 'targetBoardIds', 'targetGradeLevelIds', 'targetSubjectIds', 'targetMediumIds', 'targetTopicIds'];
  public unitLevelConfig = ['title', 'description', 'keywords', 'topic'];
  public organisationFrameworkFields = ['boardIds', 'gradeLevelIds', 'subjectIds', 'mediumIds'];
  public targetFrameWorkFields = ['targetBoardIds', 'targetGradeLevelIds', 'targetSubjectIds', 'targetMediumIds'];
  @Output() public prevNodeMetadata: EventEmitter<IeventData> = new EventEmitter();
  constructor(private editorService: EditorService, public treeService: TreeService,
              private frameworkService: FrameworkService, private helperService: HelperService) { }

  ngOnChanges() {

  }

  ngOnInit() {
    this.editorService.nodeData$.pipe(takeUntil(this.onComponentDestroy$)).subscribe((data: IeventData) => {
      console.log('incoming data --->', data);
      if (this.valueChange || data.type === 'saveContent') {
        this.prevNodeMetadata.emit({type: data.type, metadata: this.formOutputData || this.metaDataFields});
        this.valueChange = false;
      }
      this.metaDataFields = data.metadata ? data.metadata : this.metaDataFields;
      this.fetchFrameWorkDetails();
    });
  }

  // dataChanged(e) {
  //   this.treeService.setNodeTitle(_.get(this.metaDataFields, 'name'));
  // }

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
        this.attachDefaultValues();
      }
    });
  }

  attachDefaultValues() {
    const categoryMasterList = this.frameworkDetails.frameworkData;
    console.log(categoryMasterList);
    console.log(`VISIBILITY ${this.metaDataFields.visibility}`);

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
        if(field.code === 'additionalCategories' && this.formFieldValues.additionalCategories) {
          field.range = this.formFieldValues.additionalCategories;
        }
      });
    });



    if (!_.isEmpty(this.frameworkDetails.targetFrameworks)) {
      _.forEach(this.frameworkDetails.targetFrameworks, (framework) => {
        _.forEach(formConfig, (section) => {
          _.forEach(section.fields, field => {
            // const frameworkCategory = _.find(framework.categories, {
            //   code: field.sourceCategory // boardIds, targetBoardIds
            // });

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


    // tslint:disable-next-line:max-line-length
    // this.formDataConfig = _.map(_.filter(_.cloneDeep(formConfig), data => {
    //   if (this.metaDataFields.visibility === 'Default' && _.includes(this.rootLevelConfig, data.code)) {
    //     return data;
    //   } else if (this.metaDataFields.visibility === 'Parent' && _.includes(this.unitLevelConfig, data.code)) {
    //     console.log('---->//////', data);
    //     return data;
    //   }
    // }), val => {
    //   if (_.get(this.metaDataFields, val.code)) {
    //     val.default = _.get(this.metaDataFields, val.code);
    //   }
    //   if (val.code === 'title' && _.get(this.metaDataFields, 'name')) {
    //     val.default = _.get(this.metaDataFields, 'name');
    //   }
    //   return val;
    // });


    this.formFieldProperties = _.cloneDeep(formConfig);
    console.log(this.formFieldProperties);

    // _.forEach(_.cloneDeep(this.formConfig), section => {
    //   _.forEach(section.fields, field => {
    //     field.default = _.get(this.metaDataFields, field.code);
    //   });
    //   this.formDataConfig.push(section);
    // });


    // console.log('config--->', this.formDataConfig);
  }

  outputData(eventData) {
    if (eventData) {
      console.log('eventData outputData------>', eventData);
      // this.metaDataFields = eventData.value;
      // this.treeService.setNodeTitle(_.get(this.metaDataFields, 'name'));
    }
  }

  onStatusChanges(eventData) {
    // if (eventData) {
    //   console.log('eventData statusChanges------>', eventData);
    //   this.metaDataFields = eventData.value;
    //   this.treeService.setNodeTitle(_.get(this.metaDataFields, 'name'));
    // }
  }

  valueChanges(eventData) {
    console.log(eventData);
    if (eventData) {
      this.valueChange = true;
      this.formOutputData = {};
      _.forIn(eventData, (val, key) => {
        key === 'name' ? this.metaDataFields['name'] = val : this.metaDataFields[key] = val;
        key === 'name' ? this.formOutputData['name'] = val : this.formOutputData[key] = val;
      });
      this.treeService.setNodeTitle(_.get(eventData, 'name'));
    }
  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
