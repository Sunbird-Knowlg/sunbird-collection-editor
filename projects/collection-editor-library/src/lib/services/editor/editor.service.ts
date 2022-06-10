import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash-es';
import { TreeService } from '../tree/tree.service';
import { PublicDataService } from '../public-data/public-data.service';
import { IEditorConfig } from '../../interfaces/editor';
import { ConfigService } from '../config/config.service';
import { ToasterService} from '../../services/toaster/toaster.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { DataService } from '../data/data.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ExportToCsv } from 'export-to-csv';
interface SelectedChildren {
  label?: string;
  primaryCategory?: string;
  mimeType?: string;
  interactionType?: string;
}
@Injectable({ providedIn: 'root' })

export class EditorService {
  data: any = {};
  private _selectedChildren: SelectedChildren = {};
  public questionStream$ = new Subject<any>();
  private _editorConfig: IEditorConfig;
  private _editorMode = 'edit';
  public showLibraryPage: EventEmitter<number> = new EventEmitter();
  public showQuestionLibraryPage: EventEmitter<number> = new EventEmitter();
  private _bulkUploadStatus$ = new BehaviorSubject<any>(undefined);
  public readonly bulkUploadStatus$: Observable<any> = this._bulkUploadStatus$;
  public contentsCount = 0;
  templateList = [];
  parentIdentifier: any;
  branchingLogic = {};
  selectedSection: any;
  optionsLength: any;
  selectedPrimaryCategory: any;
  leafParentIdentifier: any;
  questionIds = [];
  treeData: any;
  outcomeDeclaration: any;
  constructor(public treeService: TreeService, private toasterService: ToasterService,
              public configService: ConfigService, private telemetryService: EditorTelemetryService,
              private publicDataService: PublicDataService, private dataService: DataService, public httpClient: HttpClient) {
              }

  public initialize(config: IEditorConfig) {
    this._editorConfig = config;
    if (this.configService.editorConfig && this.configService.editorConfig.default) {
      this._editorConfig.config = _.assign(this.configService.editorConfig.default, this._editorConfig.config);
    }
    this._editorMode = _.get(this._editorConfig, 'config.mode').toLowerCase();
  }

  set selectedChildren(value: SelectedChildren) {
    if (value.mimeType) {
      this._selectedChildren.mimeType = value.mimeType;
    }
    if (value.primaryCategory) {
      this._selectedChildren.primaryCategory = value.primaryCategory;
    }
    if (value.interactionType) {
      this._selectedChildren.interactionType = value.interactionType;
    }
  }

  get selectedChildren() {
    return this._selectedChildren;
  }

  public get editorConfig(): IEditorConfig {
    return this._editorConfig;
  }

  get editorMode() {
    return this._editorMode;
  }

  get contentPolicyUrl() {
    const url = _.get(this.editorConfig, 'config.contentPolicyUrl');
    return url ? url : this.configService.urlConFig.ContentPolicyUrl;
  }

  getToolbarConfig() {
    return _.cloneDeep(_.merge(this.configService.labelConfig.button_labels, _.get(this.editorConfig, 'context.labels')));
  }

  nextBulkUploadStatus(status) {
    this._bulkUploadStatus$.next(status);
  }
  emitshowLibraryPageEvent(page) {
    this.showLibraryPage.emit(page);
  }
  getshowLibraryPageEmitter() {
    return this.showLibraryPage;
  }
  emitshowQuestionLibraryPageEvent(page) {
    this.showQuestionLibraryPage.emit(page);
  }
  getshowQuestionLibraryPageEmitter() {
    return this.showQuestionLibraryPage;
  }

  getQuestionList(questionIds: string[]): Observable<any> {
    const option = {
      url: _.get(this.configService.urlConFig, 'URLS.QUESTION.LIST'),
      data: {
        request: {
          search: {
            identifier: questionIds
          }
        }
      }
    };
    return this.dataService.post(option).pipe(map(data => _.get(data, 'result')));
  }

  fetchCollectionHierarchy(collectionId): Observable<any> {
    const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
    const hierarchyUrl = `${url.HIERARCHY_READ}/${collectionId}`;
    const req = {
      url: hierarchyUrl,
      param: { mode: 'edit' }
    };
    return this.publicDataService.get(req);
  }

  readQuestionSet(questionSetId, option: any = { params: {} }): Observable<any> {
    const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
    const param = {
      mode: 'edit',
      fields: url.DEFAULT_PARAMS_FIELDS
    };
    const hierarchyUrl = `${url.READ}/${questionSetId}`;
    const req = {
      url: hierarchyUrl,
      param: { ...param, ...option.params }
    };
    return this.publicDataService.get(req);
  }

