import {
  Component, HostListener, Input, OnDestroy, OnInit, ChangeDetectorRef,
  EventEmitter, Output, ViewEncapsulation, AfterViewInit, ViewChild
} from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { TreeService } from '../../services/tree/tree.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { HelperService } from '../../services/helper/helper.service';
import { IEditorConfig } from '../../interfaces/editor';
import { ICreationContext } from '../../interfaces/CreationContext';
import { Router } from '@angular/router';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Observable, throwError, forkJoin, Subscription, Subject, merge, of } from 'rxjs';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';
import { DialcodeService } from '../../services/dialcode/dialcode.service';
import { FormControl, FormGroup } from '@angular/forms';

let evidenceMimeType;
let ecm;

@Component({
  selector: 'lib-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() editorConfig: IEditorConfig | undefined;
  @Output() editorEmitter = new EventEmitter<any>();
  @ViewChild('modal') private modal;
  public questionComponentInput: any = {};
  public creationContext: ICreationContext;
  public collectionTreeNodes: any;
  public selectedNodeData: any = {};
  public templateList: any;
  public showConfirmPopup = false;
  public terms = false;
  public pageId: string;
  public pageStartTime;
  public rootFormConfig: any;
  public unitFormConfig: any;
  public searchFormConfig: any;
  public leafFormConfig: any;
  public relationFormConfig: any;
  public showLibraryPage = false;
  public libraryComponentInput: any = {};
  public questionlibraryInput: any = {};
  public editorMode;
  public collectionId;
  public isCurrentNodeFolder: boolean;
  public isCurrentNodeRoot: boolean;
  public isQumlPlayer: boolean;
  public showQuestionTemplatePopup = false;
  public deleteConfirmMessage;
  public showDeleteConfirmationPopUp = false;
  public showPreview = false;
  public actionType: string;
  private formStatusMapper: { [key: string]: boolean } = {};
  public targetFramework;
  public organisationFramework;
  public primaryCategoryDef: any;
  public collectionPrimaryCategoryDef: any;
  toolbarConfig: any;
  public buttonLoaders = {
    saveAsDraftButtonLoader: false,
    addFromLibraryButtonLoader: false,
    addQuestionFromLibraryButtonLoader: false,
    previewButtonLoader: false,
    showReviewComment: false
  };
  public contentComment: string;
  public showComment: boolean;
  public showReviewModal: boolean;
  public csvDropDownOptions: any = {};
  public showCsvUploadPopup = false;
  public objectType: string;
  public isObjectTypeCollection: any;
  public isCreateCsv = true;
  public isStatusReviewMode = false;
  public isEnableCsvAction: any;
  public isTreeInitialized: any;
  public ishierarchyConfigSet =  false;
  public addCollaborator: boolean;
  public publishchecklist: any;
  public isComponenetInitialized = false;
  public unSubscribeShowLibraryPageEmitter: Subscription;
  public unSubscribeshowQuestionLibraryPageEmitter: Subscription;
  public sourcingSettings: any;
  public setChildQuestion: any;
  public unsubscribe$ = new Subject<void>();
  public onComponentDestroy$ = new Subject<any>();
  public outcomeDeclaration: any;
  public levelsArray: any;
  constructor(private editorService: EditorService, public treeService: TreeService, private frameworkService: FrameworkService,
              private helperService: HelperService, public telemetryService: EditorTelemetryService, private router: Router,
              private toasterService: ToasterService, private dialcodeService: DialcodeService,
              public configService: ConfigService, private changeDetectionRef: ChangeDetectorRef) {
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.generateTelemetryEndEvent();
  }

  ngOnInit() {
    this.editorService.initialize(this.editorConfig);
    this.editorMode = this.editorService.editorMode;
    this.treeService.initialize(this.editorConfig);
    this.objectType = this.configService.categoryConfig[this.editorConfig.config.objectType];
    this.collectionId = _.get(this.editorConfig, 'context.identifier');
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.isObjectTypeCollection = this.objectType === 'questionSet' ? false : true;
    this.isStatusReviewMode = this.isReviewMode();

    if (this.objectType === 'question') {
      this.collectionId = _.get(this.editorConfig, 'context.collectionIdentifier');
      this.initializeFrameworkAndChannel();
      this.editorService.getCategoryDefinition(_.get(this.editorConfig, 'context.collectionPrimaryCategory'),
      this.editorConfig.context.channel, _.get(this.editorConfig, 'context.collectionObjectType'))
      .subscribe(
        (response) => {
          this.collectionPrimaryCategoryDef = response;
          this.getFrameworkDetails(this.collectionPrimaryCategoryDef);
          this.editorService.selectedChildren = {
            primaryCategory: _.get(this.editorConfig, 'config.primaryCategory'),
            mimeType: _.get(this.editorConfig, 'config.mimeType'),
            interactionType: _.get(this.editorConfig, 'config.interactionType')
          };
          const objectMetadata = _.get(response, 'result.objectCategoryDefinition.objectMetadata');
          if (objectMetadata.childrenConfig) {
            this.questionComponentInput.config = objectMetadata.childrenConfig[_.get(this.editorConfig, 'config.interactionType')] || {};
          }
          this.redirectToQuestionTab(_.get(this.editorConfig, 'config.mode'));
        }
      );
    } else {
      this.pageId = 'collection_editor';
      this.mergeCollectionExternalProperties().subscribe(
        (response) => {
          const hierarchyResponse = _.first(response);
          const collection = _.get(hierarchyResponse, `result.${this.objectType}`);
          this.toolbarConfig.title = collection.name;
          this.toolbarConfig.isAddCollaborator = (collection.createdBy === _.get(this.editorConfig, 'context.user.id'));
          this.initializeFrameworkAndChannel(collection);
        });
    }

    this.editorService.getCategoryDefinition(this.editorConfig.config.primaryCategory,
      this.editorConfig.context.channel, this.editorConfig.config.objectType)
      .subscribe(
        (response) => {
          // tslint:disable-next-line:max-line-length
          const dialcode = _.get(response, 'result.objectCategoryDefinition.objectMetadata.schema.properties.generateDIALCodes.default');
          this.toolbarConfig.showDialcode = dialcode ? dialcode.toLowerCase() : 'no';
          // tslint:disable-next-line:max-line-length
          const enableBulkUpload = _.get(response, 'result.objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection.enableBulkUpload');
          this.toolbarConfig.showBulkUploadBtn = enableBulkUpload ? enableBulkUpload : false;
          this.helperService.channelData$.subscribe(
            (channelResponse) => {
              this.primaryCategoryDef = response;
              if (this.objectType !== 'question') { this.sethierarchyConfig(response); }
            }
          );
        },
        (error) => {
          console.log(error);
        }
      );
    this.pageStartTime = Date.now();
    this.telemetryService.initializeTelemetry(this.editorConfig);
    this.telemetryService.telemetryPageId = this.pageId;
    this.telemetryService.start({ type: 'editor', pageid: this.telemetryService.telemetryPageId });
    this.unSubscribeShowLibraryPageEmitter = this.editorService.getshowLibraryPageEmitter()
      .subscribe(item => this.showLibraryComponentPage());
    this.unSubscribeshowQuestionLibraryPageEmitter = this.editorService.getshowQuestionLibraryPageEmitter()
    .subscribe(item => this.showQuestionLibraryComponentPage());
    this.treeService.treeStatus$.pipe(takeUntil(this.unsubscribe$)).subscribe((status) => {
      if (status === 'loaded') {
        this.getFrameworkDetails(this.primaryCategoryDef);
      }
    });
  }

  initializeFrameworkAndChannel(collection?: any) {
    this.organisationFramework = _.get(collection, 'framework') || _.get(this.editorConfig, 'context.framework');
    this.targetFramework = _.get(collection, 'targetFWIds') || _.get(this.editorConfig, 'context.targetFWIds');
    if (this.organisationFramework) {
      this.frameworkService.initialize(this.organisationFramework);
    }
    if (!_.isEmpty(this.targetFramework)) {
      this.frameworkService.getTargetFrameworkCategories(this.targetFramework);
    }
    const channel = _.get(collection, 'channel') || _.get(this.editorConfig, 'context.channel');
    this.helperService.initialize(channel);
  }

  async getFrameworkDetails(categoryDefinitionData) {
    let orgFWIdentifiers: any;
    let targetFWIdentifiers: any;
    let orgFWType: any;
    let targetFWType: any;
    orgFWIdentifiers = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.framework.enum') ||
      _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.framework.default');
    if (_.get(this.editorConfig, 'config.renderTaxonomy') === true) {
      const orgId = _.get(this.editorConfig, 'context.identifier');
      const data = await this.editorService.fetchOutComeDeclaration(orgId).toPromise();
      if (data?.result) {
        this.outcomeDeclaration = _.get(data?.result, 'questionset.outcomeDeclaration.levels');
        this.editorService.outcomeDeclaration = this.outcomeDeclaration;
        this.levelsArray = Object.keys(this.outcomeDeclaration);
      }
    }
    // tslint:disable-next-line:max-line-length
    this.publishchecklist = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.publishchecklist.properties') || _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.review.properties') || [];
    if (_.isEmpty(this.targetFramework || _.get(this.editorConfig, 'context.targetFWIds'))) {
      // tslint:disable-next-line:max-line-length
      targetFWIdentifiers = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.targetFWIds.default');
      if (_.isEmpty(targetFWIdentifiers)) {
        // tslint:disable-next-line:max-line-length
        targetFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.targetFWType');
        const channelFrameworks = _.get(this.helperService.channelInfo, 'frameworks');
        const channelFrameworksType = _.map(channelFrameworks, 'type');
        const channelFrameworksIdentifiers = _.map(_.get(this.helperService.channelInfo, 'frameworks'), 'identifier');
        const difference = _.difference(targetFWType, _.uniq(channelFrameworksType));

        if (targetFWType && channelFrameworksType && _.isEmpty(difference)) {
          this.targetFramework = _.get(_.first(_.filter(channelFrameworks, framework => {
            return framework.type === _.first(targetFWType);
          })), 'identifier');
          this.treeService.updateMetaDataProperty('targetFWIds', _.castArray(this.targetFramework));
          this.frameworkService.getTargetFrameworkCategories(_.castArray(this.targetFramework));
        } else if ((targetFWType && channelFrameworksType && !_.isEmpty(difference)) || _.isEmpty(channelFrameworksType)) {
          this.frameworkService.getFrameworkData(undefined, difference, undefined, 'Yes').subscribe(
            (targetResponse) => {
              this.targetFramework = _.get(_.first(_.get(targetResponse, 'result.Framework')), 'identifier');
              if (!_.isEmpty(this.targetFramework)) {
                this.treeService.updateMetaDataProperty('targetFWIds', _.castArray(this.targetFramework));
                this.frameworkService.getTargetFrameworkCategories(_.castArray(this.targetFramework));
              }
            }
          );
        }
      } else {
        this.frameworkService.getFrameworkData(undefined, undefined, targetFWIdentifiers).subscribe(
          (targetResponse) => {
            this.targetFramework = _.get(_.first(_.get(targetResponse, 'result.Framework')), 'identifier');
            if (!_.isEmpty(this.targetFramework)) {
              this.treeService.updateMetaDataProperty('targetFWIds', _.castArray(this.targetFramework));
              this.frameworkService.getTargetFrameworkCategories(_.castArray(this.targetFramework));
            }
          }
        );
      }
    }

    if (_.isEmpty(orgFWIdentifiers)) {
      let orgFrameworkList = [];
      orgFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
      const channelFrameworksType = _.map(_.get(this.helperService.channelInfo, 'frameworks'), 'type');
      const difference = _.difference(orgFWType, _.uniq(channelFrameworksType));
      if (channelFrameworksType) {
        orgFrameworkList = _.map(_.get(this.helperService.channelInfo, 'frameworks'), (framework) => {
          return { label: framework.name, identifier: framework.identifier };
        });
      }

      if (orgFWType && channelFrameworksType && _.isEmpty(difference)) {
        this.frameworkService.frameworkValues = orgFrameworkList;
        this.setEditorForms(categoryDefinitionData);
      } else if (orgFWType && channelFrameworksType && !_.isEmpty(difference) || _.isEmpty(channelFrameworksType)) {
        this.frameworkService.getFrameworkData(undefined, difference, undefined, 'Yes').subscribe(
          (response) => {
            this.frameworkService.frameworkValues = _.concat(_.map(_.get(response, 'result.Framework'), framework => {
              return { label: framework.name, identifier: framework.identifier };
            }), orgFrameworkList);
            this.setEditorForms(categoryDefinitionData);
          }, error => {
            console.log('error', error);
          }
        );
      } else if (this.organisationFramework) {
        this.setEditorForms(categoryDefinitionData);
      }
    } else {
      this.frameworkService.getFrameworkData(undefined, undefined, orgFWIdentifiers).subscribe(
        (response) => {
          this.frameworkService.frameworkValues = _.concat(_.map(_.get(response, 'result.Framework'), framework => {
            return { label: framework.name, identifier: framework.identifier };
          }));
          this.setEditorForms(categoryDefinitionData);
        }, error => {
          console.log('error', error);
        }
      );
    }
  }

  setEditorForms(categoryDefinitionData) {
    const formsConfigObj = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms');
    this.unitFormConfig = _.get(formsConfigObj, 'unitMetadata.properties');
    this.rootFormConfig = _.get(formsConfigObj, 'create.properties');
    let formData;
    if (this.rootFormConfig.length) {
      formData = this.rootFormConfig[0].fields || [];
      console.log(formData);
    }
    // if (_.get(this.editorConfig, 'config.renderTaxonomy') === true) {
    //   this.levelsArray.forEach((level, index) => {
    //     let obj = {
    //       // name: this.outcomeDeclaration[level].label,
    //       renderingHints: {
    //         class: 'grid three-column-grid hidden-sectionName',
    //       },
    //       fields: this.constructFields(level, index, this.outcomeDeclaration[level].label),
    //     };
    //     this.unitFormConfig.push(obj);
    //   });
    // }
    formData.forEach((field) => {
      if (field.code === 'evidenceMimeType') {
        evidenceMimeType = field.range;
        field.options = this.setEvidence;
        field.range = null;
      } else if (field.code === 'allowECM') {
        field.options = this.setAllowEcm;
      } else if (field.code === 'ecm') {
        ecm = field.options;
        field.options = this.setEcm;
      } else if (field.code === 'levels') {
        const defaultValue = [];
        this.levelsArray.forEach((level) => {
          defaultValue.push(this.outcomeDeclaration[level].label);
        });
        field.default = defaultValue;
      }
    });
    if ( this.objectType === 'questionset' && _.has(formsConfigObj, 'searchConfig')) {
        this.libraryComponentInput.searchFormConfig = _.get(formsConfigObj, 'searchConfig.properties');
    } else {
      this.libraryComponentInput.searchFormConfig = _.get(formsConfigObj, 'search.properties');
    }
    this.leafFormConfig = _.get(formsConfigObj, 'childMetadata.properties');
    this.relationFormConfig = _.get(formsConfigObj, 'relationalMetadata.properties');
  }

  ngAfterViewInit() {
    this.telemetryService.impression({
      type: 'edit', pageid: this.telemetryService.telemetryPageId, uri: this.router.url,
      duration: (Date.now() - this.pageStartTime) / 1000
    });
    this.isComponenetInitialized = true;
  }

  mergeCollectionExternalProperties(): Observable<any> {
    const requests = [];
    this.collectionTreeNodes = null;
    this.isTreeInitialized = true;
    requests.push(this.editorService.fetchCollectionHierarchy(this.collectionId));
    if (this.objectType === 'questionSet') {
      requests.push(this.editorService.readQuestionSet(this.collectionId));
    }
    return forkJoin(requests).pipe(tap(responseList => {
      const hierarchyResponse = _.first(responseList);
      this.collectionTreeNodes = {
        data: _.get(hierarchyResponse, `result.${this.objectType}`)
      };
      this.buttonLoaders.showReviewComment = this.showCommentAddedAgainstContent();
      if (_.isEmpty(this.collectionTreeNodes.data.children)) {
        this.toolbarConfig.hasChildren = false;
      } else {
        this.toolbarConfig.hasChildren = true;
      }

      if (this.objectType === 'questionSet') {
        const questionSetResponse = _.last(responseList);
        const data = _.get(questionSetResponse, _.toLower(`result.${this.objectType}`));
        this.collectionTreeNodes.data.instructions = data.instructions ? data.instructions : '';
      }
    }
    ));
  }
  sethierarchyConfig(primaryCatConfig) {
    let hierarchyConfig;
    if (_.get(primaryCatConfig, 'result.objectCategoryDefinition.objectMetadata.config')) {
      hierarchyConfig = _.get(primaryCatConfig, 'result.objectCategoryDefinition.objectMetadata.config.sourcingSettings.collection');
      if (!_.isEmpty(hierarchyConfig.children)) {
        hierarchyConfig.children = this.getHierarchyChildrenConfig(hierarchyConfig.children);
      }
      if (!_.isEmpty(hierarchyConfig.hierarchy)) {
        _.forEach(hierarchyConfig.hierarchy, (hierarchyValue) => {
          if (_.get(hierarchyValue, 'children')) {
            hierarchyValue.children = this.getHierarchyChildrenConfig(_.get(hierarchyValue, 'children'));
          }
        });
      }
    }
    this.editorConfig.config = _.assign(this.editorConfig.config, hierarchyConfig);
    if (_.get(this.editorConfig, 'config.renderTaxonomy') === true && _.isEmpty(_.get(this.collectionTreeNodes, 'data.children'))) {
      this.fetchFrameWorkDetails();
    } else {
      this.ishierarchyConfigSet = true;
    }
  }

  fetchFrameWorkDetails() {
    this.frameworkService.frameworkData$.pipe(
      takeUntil(this.onComponentDestroy$),
      filter(data => _.get(data, `frameworkdata.${this.frameworkService.organisationFramework}`)),
      take(1)
    ).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const orgFrameworkData = _.get(frameworkDetails, `frameworkdata.${this.frameworkService.organisationFramework}.categories`);
        const categoryInstanceData = _.find(orgFrameworkData, {code: _.get(this.editorConfig, 'config.categoryInstance')});
        this.collectionTreeNodes.data.children = _.get(categoryInstanceData, 'terms');
        this.ishierarchyConfigSet = true;
      }
    });
  }

  getHierarchyChildrenConfig(childrenData) {
    _.forEach(childrenData, (value, key) => {
      if (_.isEmpty(value)) {
        switch (key) {
          case 'Question':
            childrenData[key] = _.map(this.helperService.questionPrimaryCategories, 'name') || this.editorConfig.config.questionPrimaryCategories;
            break;
          case 'Content':
            childrenData[key] = _.map(this.helperService.contentPrimaryCategories, 'name') || [];
            break;
          case 'Collection':
            childrenData[key] = _.map(this.helperService.collectionPrimaryCategories, 'name') || [];
            break;
          case 'QuestionSet':
            childrenData[key] = _.map(this.helperService.questionsetPrimaryCategories, 'name') || [];
            break;
        }
      }
    });
    return childrenData;
  }

  toggleCollaboratorModalPoup() {
    this.isEnableCsvAction = true;
    if (this.addCollaborator) {
      this.addCollaborator = false;
    } else if (!this.addCollaborator) {
      this.addCollaborator = true;
    } else {
    }
  }

  toolbarEventListener(event) {
    this.actionType = event.button;
    switch (event.button) {
      case 'saveContent':
        this.buttonLoaders.saveAsDraftButtonLoader = true;
        this.saveContent().then((message: string) => {
          this.buttonLoaders.saveAsDraftButtonLoader = false;
          this.toasterService.success(message);
          this.isEnableCsvAction = true;
          if (_.get(this.editorConfig, 'config.enableQuestionCreation') === false) {
            this.mergeCollectionExternalProperties().subscribe(response => {
              this.redirectToChapterListTab({
                collection: _.get(this.collectionTreeNodes, 'data')
              });
            });

          }
        }).catch(((error: string) => {
          this.buttonLoaders.saveAsDraftButtonLoader = false;
          this.isEnableCsvAction = false;
          this.toasterService.error(error);
        }));
        break;
      case 'previewContent':
        this.previewContent();
        break;
      case 'addFromLibrary':
        this.showLibraryComponentPage();
        break;
      case 'showQuestionLibraryPage':
        this.showQuestionLibraryComponentPage();
        break;
      case 'submitContent':
        this.submitHandler();
        break;
      case 'removeContent':
        this.deleteConfirmMessage = this.configService.labelConfig?.lbl?.confirmDeleteNode;
        this.showDeleteConfirmationPopUp = true;
        break;
      case 'editContent':
        this.redirectToQuestionTab('edit');
        break;
      case 'rejectContent':
        this.rejectContent(event.comment);
        break;
      case 'publishContent':
        this.publishContent(event);
        break;
      case 'onFormStatusChange':
        this.onFormStatusChange(event.event);
        if (this.isObjectTypeCollection) {
          this.handleCsvDropdownOptionsOnCollection();
        }
        break;
      case 'onFormValueChange':
        this.updateToolbarTitle(event);
        break;
      case 'backContent':
        this.redirectToChapterListTab();
        break;
      case 'sendForCorrections':
        this.redirectToChapterListTab({ comment: event.comment });
        break;
      case 'sourcingApprove':
        this.sourcingApproveContent(event);
        break;
      case 'sourcingReject':
        this.sourcingRejectContent({ comment: event.comment });
        break;
      case 'addCollaborator':
        this.toggleCollaboratorModalPoup();
        break;
      case 'showReviewcomments':
        this.showReviewModal = !this.showReviewModal;
        break;
      case 'reviewContent':
        this.redirectToQuestionTab('review');
        break;
      case 'pagination':
        this.pageId = 'pagination';
        break;
      // case 'showCorrectioncomments':
        // this.contentComment = _.get(this.editorConfig, 'context.correctionComments')
        // this.showReviewModal = !this.showReviewModal;
        // break;
      default:
        break;
    }
  }

  redirectToChapterListTab(data?: any) {
    this.editorEmitter.emit({
      close: true, library: 'collection_editor', action: this.actionType, identifier: this.collectionId,
      ...data
    });
  }

  updateToolbarTitle(data: any) {
    const selectedNode = this.treeService.getActiveNode();
    if (!_.isEmpty(data?.event?.name) && selectedNode?.data?.root) {
      this.toolbarConfig.title = data.event.name;
    } else if (_.isEmpty(data?.event?.name) && selectedNode?.data?.root) {
      this.toolbarConfig.title = 'Untitled';
    }
  }

  showLibraryComponentPage() {
    if (this.editorService.checkIfContentsCanbeAdded('add')) {
      this.buttonLoaders.addFromLibraryButtonLoader = true;
      this.saveContent().then(res => {
        this.libraryComponentInput.collectionId = this.collectionId;
        this.buttonLoaders.addFromLibraryButtonLoader = false;
        this.pageId = 'library';
      }).catch(err => {
        this.toasterService.error(err);
        this.buttonLoaders.addFromLibraryButtonLoader = false;
      });
    }
  }
  showQuestionLibraryComponentPage() {
    if (_.isUndefined(this.libraryComponentInput.searchFormConfig) || _.isEmpty(this.libraryComponentInput.searchFormConfig)) {
      this.toasterService.error(_.get(this.configService, 'labelConfig.err.searchConfigNotFound'));
      return;
    }
    if (this.editorService.checkIfContentsCanbeAdded('add')) {
      const questionCategory = [];
      this.buttonLoaders.addQuestionFromLibraryButtonLoader = true;
      if (!_.isUndefined(this.editorService.templateList) &&
        _.isArray(this.editorService.templateList)) {
          _.forEach(this.editorService.templateList, (template) => {
            questionCategory.push({name: template, targetObjectType: 'Question'});
          });
        }
      this.saveContent().then((message: string) => {
        const activeNode = this.treeService.getActiveNode();
        this.buttonLoaders.addQuestionFromLibraryButtonLoader = false;
        this.questionlibraryInput = {
          libraryLabels: {
            itemType: _.get(this.configService, 'labelConfig.lbl.questionsetAddFromLibraryItemLabel'),
            collectionType: _.get(this.configService, 'labelConfig.lbl.questionsetAddFromLibraryCollectionLabel')
          },
          targetPrimaryCategories: questionCategory,
          collectionId: this.collectionId,
          existingcontentCounts: this.editorService.getContentChildrens().length,
          collection: activeNode?.data?.metadata,
          framework: this.organisationFramework,
          editorConfig: this.editorConfig,
          searchFormConfig:  this.libraryComponentInput.searchFormConfig
        };
        this.pageId = 'question_library';
        console.log(this.questionlibraryInput);
      }).catch(((error: string) => {
        this.toasterService.error(error);
        this.buttonLoaders.addQuestionFromLibraryButtonLoader = false;
      }));
    }
  }

  libraryEventListener(event: any) {
    this.mergeCollectionExternalProperties().subscribe((res: any) => {
      this.pageId = 'collection_editor';
      this.telemetryService.telemetryPageId = this.pageId;
      this.isEnableCsvAction = true;
      this.isComponenetInitialized = true;
    });
  }

  onQuestionLibraryChange(event: any) {
    switch (event.action) {
      case 'addBulk':
        this.addResourceToQuestionset(event.collectionIds, event.resourceType);
        break;
      case 'back':
        this.libraryEventListener({});
        break;
    }
  }

  public addResourceToQuestionset(contentId, resourceType) {
    const activeNode = this.treeService.getActiveNode();
    const children: any[] = _.isArray(contentId) ? contentId : [contentId];
    if (resourceType === 'Question') {
      if (activeNode && activeNode.data.id) {
        this.editorService.addResourceToQuestionset(this.collectionId, activeNode.data.id,
          children).subscribe(res => {
          if (_.get(res, 'responseCode') === 'OK') {
            this.libraryEventListener({});
          }
        }, err => {
          const errInfo = {
            errorMsg: _.get(this.configService, 'labelConfig.messages.error.043')
          };
          return throwError(this.editorService.apiErrorHandling(err, errInfo));
        });
      }
    }
  }

  saveContent() {
    return new Promise(async (resolve, reject) => {
      if (!this.validateFormStatus()) {
        return reject(_.get(this.configService, 'labelConfig.messages.error.029'));
      }
      const nodesModified = _.get(this.editorService.getCollectionHierarchy(), 'nodesModified');
      if (this.objectType.toLowerCase() === 'questionset') {
        const maxScore = await this.editorService.getMaxScore();
        this.treeService.updateMetaDataProperty('maxScore', maxScore);
      }
      this.editorService.updateHierarchy()
        .pipe(map(data => _.get(data, 'result'))).subscribe(response => {
          if (this.toolbarConfig.showDialcode === 'yes') {
            this.dialcodeService.highlightNodeForInvalidDialCode(response, nodesModified, this.collectionId);
          }
          if (!_.isEmpty(response.identifiers)) {
            this.treeService.replaceNodeId(response.identifiers);
          }

          this.treeService.clearTreeCache();
          this.treeService.nextTreeStatus('saved');
          resolve(_.get(this.configService, 'labelConfig.messages.success.001'));
        }, err => {
          reject(_.get(this.configService, 'labelConfig.messages.error.001'));
        });
    });
  }

  submitHandler() {
    if (!this.validateFormStatus()) {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.005'));
      return;
    } else if (this.toolbarConfig.showDialcode === 'yes') {
      if (this.dialcodeService.validateUnitsDialcodes()) {
        this.showConfirmPopup = true;
      } else {
        this.toasterService.warning(_.get(this.configService, 'labelConfig.messages.warning.001'));
      }
    } else {
      this.showConfirmPopup = true;
    }
  }

  validateFormStatus() {
    const isValid = _.every(this.formStatusMapper, Boolean);
    if (isValid) { return true; }
    _.forIn(this.formStatusMapper, (value, key) => {
      if (value) {
        this.treeService.highlightNode(key, 'remove');
      } else {
        this.treeService.highlightNode(key, 'add');
      }
    });
    return false;
  }

  previewContent() {
    this.buttonLoaders.previewButtonLoader = true;
    if (!this.isStatusReviewMode) {
      this.saveContent().then(res => {
        this.setUpdatedTreeNodeData();
      }).catch(err => {
        this.toasterService.error(err);
        this.buttonLoaders.previewButtonLoader = false;
      });
    } else {
      this.setUpdatedTreeNodeData();
    }
  }
  sendForReview() {
    this.saveContent().then(messg => {
      this.editorService.reviewContent(this.collectionId).subscribe(data => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.002'));
        this.redirectToChapterListTab();
      }, err => {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.002'));
      });
    }).catch(err => this.toasterService.error(err));
  }
  rejectContent(comment) {
    const editableFields = _.get(this.editorConfig.config, 'editableFields');
    if (this.editorMode === 'orgreview' && editableFields && !_.isEmpty(editableFields[this.editorMode])) {
      if (!this.validateFormStatus()) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.029'));
        return false;
      }
      this.editorService.updateCollection(this.collectionId).subscribe(res => {
        this.editorService.submitRequestChanges(this.collectionId, comment).subscribe(res => {
          this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.003'));
          this.redirectToChapterListTab();
        }, err => {
          this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.003'));
        });
      }, err => {
        this.toasterService.error(err);
      });
    } else {
      this.editorService.submitRequestChanges(this.collectionId, comment).subscribe(res => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.003'));
        this.redirectToChapterListTab();
      }, err => {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.003'));
      });
    }
  }

  publishContent(event) {
    const editableFields = _.get(this.editorConfig, 'config.editableFields');
    if (this.editorMode === 'orgreview' && editableFields && !_.isEmpty(editableFields[this.editorMode])) {
      if (!this.validateFormStatus()) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.029'));
        return false;
      }
      this.editorService.updateCollection(this.collectionId).subscribe(res => {
        this.editorService.publishContent(this.collectionId, event).subscribe(response => {
          this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.004'));
          this.redirectToChapterListTab();
        }, err => {
          this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.004'));
        });
      }, err => {
        this.toasterService.error(err);
      });
    } else {
      this.editorService.publishContent(this.collectionId, event).subscribe(res => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.004'));
        this.redirectToChapterListTab();
      }, err => {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.004'));
      });
    }
  }
  sourcingApproveContent(event) {
    const editableFields = _.get(this.editorConfig.config, 'editableFields');
    // tslint:disable-next-line:max-line-length
    if (this.editorMode === 'sourcingreview' && ((editableFields && !_.isEmpty(editableFields[this.editorMode])) || !_.isEmpty(this.publishchecklist))) {
      if (!this.validateFormStatus()) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.029'));
        return false;
      }
      this.editorService.updateCollection(this.collectionId, event).subscribe(res => {
          this.redirectToChapterListTab();
      }, err => {
        this.toasterService.error(err);
      });
    } else {
        this.redirectToChapterListTab();
    }
  }
  sourcingRejectContent(obj) {
    const editableFields = _.get(this.editorConfig.config, 'editableFields');
    if (this.editorMode === 'sourcingreview' && editableFields && !_.isEmpty(editableFields[this.editorMode])) {
      if (!this.validateFormStatus()) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.029'));
        return false;
      }
      this.editorService.updateCollection(this.collectionId).subscribe(res => {
          this.redirectToChapterListTab(obj);
      }, err => {
        this.toasterService.error(err);
      });
    } else {
        this.redirectToChapterListTab(obj);
    }
  }
  setUpdatedTreeNodeData() {
    this.editorService.fetchCollectionHierarchy(this.collectionId).subscribe((res) => {
      this.collectionTreeNodes = {
        data: _.get(res, `result.${this.objectType}`)
      };
      this.updateTreeNodeData();
      this.buttonLoaders.previewButtonLoader = false;
      this.showPreview = true;
      setTimeout(() => {
        const element: any = document.querySelector('#previewPlayerContainer');
        if (element) {
          element.focus();
        }
      }, 500);
    }, error => {
      this.buttonLoaders.previewButtonLoader = false;
      this.toasterService.error(_.get(error, 'error.params.errmsg'));
    });
  }
  updateTreeNodeData() {
    const treeNodeData = _.get(this.treeService.getFirstChild(), 'data.metadata');
    if (!treeNodeData.timeLimits) {
      treeNodeData.timeLimits = {};
    }
    if (treeNodeData.maxTime) {
      treeNodeData.timeLimits.maxTime = this.helperService.hmsToSeconds(treeNodeData.maxTime);
    }
    if (treeNodeData.warningTime) {
      treeNodeData.timeLimits.warningTime = this.helperService.hmsToSeconds(treeNodeData.warningTime);
    }
    this.collectionTreeNodes.data = _.merge(this.collectionTreeNodes.data, _.omit(treeNodeData, ['childNodes']));
  }
  treeEventListener(event: any) {
    this.actionType = event.type;
    this.updateTreeNodeData();
    if (this.isObjectTypeCollection) {
      this.handleCsvDropdownOptionsOnCollection();
    }
    switch (event.type) {
      case 'nodeSelect':
        this.updateSubmitBtnVisibility();
        this.selectedNodeData = _.cloneDeep(event.data);
        this.isCurrentNodeFolder = _.get(this.selectedNodeData, 'folder');
        this.isCurrentNodeRoot = _.get(this.selectedNodeData, 'data.root');
        // TODO: rethink below line code
        this.isQumlPlayer = _.get(this.selectedNodeData, 'data.metadata.mimeType') === 'application/vnd.sunbird.question';
        this.setTemplateList();
        this.changeDetectionRef.detectChanges();
        break;
      case 'deleteNode':
        this.deleteConfirmMessage = this.configService.labelConfig?.lbl?.confirmDeleteNode;
        if (!event.isContent && _.has(this.editorConfig.config, 'hierarchy.level1')) {
          // tslint:disable-next-line:max-line-length
          this.deleteConfirmMessage = _.replace(this.deleteConfirmMessage, 'Node', _.get(this.editorConfig.config, 'hierarchy.level1.name'));
        }
        this.showDeleteConfirmationPopUp = true;
        break;
      case 'createNewContent':
        this.setChildQuestion = event.isChildQuestion;
        if (this.editorService.checkIfContentsCanbeAdded('create')) {
          this.buttonLoaders.addFromLibraryButtonLoader = true;
          this.templateList = this.editorService.templateList;
          this.saveContent().then((message: string) => {
            this.buttonLoaders.addFromLibraryButtonLoader = false;
            this.showQuestionTemplatePopup = true;
          }).catch(((error: string) => {
            this.toasterService.error(error);
            this.buttonLoaders.addFromLibraryButtonLoader = false;
          }));
        }
        break;
      default:
        break;
    }
  }

  setTemplateList() {
    if (this.isCurrentNodeRoot) {
      this.templateList = _.flatMap(_.get(this.editorConfig, 'config.children'));
    } else {
      this.templateList = _.flatMap(
        _.get(this.editorService.editorConfig.config, `hierarchy.level${this.selectedNodeData.getLevel() - 1}.children`)
      );
    }
    this.editorService.templateList = this.templateList;
  }

  deleteNode() {
    const activeNode = this.treeService.getActiveNode();
    delete this.formStatusMapper[activeNode.data.id];
    const children = this.treeService.getChildren();
    _.forEach(children, (node) => {
      if (_.has(this.formStatusMapper, node.data.id)) {
        delete this.formStatusMapper[node.data.id];
      }
    });
    this.treeService.removeNode();
    this.updateSubmitBtnVisibility();
    this.showDeleteConfirmationPopUp = false;
    this.collectionTreeNodes.data.childNodes = _.filter(this.collectionTreeNodes.data.childNodes, (key) => {
      return key !== activeNode.data.id;
    });
  }

  updateSubmitBtnVisibility() {
    const rootFirstChildNode = this.treeService.getFirstChild();
    if (rootFirstChildNode && !rootFirstChildNode.children) {
      this.toolbarConfig.hasChildren = false;
    } else {
      this.toolbarConfig.hasChildren = true;
    }
  }

  generateTelemetryEndEvent() {
    const telemetryEnd = {
      type: 'editor',
      pageid: this.telemetryService.telemetryPageId,
      mode: this.editorMode,
      duration: _.toString((Date.now() - this.pageStartTime) / 1000)
    };
    this.telemetryService.end(telemetryEnd);
  }

  handleTemplateSelection($event) {
    const selectedQuestionType = $event;
    this.showQuestionTemplatePopup = false;
    if (selectedQuestionType && selectedQuestionType.type === 'close') {
      return false;
    }
    // this will activate the save and cancel button
    this.editorConfig.config.showSourcingStatus = false;
    // tslint:disable-next-line:max-line-length
    this.editorService.getCategoryDefinition(selectedQuestionType, null, 'Question')
    .subscribe((res) => {
      const selectedtemplateDetails = res.result.objectCategoryDefinition;
      this.editorService.selectedChildren['label']=selectedtemplateDetails.label;
      const selectedTemplateFormFields = _.get(selectedtemplateDetails, 'forms.create.properties');
      if (!_.isEmpty(selectedTemplateFormFields)) {
        const questionCategoryConfig = selectedTemplateFormFields;
        questionCategoryConfig.forEach(field => {
          if (field.code === 'evidenceMimeType') {
            evidenceMimeType = field.range;
            field.options = this.setEvidence;
            field.range = null;
          }
        });
        this.leafFormConfig = questionCategoryConfig;
      }

      const catMetaData = _.get(selectedtemplateDetails, 'objectMetadata');
      this.sourcingSettings = _.get(catMetaData, 'config.sourcingSettings') || {};
      !_.isUndefined(this.editorConfig.config.renderTaxonomy) ? (this.questionComponentInput.config ={maximumOptions:_.get(catMetaData, 'config.maximumOptions')}) : '' ;
      if (!_.has(this.sourcingSettings, 'enforceCorrectAnswer')) {
        this.sourcingSettings.enforceCorrectAnswer = true;
      }
      if (_.isEmpty(_.get(catMetaData, 'schema.properties.interactionTypes.items.enum'))) {
        // this.toasterService.error(this.resourceService.messages.emsg.m0026);
        this.editorService.selectedChildren = {
          primaryCategory: selectedQuestionType,
          mimeType: catMetaData.schema.properties.mimeType.enum[0],
          interactionType: null
        };
        this.redirectToQuestionTab(undefined, 'default');
      } else {
        const interactionTypes = catMetaData.schema.properties.interactionTypes.items.enum;
        this.editorService.selectedChildren = {
          primaryCategory: selectedQuestionType,
          mimeType: catMetaData.schema.properties.mimeType.enum[0],
          interactionType: interactionTypes[0]
        };
        this.redirectToQuestionTab(undefined, interactionTypes[0]);
      }
    },(error) => {
      const errInfo = {
        errorMsg: _.get(this.configService, 'labelConfig.messages.error.006'),
      };
      return throwError(this.editorService.apiErrorHandling(error, errInfo))
    });
  }

  redirectToQuestionTab(mode, interactionType?) {
    let questionId = !_.isUndefined(mode) ? this.selectedNodeData?.data?.metadata?.identifier : undefined;
    let questionCategory = '';
    if (this.objectType === 'question') {
      questionId = _.get(this.editorConfig, 'context.identifier');
      interactionType = _.get(this.editorConfig, 'config.interactionType');
      questionCategory = _.get(this.editorConfig, 'config.questionCategory');
      this.creationContext =  {
        mode: mode,
        objectType: this.objectType,
        collectionObjectType: _.get(this.editorConfig, 'context.collectionObjectType'),
        isReadOnlyMode: _.get(this.editorConfig, 'config.isReadOnlyMode'),
        unitIdentifier: _.get(this.editorConfig, 'context.unitIdentifier'),
        correctionComments: _.get(this.editorConfig, 'context.correctionComments'),
        editableFields: _.get(this.editorConfig, 'config.editableFields')
      };
    }

    this.questionComponentInput = {
      ...this.questionComponentInput,
      questionSetId: this.collectionId,
      questionId: questionId,
      type: interactionType,
      setChildQueston:mode === 'edit' ? false : this.setChildQuestion,
      category: questionCategory,
      creationContext: this.creationContext, // Pass the creation context to the question-component
      creationMode: mode
    };

    if(!_.isUndefined(mode) && !_.isUndefined(this.editorConfig.config.renderTaxonomy)){
      this.editorService.selectedChildren = {
        primaryCategory: _.get(this.selectedNodeData, 'data.metadata.primaryCategory'),
        interactionType: _.get(this.selectedNodeData, 'data.metadata.interactionTypes[0]')
      };
        this.questionComponentInput = {
          ...this.questionComponentInput,
          creationContext:{
            isReadOnlyMode: mode !== 'edit' ? true : false,
            correctionComments:this.contentComment
        }
      }
      this.editorService.getCategoryDefinition(this.selectedNodeData.data.metadata.primaryCategory, null, 'Question')
      .subscribe((res) => {
        const selectedtemplateDetails = res.result.objectCategoryDefinition;
        this.editorService.selectedChildren['label']=selectedtemplateDetails.label;
        const selectedTemplateFormFields = _.get(selectedtemplateDetails, 'forms.create.properties');
        this.questionComponentInput.config ={maximumOptions:_.get(selectedtemplateDetails, 'objectMetadata.config.maximumOptions')}
        if (!_.isEmpty(selectedTemplateFormFields)) {
          const questionCategoryConfig = selectedTemplateFormFields;
          questionCategoryConfig.forEach(field => {
            if (field.code === 'evidenceMimeType') {
              evidenceMimeType = field.range;
              field.options = this.setEvidence;
              field.range = null;
            }
          });
          this.leafFormConfig = questionCategoryConfig;
        }
        const catMetaData = selectedtemplateDetails.objectMetadata;
        this.sourcingSettings = catMetaData?.config?.sourcingSettings || {};
        if (!_.has(this.sourcingSettings, 'enforceCorrectAnswer')) {
          this.sourcingSettings.enforceCorrectAnswer = true;
        }
        this.pageId = 'question';
      },(error) => {
        const errInfo = {
          errorMsg: _.get(this.configService, 'labelConfig.messages.error.006'),
        };
        return throwError(this.editorService.apiErrorHandling(error, errInfo))
      });
    }
    else{
    this.pageId = 'question';
    }
  }

  questionEventListener(event: any) {
    if (event.type === 'createNewContent') {
      this.treeEventListener(event)
    }
    this.selectedNodeData = undefined;
    if (this.objectType === 'question') {
      this.editorEmitter.emit({
        close: true, library: 'collection_editor', action: event.actionType, identifier: event.identifier
      });
    } else {
      this.mergeCollectionExternalProperties().subscribe((res: any) => {
        this.pageId = 'collection_editor';
        this.telemetryService.telemetryPageId = this.pageId;
        this.isEnableCsvAction = true;
      });
    }
  }

  get contentPolicyUrl() {
    return this.editorService.contentPolicyUrl;
  }

  showCommentAddedAgainstContent() {
    // tslint:disable-next-line:max-line-length
    if (this.collectionTreeNodes.data.status === 'Draft' && this.collectionTreeNodes.data.prevStatus  === 'Review' && _.has(this.collectionTreeNodes.data, 'rejectComment')) {
      this.contentComment = _.get(this.collectionTreeNodes.data, 'rejectComment');
      return true;
    } else if (_.get(this.editorService, 'editorConfig.config.showCorrectionComments')) {
      this.contentComment = _.get(this.editorConfig, 'context.correctionComments');
      return true;
    }
    return false;
  }
  handleCsvDropdownOptionsOnCollection() {
    if (this.isTreeInitialized) {
      this.isEnableCsvAction = true;
      this.isTreeInitialized = false;
    } else {
      this.isEnableCsvAction = false;
    }
    this.setCsvDropDownOptionsDisable(true);
  }
  onClickFolder() {
    if (this.isComponenetInitialized) {
      this.isComponenetInitialized = false;
      this.setCsvDropDownOptionsDisable();
    } else if (this.isEnableCsvAction) {
     this.setCsvDropDownOptionsDisable();
  }
  }
  setCsvDropDownOptionsDisable(disable?) {
    const status = this.editorService.getHierarchyFolder().length ? true : false;
    this.csvDropDownOptions.isDisableCreateCsv = disable ? disable : status;
    this.csvDropDownOptions.isDisableUpdateCsv = disable ? disable : !status;
    this.csvDropDownOptions.isDisableDownloadCsv = disable ? disable : !status;
  }
  downloadHierarchyCsv() {
    this.editorService.downloadHierarchyCsv(this.collectionId).subscribe(res => {
      const tocUrl = _.get(res, 'result.collection.tocUrl');
      this.downloadCSVFile(tocUrl);
    }, error => {
      this.toasterService.error(_.get(error, 'error.params.errmsg'));
    });
  }
  isReviewMode() {
    return  _.includes([ 'review', 'read', 'sourcingreview', 'orgreview' ], this.editorService.editorMode);
   }
  downloadCSVFile(tocUrl) {
    const downloadConfig = {
      blobUrl: tocUrl,
      successMessage: false,
      fileType: 'csv',
      fileName: this.collectionId
    };
    window.open(downloadConfig.blobUrl, '_blank');
    /*this.editorService.downloadBlobUrlFile(downloadConfig);*/
  }
  hanndleCsvEmitter(event) {
    switch (event.type) {
      case 'closeModal':
        this.showCsvUploadPopup = false;
        break;
      case 'updateHierarchy':
        this.mergeCollectionExternalProperties().subscribe((res: any) => {
          this.pageId = 'collection_editor';
          this.telemetryService.telemetryPageId = this.pageId;
          this.isEnableCsvAction = true;
        });
        break;
      case 'createCsv':
        this.showCsvUploadPopup = true;
        this.isCreateCsv = true;
        break;
      case 'updateCsv':
        this.showCsvUploadPopup = true;
        this.isCreateCsv = false;
        break;
      case 'downloadCsv':
        this.downloadHierarchyCsv();
        break;
      default:
        break;
    }
  }

  onFormStatusChange(form) {
    const selectedNode = this.treeService.getActiveNode();
    if (selectedNode && selectedNode.data.id) {
      this.formStatusMapper[selectedNode.data.id] = form.isValid;
    }
  }

  assignPageEmitterListener(event: any) {
    this.pageId = 'collection_editor';
  }

  ngOnDestroy() {
    if (this.telemetryService) {
      this.generateTelemetryEndEvent();
    }
    if (this.treeService) {
      this.treeService.clearTreeCache();
    }
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
    if (this.unSubscribeShowLibraryPageEmitter) {
      this.unSubscribeShowLibraryPageEmitter.unsubscribe();
    }
    if (this.unSubscribeshowQuestionLibraryPageEmitter) {
      this.unSubscribeshowQuestionLibraryPageEmitter.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  setEvidence(control, depends: FormControl[], formGroup: FormGroup, loading, loaded) {
    control.isVisible = 'no';
    control.range = evidenceMimeType;
    return merge(..._.map(depends, depend => depend.valueChanges)).pipe(
        switchMap((value: any) => {
            if (!_.isEmpty(value) && _.toLower(value) === 'yes') {
                control.isVisible = 'yes';
                return of({range: evidenceMimeType});
            } else {
                control.isVisible = 'no';
                return of(null);
            }
        })
    );
  }

  setEcm(control, depends: FormControl[], formGroup: FormGroup, loading, loaded) {
    control.isVisible = 'no';
    control.options = ecm;
    return merge(..._.map(depends, depend => depend.valueChanges)).pipe(
        switchMap((value: any) => {
            if (!_.isEmpty(value) && _.toLower(value) === 'yes') {
                control.isVisible = 'yes';
                return of({options: ecm});
            } else {
                control.isVisible = 'no';
                return of(null);
            }
        })
    );
  }

  setAllowEcm(control, depends: FormControl[]) {
    control.isVisible = 'no';
    const response = merge(..._.map(depends, depend => depend.valueChanges)).pipe(
        switchMap((value: any) => {
             if (!_.isEmpty(value) && _.toLower(value) === 'self' ) {
                control.isVisible = 'no';
                return of(null);
             } else {
                control.isVisible = 'yes';
                return of(null);
             }
        })
    );
    return response;
  }

  constructFields(level, index, labelName) {
    let levelName = level.toLowerCase();
    let fieldArray = [
      {
        code: levelName,
        name: levelName,
        label: `Level ${index + 1}`,
        placeholder: `Level ${index + 1}`,
        description: `Level ${index + 1}`,
        dataType: 'text',
        inputType: 'text',
        editable: false,
        default: labelName,
        required: true,
        visible: true,
        renderingHints: {
          class: 'sb-g-col-lg-1 required',
        },
        validations: [
          {
            type: 'maxLength',
            value: '120',
            message: 'Entered name is too long',
          },
          {
            type: 'required',
            message: 'Name is required',
          },
        ],
      },
      {
        code: `${levelName}min`,
        name: `${levelName}min`,
        label: 'Minimum',
        placeholder: 'Minimum',
        description: 'Minimum',
        dataType: 'text',
        inputType: 'text',
        editable: true,
        required: true,
        visible: true,
        renderingHints: {
          class: 'sb-g-col-lg-1 required',
        },
        validations: [
          {
            type: 'maxLength',
            value: '120',
            message: 'Entered name is too long',
          },
          {
            type: 'required',
            message: 'Name is required',
          },
        ],
      },
      {
        code: `${levelName}max`,
        name: `${levelName}max`,
        label: 'Maximum',
        placeholder: 'Maximum',
        description: 'Maximum',
        dataType: 'text',
        inputType: 'text',
        editable: true,
        required: true,
        visible: true,
        renderingHints: {
          class: 'sb-g-col-lg-1- required',
        },
        validations: [
          {
            type: 'maxLength',
            value: '120',
            message: 'Entered name is too long',
          },
          {
            type: 'required',
            message: 'Name is required',
          },
        ],
      },
    ];
    return fieldArray;
  }

}
