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
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';
@Component({
  selector: 'lib-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() editorConfig: IEditorConfig | undefined;
  @Output() editorEmitter = new EventEmitter<any>();
  @ViewChild('modal', { static: false }) private modal;
  public questionComponentInput: any = {};
  public collectionTreeNodes: any;
  public selectedNodeData: any = {};
  public templateList: any;
  public showConfirmPopup = false;
  public terms = false;
  public pageId = 'collection_editor';
  public pageStartTime;
  public rootFormConfig: any;
  public unitFormConfig: any;
  public leafFormConfig: any;
  public showLibraryPage = false;
  public libraryComponentInput: any = {};
  public editorMode;
  public collectionId;
  public isCurrentNodeFolder: boolean;
  public isCurrentNodeRoot: boolean;
  public isQumlPlayer: boolean;
  public showQuestionTemplatePopup = false;
  public showDeleteConfirmationPopUp = false;
  public showPreview = false;
  public actionType: string;
  private formStatusMapper: { [key: string]: boolean } = {};
  public questionIds: string[];
  toolbarConfig: any;
  public buttonLoaders = {
    saveAsDraftButtonLoader: false,
    addFromLibraryButtonLoader: false,
    previewButtonLoader: false
  };
  constructor(private editorService: EditorService, public treeService: TreeService, private frameworkService: FrameworkService,
              private helperService: HelperService, public telemetryService: EditorTelemetryService, private router: Router,
              private toasterService: ToasterService,
              public configService: ConfigService,
              private changeDetectionRef: ChangeDetectorRef) {
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.generateTelemetryEndEvent();
  }

  ngOnInit() {
    this.editorService.initialize(this.editorConfig);
    this.editorMode = this.editorService.editorMode;
    this.treeService.initialize(this.editorConfig);
    this.collectionId = _.get(this.editorConfig, 'context.identifier');
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.fetchCollectionHierarchy().subscribe(
      (response) => {
        const collection = _.get(response, `result.${this.configService.categoryConfig[this.editorConfig.config.objectType]}`);
        this.toolbarConfig.title = collection.name;
        const organisationFramework = _.get(this.editorConfig, 'context.framework') || _.get(collection, 'framework');
        const targetFramework = _.get(this.editorConfig, 'context.targetFWIds') || _.get(collection, 'targetFWIds');
        if (organisationFramework) {
          this.frameworkService.initialize(organisationFramework);
        }
        if (!_.isEmpty(targetFramework)) {
          this.frameworkService.getTargetFrameworkCategories(targetFramework);
        }
        const channel = _.get(collection, 'channel') || _.get(this.editorConfig, 'context.channel');
        this.helperService.initialize(channel, _.get(this.editorConfig, 'context.defaultLicense'));
      });
    this.editorService.getCategoryDefinition(this.editorConfig.config.primaryCategory,
      this.editorConfig.context.channel, this.editorConfig.config.objectType)
      .subscribe(
        (response) => {
          this.getFrameworkDetails(response);
        },
        (error) => {
          console.log(error);
        }
      );
    this.pageStartTime = Date.now();
    this.telemetryService.initializeTelemetry(this.editorConfig);
    this.telemetryService.telemetryPageId = this.pageId;
    this.telemetryService.start({ type: 'editor', pageid: this.telemetryService.telemetryPageId });
    this.editorService.getshowLibraryPageEmitter()
      .subscribe(item => this.showLibraryComponentPage());
  }

  getFrameworkDetails(categoryDefinitionData) {
    let orgFWIdentifiers: any;
    let orgFWType: any;
    let targetFWType: any;
    orgFWIdentifiers = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.framework.default');
    if (_.isEmpty(_.get(this.editorConfig, 'context.targetFWIds'))) {
      targetFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.schema.properties.targetFWIds.default');
    }
    const frameworkReq = [];
    if (_.isEmpty(orgFWIdentifiers)) {
      orgFWType = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.objectMetadata.config.frameworkMetadata.orgFWType');
      frameworkReq.push(this.frameworkService.getFrameworkData(this.editorConfig.context.channel, orgFWType));
      frameworkReq.push(this.frameworkService.getFrameworkData(undefined, orgFWType));
    } else {
      frameworkReq.push(this.frameworkService.getFrameworkData(this.editorConfig.context.channel, undefined, orgFWIdentifiers));
      frameworkReq.push(this.frameworkService.getFrameworkData(undefined, undefined, orgFWIdentifiers));
    }
    if (!_.isEmpty(frameworkReq)) {
      // tslint:disable-next-line:max-line-length
      this.frameworkService.checkChannelOrSystem(frameworkReq[0], frameworkReq[1])
        .subscribe(
          (response) => {
            const configuredFrameworks = _.map(_.get(response, 'result.Framework'), (framework) => {
              return { label: framework.name, identifier: framework.identifier };
            });
            this.frameworkService.frameworkValues = configuredFrameworks;
            this.unitFormConfig = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.unitMetadata.properties');
            // tslint:disable-next-line:max-line-length
            this.rootFormConfig = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.create.properties');
            // tslint:disable-next-line:max-line-length
            this.libraryComponentInput.searchFormConfig = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.search.properties');
            this.leafFormConfig = _.get(categoryDefinitionData, 'result.objectCategoryDefinition.forms.childMetadata.properties');
          }
        );
      // forkJoin(frameworkReq).subscribe(console.log);
    }
  }

  ngAfterViewInit() {
    this.telemetryService.impression({
      type: 'edit', pageid: this.telemetryService.telemetryPageId, uri: this.router.url,
      duration: _.toString((Date.now() - this.pageStartTime) / 1000)
    });
  }

  fetchCollectionHierarchy(): Observable<any> {
    return this.editorService.fetchCollectionHierarchy(this.collectionId).pipe(tap(data => {
      this.collectionTreeNodes = {
        data: _.get(data, `result.${this.configService.categoryConfig[this.editorConfig.config.objectType]}`)
      };
      if (_.isEmpty(this.collectionTreeNodes.data.children)) {
        this.toolbarConfig.showSubmitBtn = false;
      } else {
        this.toolbarConfig.showSubmitBtn = true;
      }
    }));
  }

  toolbarEventListener(event) {
    this.actionType = event.button;
    switch (event.button) {
      case 'saveContent':
        this.buttonLoaders.saveAsDraftButtonLoader = true;
        this.saveContent().then((message: string) => {
          this.buttonLoaders.saveAsDraftButtonLoader = false;
          this.toasterService.success(message);
        }).catch(((error: string) => {
          this.buttonLoaders.saveAsDraftButtonLoader = false;
          this.toasterService.error(error);
        }));
        break;
      case 'previewContent':
        this.previewContent();
        break;
      case 'addFromLibrary':
        this.showLibraryComponentPage();
        break;
      case 'submitContent':
        this.submitHandler();
        break;
      case 'removeContent':
        this.showDeleteConfirmationPopUp = true;
        break;
      case 'editContent':
        this.redirectToQuestionTab('edit');
        break;
      case 'rejectContent':
        this.rejectContent(event.comment);
        break;
      case 'publishContent':
        this.publishContent();
        break;
      case 'onFormStatusChange':
        const selectedNode = this.treeService.getActiveNode();
        if (selectedNode && selectedNode.data.id) {
          this.formStatusMapper[selectedNode.data.id] = event.event.isValid;
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
        this.redirectToChapterListTab();
        break;
      case 'sourcingReject':
        this.redirectToChapterListTab({ comment: event.comment });
        break;
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
    if (!_.isEmpty(data.event.name) && selectedNode.data.root) {
      this.toolbarConfig.title = data.event.name;
    } else if (_.isEmpty(data.event.name) && selectedNode.data.root) {
      this.toolbarConfig.title = 'Untitled';
    } else { }
  }

  showLibraryComponentPage() {
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

  libraryEventListener(event: any) {
    this.fetchCollectionHierarchy().subscribe((res: any) => {
      this.pageId = 'collection_editor';
      this.telemetryService.telemetryPageId = this.pageId;
    });
  }

  saveContent() {
    return new Promise((resolve, reject) => {
      if (!this.validateFormStatus()) {
        return reject('Please fill the required metadata');
      }
      this.editorService.updateHierarchy()
        .pipe(map(data => _.get(data, 'result'))).subscribe(response => {
          if (!_.isEmpty(response.identifiers)) {
            this.treeService.replaceNodeId(response.identifiers);
          }
          this.treeService.clearTreeCache();
          resolve('Hierarchy is Successfully Updated');
        }, err => {
          reject('Something went wrong, Please try later');
        });
    });
  }

  submitHandler() {
    if (!this.validateFormStatus()) {
      this.toasterService.error('Please fill the required metadata');
      return;
    }
    this.showConfirmPopup = true;
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
    this.saveContent().then(res => {
      this.questionIds = this.getQuestionIds();
      this.buttonLoaders.previewButtonLoader = false;
      this.showPreview = true;
    }).catch(err => {
      this.toasterService.error(err);
      this.buttonLoaders.previewButtonLoader = false;
    });
  }

  sendForReview() {
    this.saveContent().then(messg => {
      this.editorService.reviewContent(this.collectionId).subscribe(data => {
        this.toasterService.success('Successfully sent for review');
        this.redirectToChapterListTab();
      }, err => {
        this.toasterService.error('Sending for review failed. Please try again...');
      });
    }).catch(err => this.toasterService.error(err));
  }

  rejectContent(comment) {
    this.editorService.submitRequestChanges(this.collectionId, comment).subscribe(res => {
      this.toasterService.success('Content is sent back for correction');
      this.redirectToChapterListTab();
    }, err => {
      this.toasterService.error('Rejecting failed. Please try again...');
    });
  }

  publishContent() {
    this.editorService.publishContent(this.collectionId).subscribe(res => {
      this.toasterService.success('Successfully published');
      this.redirectToChapterListTab();
    }, err => {
      this.toasterService.error('Publishing failed. Please try again...');
    });
  }

  treeEventListener(event: any) {
    this.actionType = event.type;
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
        this.showDeleteConfirmationPopUp = true;
        break;
      case 'createNewContent':
        this.buttonLoaders.addFromLibraryButtonLoader = true;
        this.saveContent().then((message: string) => {
          this.buttonLoaders.addFromLibraryButtonLoader = false;
          this.showQuestionTemplatePopup = true;
        }).catch(((error: string) => {
          this.toasterService.error(error);
          this.buttonLoaders.addFromLibraryButtonLoader = false;
        }));
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
  }

  updateSubmitBtnVisibility() {
    const rootFirstChildNode = this.treeService.getFirstChild();
    if (rootFirstChildNode && !rootFirstChildNode.children) {
      this.toolbarConfig.showSubmitBtn = false;
    } else {
      this.toolbarConfig.showSubmitBtn = true;
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
    // tslint:disable-next-line:max-line-length
    this.editorService.getCategoryDefinition(selectedQuestionType, null, 'Question').pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Fetch question set template failed. Please try again...',
      };
      return throwError(this.editorService.apiErrorHandling(error, errInfo));
    })).subscribe((res) => {
      const selectedtemplateDetails = res.result.objectCategoryDefinition;
      const catMetaData = selectedtemplateDetails.objectMetadata;
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
    });
  }

  redirectToQuestionTab(mode, interactionType?) {
    this.questionComponentInput = {
      questionSetId: this.collectionId,
      questionId: mode === 'edit' ? this.selectedNodeData.data.metadata.identifier : undefined,
      type: interactionType
    };
    this.pageId = 'question';
  }

  questionEventListener(event: any) {
    this.selectedNodeData = undefined;
    this.fetchCollectionHierarchy().subscribe((res: any) => {
      this.pageId = 'collection_editor';
      this.telemetryService.telemetryPageId = this.pageId;
    });
  }

  getQuestionIds() {
    const treeObj = this.treeService.getTreeObject();
    const identifiers = [];
    treeObj.visit((node) => {
      if (node.folder === false) {
        identifiers.push(node.data.id);
      }
    });
    return identifiers;
  }

  ngOnDestroy() {
    this.generateTelemetryEndEvent();
    this.treeService.clearTreeCache();
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }
}