  fetchContentDetails(contentId) {
    const req = {
      url: _.get(this.configService.urlConFig, 'URLS.CONTENT.READ') + contentId
    };
    return this.publicDataService.get(req);
  }

  updateHierarchy(): Observable<any> {
    const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
    const req = {
      url: url.HIERARCHY_UPDATE,
      data: {
        request: {
          data: {
            ...this.getCollectionHierarchy(),
            ...{lastUpdatedBy: _.get(this.editorConfig, 'context.user.id')}
          }
        }
      }
    };
    return this.publicDataService.patch(req);
  }

  getFieldsToUpdate(collectionId) {
    const formFields = {};
    const editableFields = _.get(this.editorConfig.config, 'editableFields');
    if (editableFields && !_.isEmpty(editableFields[this.editorMode])) {
      const fields = editableFields[this.editorMode];
      const nodesModified = _.get(this.getCollectionHierarchy(), 'nodesModified');
      const collectionFormData = _.get(nodesModified[collectionId], 'metadata');
      _.forEach(fields, fieldCode => {
        formFields[fieldCode] = collectionFormData[fieldCode];
      });
    }
    return formFields;
  }

  updateCollection(collectionId, event: any = {}) {
    let objType = this.configService.categoryConfig[this.editorConfig.config.objectType];
    let url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
    let requestBody = {
      request: { }
    };
    objType = objType.toLowerCase();

    if (event.button === 'sourcingApproveQuestion' || event.button === 'sourcingRejectQuestion') {
      objType = this.configService.categoryConfig[this.editorConfig.context['collectionObjectType']];
      objType = objType.toLowerCase();
      url = this.configService.urlConFig.URLS[this.editorConfig.context['collectionObjectType']];

      requestBody = event.requestBody;
      requestBody.request[objType]['lastPublishedBy'] = this.editorConfig.context.user.id;
    }
    else {
      const fieldsObj = this.getFieldsToUpdate(collectionId);
      requestBody = {
        request: {
          [objType]: {
            ...fieldsObj,
            lastPublishedBy: this.editorConfig.context.user.id
          }
        }
      };
    }

    const publishData =  _.get(event, 'publishData');
    if(publishData) {
     requestBody.request[objType] = { ...requestBody.request[objType], ...publishData };
    }
    const option = {
      url: `${url.SYSYTEM_UPDATE}${collectionId}`,
      data: requestBody
    };
    return this.publicDataService.patch(option);
  }

  reviewContent(contentId): Observable<any> {
    let objType = this.configService.categoryConfig[this.editorConfig.config.objectType];
    objType = objType.toLowerCase();
    const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
    const option = {
      url: url.CONTENT_REVIEW + contentId,
      data: {
        request: {
          [objType]: {}
        }
      }
    };
    return this.publicDataService.post(option);
  }

  submitRequestChanges(contentId, comment) {
    let objType = this.configService.categoryConfig[this.editorConfig.config.objectType];
    objType = objType.toLowerCase();
    const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
    const requestBody = {
      request: {
        [objType]: {
          rejectComment: _.trim(comment)
        }
      }
    };
    const option = {
      url: `${url.CONTENT_REJECT}${contentId}`,
      data: requestBody
    };
    return this.publicDataService.post(option);
  }

  publishContent(contentId, event) {
    let objType = this.configService.categoryConfig[this.editorConfig.config.objectType];
    objType = objType.toLowerCase();
    const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
    const requestBody = {
      request: {
        [objType]: {
          lastPublishedBy: this.editorConfig.context.user.id
        }
      }
    };
   const publishData =  _.get(event, 'publishData');
   if(publishData) {
    requestBody.request[objType] = { ...requestBody.request[objType], ...publishData };
   }
    const option = {
      url: `${url.CONTENT_PUBLISH}${contentId}`,
      data: requestBody
    };
    return this.publicDataService.post(option);
  }

  addResourceToHierarchy(collection, unitIdentifier, contentId): Observable<any> {
    const req = {
      url: _.get(this.configService.urlConFig, 'URLS.CONTENT.HIERARCHY_ADD'),
      data: {
        request: {
          rootId: collection,
          unitId: unitIdentifier,
          children: [contentId]
        }
      }
    };
    return this.publicDataService.patch(req);
  }

  addResourceToQuestionset(collection, unitIdentifier, contentId) {
    const children: any[] = _.isArray(contentId) ? contentId : [contentId];
    let req = {
      url: _.get(this.configService.urlConFig, 'URLS.QuestionSet.ADD'),
      data: {
        request: {
          questionset: {
            rootId: collection,
            collectionId: unitIdentifier,
            children
          }
        }
      }
    };
    if (collection === unitIdentifier) {
      req = _.omit(req, 'data.request.questionset.collectionId');
    }
    return this.publicDataService.patch(req);
  }

  public getQuestionStream$() {
    return this.questionStream$;
  }

  public publish(value: any) {
    this.questionStream$.next(value);
  }

  setQuestionIds(childrens) {
    const self = this;
    for (const children of childrens) {
      if (children.data.objectType === 'QuestionSet') {
        let questionCount = 0;
        if (children?.data?.metadata?.maxQuestions) {
          questionCount = children.data.metadata.maxQuestions;
        } else {
          questionCount = children.children ?
          children.children.length : 0;
        }
        if (questionCount > 0) {
          for (let i = 0; i < questionCount; i++) {
            if (!_.isEmpty(children, 'children')) {
              if (children.children[i].data.objectType === 'QuestionSet') {
                self.setQuestionIds([children.children[i]]);
              } else {
                if (!_.includes(this.questionIds, children.children[i].data.id)) {
                  this.questionIds.push(children.children[i].data.id);
                }
              }
            }
          }
        }
      }
    }
  }

  async getMaxScore() {
    let maxScore = 0;
    let rootNode = [];
    this.questionIds = [];
    const rootNodeData = this.treeService.getFirstChild();
    if (rootNodeData.children) {
      rootNode = [rootNodeData];
    }
    if (!_.isEmpty(rootNode)) {
      this.setQuestionIds(rootNode);
    }
    if (!_.isEmpty(this.questionIds)) {
      const { questions } =  await this.getQuestionList(this.questionIds).toPromise();
      maxScore = this.calculateMaxScore(questions);
    }
    return maxScore;
  }

  calculateMaxScore(questions: Array<any>) {
   return _.reduce(questions, (sum, question) => {
      return sum + (question?.responseDeclaration?.response1?.maxScore ? _.get(question, 'responseDeclaration.response1.maxScore') : 0);
    }, 0);
  }

  getCollectionHierarchy() {
    const instance = this;
    this.data = {};
    const data = this.treeService.getFirstChild();
    return {
      nodesModified: this.treeService.treeCache.nodesModified,
      hierarchy: instance.getHierarchyObj(data)
    };
  }

  getHierarchyObj(data, questionId?, selectUnitId?, parentId?) {
    const instance = this;
    if (data && data.data) {
      const relationalMetadata = this.getRelationalMetadataObj(data.children);
      instance.data[data.data.id] = {
        name: data.title,
        children: _.map(data.children, (child) => child.data.id),
        ...(!_.isEmpty(relationalMetadata) &&  {relationalMetadata}),
        root: data.data.root
      };
      if (questionId && selectUnitId && selectUnitId === data.data.id) {
          if (parentId) {
            const children = instance.data[data.data.id].children;
            const index = _.findIndex(children, (e) => {
              return e === parentId;
            }, 0);
            const setIndex = index + 1;
            children.splice(setIndex, 0, questionId);
          } else {
            instance.data[data.data.id].children.push(questionId);
          }
      }
      if (questionId && selectUnitId && data.folder === false) {
          delete instance.data[data.data.id];
      }
      _.forEach(data.children, (collection) => {
        instance.getHierarchyObj(collection, questionId, selectUnitId, parentId);
      });
    }
    return instance.data;
  }


 _toFlatObjFromHierarchy(data) {
    const instance = this;
    if (data && data.children) {
      instance.data[data.identifier] = {
        name: data.name,
        children: _.map(data.children, (child) => {
          return child.identifier;
        }),
        branchingLogic: data.branchingLogic
      };
      _.forEach(data.children, (collection) => {
        instance._toFlatObjFromHierarchy(collection);
      });
    }
    return instance.data;
  }

  getRelationalMetadataObj(data) {
    let relationalMetadata = {};
    _.forEach(data, (child) => {
      if (_.get(child, 'data.metadata.relationalMetadata')) {
        relationalMetadata = {
          ...relationalMetadata,
          [child.data.id]: _.get(child, 'data.metadata.relationalMetadata')
        };
      }
    });
    return relationalMetadata;
  }

  getCategoryDefinition(categoryName, channel, objectType?: any) {
    const req = {
      url: _.get(this.configService.urlConFig, 'URLS.getCategoryDefinition'),
      data: {
        request: {
          objectCategoryDefinition: {
              objectType: objectType ? objectType : 'Content',
              name: categoryName,
              ...(channel && { channel })
          },
        }
      }
    };
    return this.publicDataService.post(req);
  }
  fetchContentListDetails(req) {
    return this.publicDataService.post(req);
  }
  sort(a, b, column) {
    if (!this.isNotEmpty(a, column) || !this.isNotEmpty(b, column)) {
      return 1;
    }
    let aColumn = a[column];
    let bColumn = b[column];
    if (_.isArray(aColumn)) {
      aColumn = _.join(aColumn, ', ');
    }
    if (_.isArray(bColumn)) {
      bColumn = _.join(bColumn, ', ');
    }
    if (_.isNumber(aColumn)) {
    aColumn = _.toString(aColumn);
    }
    if (_.isNumber(bColumn)) {
    bColumn = _.toString(bColumn);
    }
    return bColumn.localeCompare(aColumn);
  }
  isNotEmpty(obj, key) {
    if (_.isNil(obj) || _.isNil(obj[key])) {
      return false;
    }
    return true;
   }

   apiErrorHandling(err, errorInfo) {
    if (_.get(err, 'error.params.errmsg') || errorInfo.errorMsg) {
      this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
    }
    const telemetryErrorData = {
        err: _.toString(err.status),
        errtype: 'SYSTEM',
        stacktrace: JSON.stringify({response: _.pick(err, ['error', 'url']), request: _.get(errorInfo, 'request')}) || errorInfo.errorMsg,
        pageid: this.telemetryService.telemetryPageId
    };
    this.telemetryService.error(telemetryErrorData);
  }
  // this method is used to get all the contents in course/question inside every module and sub module
  getContentChildrens(activeNode?) {
    let treeObj = this.treeService.getTreeObject();
    const contents = [];
    if (activeNode) { treeObj = activeNode; }
    treeObj.visit((node) => {
      if (node.folder === false) {
        contents.push(node.data.id);
      }
    });
    return contents;
  }
  // this method is used to keep count of contents added from library page
  contentsCountAddedInLibraryPage(setToZero?) {
    if (setToZero) {
      this.contentsCount = 0; // setting this count to zero  while going out from library page
    } else {
      this.contentsCount = this.contentsCount + 1;
    }
  }
  checkIfContentsCanbeAdded(buttonAction) {
    const config = {
      errorMessage: '',
      maxLimit: 0
    };
    if (_.get(this.editorConfig, 'config.objectType') === 'QuestionSet') {
      config.maxLimit = _.get(this.editorConfig, 'config.questionSet.maxQuestionsLimit');
      if (buttonAction === 'add') {
        config.errorMessage = _.get(this.configService, 'labelConfig.messages.error.041');
      }
      if (buttonAction === 'create') {
        config.errorMessage = _.get(this.configService, 'labelConfig.messages.error.031');
      }

    } else {
      config.maxLimit = _.get(this.editorConfig, 'config.collection.maxContentsLimit');
      if (buttonAction === 'add') {
        config.errorMessage = _.get(this.configService, 'labelConfig.messages.error.032');
      }
      if (buttonAction === 'create') {
        config.errorMessage = _.get(this.configService, 'labelConfig.messages.error.042');
      }
    }
    const childrenCount = this.getContentChildrens().length + this.contentsCount;
    if (childrenCount >= config.maxLimit) {
      this.toasterService.error(config.errorMessage);
      return false;
    } else {
      return true;
    }
  }
  getHierarchyFolder() {
    const treeObj = this.treeService.getTreeObject();
    const contents = [];
    if (treeObj) {
    treeObj.visit((node) => {
      if (node && !node.data.root) {
        contents.push(node.data.id);
      }
    });
  }
    return contents;
  }
  validateCSVFile(formData, collectionnId: any) {
    const url = _.get(this.configService.urlConFig, 'URLS.CSV.UPLOAD');
    const reqParam = {
      url: `${url}${collectionnId}`,
      data: formData.data
    };
    return this.publicDataService.post(reqParam);
  }
  downloadHierarchyCsv(collectionId) {
    const url = _.get(this.configService.urlConFig, 'URLS.CSV.DOWNLOAD');
    const req = {
      url: `${url}${collectionId}`,
    };
    return this.publicDataService.get(req);
  }
  generatePreSignedUrl(req, contentId: any, type) {
    const reqParam = {
      url: `${this.configService.urlConFig.URLS.CONTENT.UPLOAD_URL}${contentId}?type=${type}`,
      data: {
        request: req
      }
    };
    return this.publicDataService.post(reqParam);
  }
  downloadBlobUrlFile(config) {
    try {
      this.httpClient.get(config.blobUrl, {responseType: 'blob'})
      .subscribe(blob => {
        const objectUrl: string = URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        a.href = objectUrl;
        a.download = config.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
        if (config.successMessage) {
          this.toasterService.success(config.successMessage);
        }
      }, (error) => {
        console.error(_.get(this.configService, 'labelConfig.messages.error.034') + error);
      });
    } catch (error) {
      console.error( _.replace(_.get(this.configService, 'labelConfig.messages.error.033'), '{FILE_TYPE}', config.fileType ) + error);
    }
  }

  generateCSV(config) {
    const tableData = config.tableData;
    delete config.tableData;
    let options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      useTextFile: false,
      useBom: true,
      showTitle: true,
      title: '',
      filename: '',
      headers: []
    };
    options = _.merge(options, config);
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(tableData);
  }

  getBranchingLogicByFolder(identifier) {
    const nodeData = this.treeService.getNodeById(identifier);
    const branchingLogic = _.get(nodeData, 'data.metadata.branchingLogic');
    return branchingLogic || {};
  }

/**
 *
 * @public
 * @param identifier identifier of the node
 * @returns { source: [], target: [], sourceTarget?: [] }
 * @memberof EditorService
 */
getDependentNodes(identifier) {
    const sectionBranchingLogic = this.getBranchingLogicByNodeId(identifier);

    if (!_.isEmpty(sectionBranchingLogic)) {
     const branchingEntry = this.getBranchingLogicEntry(sectionBranchingLogic, identifier);
     const source = _.get(branchingEntry, 'source');
     if (!_.isEmpty(source)) { // if the node is a dependent node

       const sourceBranchingEntry = this.getBranchingLogicEntry(sectionBranchingLogic, _.first(branchingEntry.source));

       return !_.isEmpty(sourceBranchingEntry) ? { source: branchingEntry.source, target: branchingEntry.target,
        sourceTarget: sourceBranchingEntry.target } : {};

     } else { // if the node is a parent node
       return !_.isEmpty(branchingEntry) ? { source: branchingEntry.source, target: branchingEntry.target } : {};
     }
    }
  }

/**
 *
 * @public
 * @param identifier identifier of the node
 * @returns {"do_id": { "target": [ "do_id123", "do_id456" ], "preCondition": {}, "source": [] }}
 * @memberof EditorService
 */
  getBranchingLogicByNodeId(identifier) {
    const leafNode = this.treeService.getNodeById(identifier);
    const parentIdentifier = _.get(leafNode, 'parent.data.id');
    return this.getBranchingLogicByFolder(parentIdentifier);
  }

  getBranchingLogicEntry(parentBranchingLogic, identifier) {
    return _.find(parentBranchingLogic, (logic, key) => {
      return key === identifier;
    });
  }

  getFlattenedBranchingLogic(data) {
    const flatHierarchy = this._toFlatObjFromHierarchy(data);
    const branchingLogics = _.compact(_.map(flatHierarchy, 'branchingLogic'));
    return _.reduce(branchingLogics, (acc, val) => {
      return  _.assign(acc, val);
    }, {});
  }

  getParentDependentMap(data) {
    const branchingLogic = this.getFlattenedBranchingLogic(data);
    const obj = {};
    _.forEach(_.keys(branchingLogic), item => {
      obj[item] = !_.isEmpty(branchingLogic[item].source) ? 'dependent' : !_.isEmpty(branchingLogic[item].target) ? 'parent' : '';
    });
    return obj;
  }

  getPrimaryCategoryName(sectionId) {
    const nodeData = this.treeService.getNodeById(sectionId);
    return _.get(nodeData, 'data.primaryCategory');
  }

  /**
   * fetch Outcome Declaration levels using the questionsetId
   * only for Observation with Rubrics
   * @param identifier questionset identifier
   */
   fetchOutComeDeclaration(questionSetId, option: any = { params: {} }): Observable<any> {
    const url = this.configService.urlConFig.URLS[this.editorConfig.config.objectType];
    const param = {
      fields: 'outcomeDeclaration'
    };
    const hierarchyUrl = `${url.READ}/${questionSetId}`;
    const req = {
      url: hierarchyUrl,
      param: { ...param, ...option.params }
    };
    return this.publicDataService.get(req);
  }

}
