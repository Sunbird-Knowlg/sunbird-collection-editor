import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ViewEncapsulation, OnChanges, OnDestroy } from '@angular/core';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { McqForm } from '../../interfaces/McqForm';
import { ServerResponse } from '../../interfaces/serverResponse';
import { QuestionService } from '../../services/question/question.service';
import { PlayerService } from '../../services/player/player.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config/config.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { TreeService } from '../../services/tree/tree.service';
import { EditorCursor } from '../../collection-editor-cursor.service';
import { filter, finalize, take, takeUntil } from 'rxjs/operators';
import { ICreationContext } from '../../interfaces/CreationContext';
@Component({
  selector: 'lib-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit, AfterViewInit, OnDestroy {
  QumlPlayerConfig: any = {};
  @Input() questionInput: any;
  @Input() leafFormConfig: any;
  public initialLeafFormConfig: any;
  public childFormData: any;
  @Output() questionEmitter = new EventEmitter<any>();
  private onComponentDestroy$ = new Subject<any>();
  toolbarConfig: any = {};
  public terms = false;
  public editorState: any = {};
  public showPreview = false;
  public mediaArr: any = [];
  public videoShow = false;
  public showFormError = false;
  public actionType: string;
  selectedSolutionType: string;
  selectedSolutionTypeIndex: string;
  showSolutionDropDown = true;
  showSolution = false;
  videoSolutionName: string;
  videoSolutionData: any;
  videoThumbnail: string;
  solutionUUID: string;
  solutionValue: string;
  solutionTypes: any = [{
    type: 'html',
    value: 'Text+Image'
  },
  {
    type: 'video',
    value: 'video'
  }];
  questionMetaData: any;
  questionInteractionType;
  questionCategory;
  questionId;
  creationContext: ICreationContext;
  creationMode;
  tempQuestionId;
  questionSetId;
  unitId;
  public setCharacterLimit = 160;
  public showLoader = true;
  public isReadOnlyMode = false;
  public contentComment : string;
  public showReviewModal: boolean = false;
  questionSetHierarchy: any;
  showConfirmPopup = false;
  showSubmitConfirmPopup = false;
  validQuestionData = false;
  questionPrimaryCategory: string;
  pageId = 'question';
  pageStartTime: any;
  public framework;
  public frameworkDetails: any = {};
  public buttonLoaders = {
    saveButtonLoader: false,
    'review': false
  };
  public questionFormConfig: any;

  constructor(
    private questionService: QuestionService, private editorService: EditorService, public telemetryService: EditorTelemetryService,
    public playerService: PlayerService, private toasterService: ToasterService, private treeService: TreeService,
    private frameworkService: FrameworkService, private router: Router, public configService: ConfigService,
    private editorCursor: EditorCursor) {
    const { primaryCategory } = this.editorService.selectedChildren;
    this.questionPrimaryCategory = primaryCategory;
    this.pageStartTime = Date.now();
  }

  ngOnInit() {
    const { questionSetId, questionId, type, category, config, creationContext, creationMode } = this.questionInput;
    this.questionInteractionType = type;
    this.questionCategory = category;
    this.questionId = questionId;
    this.questionSetId = questionSetId;
    this.creationContext = creationContext;
    this.creationMode = creationMode;
    this.unitId = this.creationContext?.unitIdentifier;
    this.isReadOnlyMode = this.creationContext?.isReadOnlyMode;
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.toolbarConfig.showPreview = false;
    if(_.get(this.creationContext, 'objectType') === 'question') this.toolbarConfig.questionContribution = true;
    this.solutionUUID = UUID.UUID();
    this.telemetryService.telemetryPageId = this.pageId;
    this.initialLeafFormConfig = _.cloneDeep(this.leafFormConfig);
    this.initialize();
    this.framework = _.get(this.editorService.editorConfig, 'context.framework');
  }

  fetchFrameWorkDetails() {
    this.frameworkService.frameworkData$.pipe(takeUntil(this.onComponentDestroy$),
      filter(data => _.get(data, `frameworkdata.${this.framework}`)), take(1)).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[this.framework].categories;
        this.frameworkDetails.frameworkData = frameworkData;
        this.frameworkDetails.topicList = _.get(_.find(frameworkData, { code: 'topic' }), 'terms');
        this.populateFrameworkData();
      }
    });
  }

  populateFrameworkData() {
    const categoryMasterList = this.frameworkDetails.frameworkData;
    _.forEach(categoryMasterList, (category) => {
      _.forEach(this.leafFormConfig, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.terms = category.terms;
        }
      });
    });
    this.questionFormConfig = _.cloneDeep(this.leafFormConfig);
  }

  ngAfterViewInit() {
    this.telemetryService.impression({
      type: 'edit', pageid: this.telemetryService.telemetryPageId, uri: this.router.url,
      duration: (Date.now() - this.pageStartTime) / 1000
    });
  }

  initialize() {
    this.editorService.fetchCollectionHierarchy(this.questionSetId).subscribe((response) => {
      this.questionSetHierarchy = _.get(response, 'result.questionSet');
      const leafFormConfigfields = _.join(_.map(this.leafFormConfig, value => (value.code)), ',');
      if (!_.isUndefined(this.questionId)) {
        this.questionService.readQuestion(this.questionId, leafFormConfigfields)
          .subscribe((res) => {
            if (res.result) {
              this.questionMetaData = res.result.question;
              this.populateFormData();
              if (_.isUndefined(this.questionPrimaryCategory)) {
                this.questionPrimaryCategory = this.questionMetaData.primaryCategory;
              }
              // tslint:disable-next-line:max-line-length
              this.questionInteractionType = this.questionMetaData.interactionTypes ? this.questionMetaData.interactionTypes[0] : 'default';
              if (this.questionInteractionType === 'default') {
                if (this.questionMetaData.editorState) {
                  this.editorState = this.questionMetaData.editorState;
                }
              }

              if (this.questionInteractionType === 'choice') {
                const responseDeclaration = this.questionMetaData.responseDeclaration;
                const templateId = this.questionMetaData.templateId;
                // this.questionMetaData.editorState = this.questionMetaData.editorState;
                const numberOfOptions = this.questionMetaData.editorState.options.length;
                const options = _.map(this.questionMetaData.editorState.options, option => ({ body: option.value.body }));
                const question = this.questionMetaData.editorState.question;
                this.editorState = new McqForm({
                  question, options, answer: _.get(responseDeclaration, 'response1.correctResponse.value')
                }, { templateId, numberOfOptions });
                this.editorState.solutions = this.questionMetaData.editorState.solutions;
              }
              this.setQuestionTitle(this.questionId);
              if (!_.isEmpty(this.editorState.solutions)) {
                this.selectedSolutionType = this.editorState.solutions[0].type;
                this.solutionUUID = this.editorState.solutions[0].id;
                this.showSolutionDropDown = false;
                this.showSolution = true;
                if (this.selectedSolutionType === 'video') {
                  const index = _.findIndex(this.questionMetaData.media, (o) => {
                    return o.type === 'video' && o.id === this.editorState.solutions[0].value;
                  });
                  this.videoSolutionName = this.questionMetaData.media[index].name;
                  this.videoThumbnail = this.questionMetaData.media[index].thumbnail;
                }
                if (this.selectedSolutionType === 'html') {
                  this.editorState.solutions = this.editorState.solutions[0].value;
                }
              }
            if (this.questionMetaData.media) {
                this.mediaArr = this.questionMetaData.media;
              }
              this.contentComment = _.get(this.creationContext, 'correctionComments');
              this.showLoader = false;
            }
          }, (err: ServerResponse) => {
            const errInfo = {
              errorMsg: 'Fetching question details failed. Please try again...',
            };
            return throwError(this.editorService.apiErrorHandling(err, errInfo));
          });
      }
      if (_.isUndefined(this.questionId)) {
        this.tempQuestionId = UUID.UUID();
        this.populateFormData();
        this.setQuestionTitle();
        let editorState = {}
        if (this.questionInteractionType === 'default') {
          if (this.questionCategory) {
            editorState = _.get(this.configService, `editorConfig.defaultStates.nonInteractiveQuestions.${this.questionCategory}`);
          } else {
            editorState = { question: "", answer: "", solutions: "" };
          }
          this.editorState = { ...editorState };
        }
        else if (this.questionInteractionType === 'choice') {
          this.editorState = new McqForm({ question: '', options: [] }, {numberOfOptions: _.get(this.questionInput, 'config.numberOfOptions')});
        }
        this.showLoader = false;
      }
    }, (err: ServerResponse) => {
      const errInfo = {
        errorMsg: 'Fetching question set details failed. Please try again...',
      };
      this.editorService.apiErrorHandling(err, errInfo);
    });
  }

  get contentPolicyUrl() {
    return this.editorService.contentPolicyUrl;
  }

  toolbarEventListener(event) {
    this.actionType = event.button;
    switch (event.button) {
      case 'saveContent':
        this.saveContent();
        break;
      case 'submitQuestion':
        this.submitHandler();
        break;
      case 'cancelContent':
        this.handleRedirectToQuestionset();
        break;
      case 'rejectQuestion':
        this.rejectQuestion(event.comment);
        break;
      case 'publishQuestion':
        this.publishQuestion(event);
        break;
      case 'sourcingApproveQuestion':
        this.sourcingUpdate(event);
        break;
      case 'sourcingRejectQuestion':
        this.sourcingUpdate(event);
        break;
      case 'sendForCorrectionsQuestion':
        this.sendBackQuestion(event);
        break;
      case 'backContent':
        this.handleRedirectToQuestionset();
        break;
      case 'previewContent':
        this.previewContent();
        break;
      case 'editContent':
        this.previewFormData(true);
        this.showPreview = false;
        this.toolbarConfig.showPreview = false;
        break;
      case 'showReviewcomments':
        this.showReviewModal = !this.showReviewModal;
        break;
      default:
        break;
    }
  }

  handleRedirectToQuestionset() {
    if (_.isUndefined(this.questionId) || this.creationMode === 'edit') {
      this.showConfirmPopup = true;
    } else {
      this.redirectToQuestionset();
    }
  }


  submitHandler() {
    this.validateQuestionData();
    this.validateFormFields();
    if(this.showFormError === false)  this.showSubmitConfirmPopup = true;
  }

  saveContent() {
    this.validateQuestionData();
    if (this.showFormError === false) {
      this.saveQuestion();
    }
  }

  sendForReview() {
    let callback = function () {
      this.editorService.reviewContent(this.questionId).subscribe(data => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.002'));
        this.redirectToChapterList();
      }, err => {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.002'));
      });
    };
    if (!this.questionId) {
      callback = function () {
        this.editorService.reviewContent(this.questionId).subscribe(data => {
          this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.002'));
          this.addResourceToQuestionset();
        }, err => {
          this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.002'));
        });
      };
    }
    callback = callback.bind(this);
    this.upsertQuestion(callback);
  }

  requestForChanges(comment) {
      this.editorService.submitRequestChanges(this.questionId, comment).subscribe(res => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.003'));
        this.redirectToChapterList();
      }, err => {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.003'));
      });
  }

  sendQuestionForPublish(event) {
    this.editorService.publishContent(this.questionId, event).subscribe(res => {
      this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.037'));
      this.redirectToChapterList();
    }, err => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.037'));
    });
  }

  rejectQuestion(comment) {
    const editableFields = _.get(this.creationContext, 'editableFields');
    if (this.creationMode === 'orgreview' && editableFields && !_.isEmpty(editableFields[this.creationMode])) {
      this.validateFormFields();
      if(this.showFormError === true) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.029'));
        return false;
      }
      let callback = this.requestForChanges.bind(this, [comment]);
      this.upsertQuestion(callback);
    } else {
      this.requestForChanges(comment);
    }
  }

  publishQuestion(event) {
    const editableFields = _.get(this.creationContext, 'editableFields');
    if (this.creationMode === 'orgreview' && editableFields && !_.isEmpty(editableFields[this.creationMode])) {
      this.validateFormFields();
      if(this.showFormError === true) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.029'));
        return false;
      }
      let callback = this.sendQuestionForPublish.bind(this, [event]);
      this.upsertQuestion(callback);
    } else {
      this.sendQuestionForPublish(event);
    }
  }

  sourcingUpdate(event) {
    const editableFields = _.get(this.creationContext, 'editableFields');
    if (this.creationMode === 'sourcingreview' && editableFields && !_.isEmpty(editableFields[this.creationMode])) {
      this.validateFormFields();
      if(this.showFormError === true) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.029'));
        return false;        }
      }
      let questionIds = [];
      //let comments = {};
      let comments = event.comment
      this.editorService.fetchCollectionHierarchy(this.questionSetId).subscribe(res => {
        const questionSet = res.result['questionSet'];
        switch (event.button) {
          case 'sourcingApproveQuestion':
            questionIds = questionSet.acceptedContributions || [];
            break;
          case 'sourcingRejectQuestion':
            questionIds = questionSet.rejectedContributions || [];
            comments = questionSet.rejectedContributionComments || {};
            comments[this.questionId] = event.comment;
            break;
          default:
            break;
        }
        questionIds.push(this.questionId);
        event['requestBody'] = this.prepareSourcingUpdateBody(questionIds, comments);
        this.editorService.updateCollection(this.questionSetId, event).subscribe(res => {
          this.redirectToChapterList();
        })
      })
    }

  sendBackQuestion(event) {
    this.questionService.readQuestion(this.questionId, 'status')
      .subscribe((res) => {
        const requestObj = {
          question: {
            prevStatus: _.get(res.result, `question.status`),
            status: 'Draft',
            requestChanges: event.comment
          }
        };
        this.questionService.updateQuestion(this.questionId, requestObj).subscribe(res => {
            this.redirectToChapterList();
        });
      }, (err: ServerResponse) => {
        const errInfo = {
          errorMsg: 'Cannot update question status. Please try again...',
        };
        this.editorService.apiErrorHandling(err, errInfo);
      });
  }

  validateQuestionData() {

    if ([undefined, ''].includes(this.editorState.question)) {
      this.showFormError = true;
      return;
    }

    // to handle when question type is subjective
    if (this.questionInteractionType === 'default') {
      if (this.editorState.answer !== '') {
        this.showFormError = false;
      } else {
        this.showFormError = true;
        return;
      }
    }

    // to handle when question type is mcq
    if (this.questionInteractionType === 'choice') {
      const optionValid = _.find(this.editorState.options, option =>
        (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
      if (optionValid || !this.editorState.answer) {
        this.showFormError = true;
        return;
      } else {
        this.showFormError = false;
      }
    }
  }

  redirectToQuestionset() {
    this.showConfirmPopup = false;
    setTimeout(() => {
      this.questionEmitter.emit({ status: false });
    }, 100);
  }

  redirectToChapterList() {
    this.showConfirmPopup = false;
    setTimeout(() => {
      this.questionEmitter.emit({ type: 'close', actionType: this.actionType, identifier: this.questionId });
    }, 100);
  }

  editorDataHandler(event, type?) {
    if (type === 'question') {
      this.editorState.question = event.body;
    } else if (type === 'solution') {
      this.editorState.solutions = event.body;
    } else {
      this.editorState = _.assign(this.editorState, event.body);
    }

    if (event.mediaobj) {
      const media = event.mediaobj;
      this.setMedia(media);
    }
  }

  setMedia(media) {
    if (media) {
      const value = _.find(this.mediaArr, ob => {
        return ob.id === media.id;
      });
      if (value === undefined) {
        this.mediaArr.push(media);
      }
    }
  }

  addResourceToQuestionset() {
    this.editorService.addResourceToQuestionset(this.questionSetId, this.unitId, this.questionId).subscribe(res => {
      this.redirectToChapterList();
    }, err => {
        const errInfo = {
          errorMsg: 'Adding question to questionset failed. Please try again.',
        };
        return throwError(this.editorService.apiErrorHandling(err, errInfo));
    })
  }

  saveQuestion() {
    if(_.get(this.creationContext, 'objectType') === 'question') {
      if(this.creationMode === 'edit') {
        let callback = this.addResourceToQuestionset.bind(this);
        this.upsertQuestion(callback);
      }
      else this.upsertQuestion(undefined);
    }
    else {
      if (_.isUndefined(this.questionId)) {
        this.createQuestion();
      }
      if (!_.isUndefined(this.questionId)) {
        this.updateQuestion();
      }
  }
  }

  videoDataOutput(event) {
    if (event) {
      this.videoSolutionData = event;
      this.videoSolutionName = event.name;
      this.editorState.solutions = event.identifier;
      this.videoThumbnail = event.thumbnail;
      const videoMedia: any = {};
      videoMedia.id = event.identifier;
      videoMedia.src = event.src;
      videoMedia.type = 'video';
      videoMedia.assetId = event.identifier;
      videoMedia.name = event.name;
      videoMedia.thumbnail = this.videoThumbnail;
      videoMedia.baseUrl = _.get(this.editorService.editorConfig, 'context.host') || document.location.origin;
      if (videoMedia.thumbnail) {
        const thumbnailMedia: any = {};
        thumbnailMedia.src = this.videoThumbnail;
        thumbnailMedia.type = 'image';
        thumbnailMedia.id = `video_${event.identifier}`;
        thumbnailMedia.baseUrl = _.get(this.editorService.editorConfig, 'context.host') || document.location.origin;
        this.mediaArr.push(thumbnailMedia);
      }
      this.mediaArr.push(videoMedia);
      this.showSolutionDropDown = false;
      this.showSolution = true;
    } else {
      this.deleteSolution();
    }
    this.videoShow = false;
  }

  selectSolutionType(data: any) {
    const index = _.findIndex(this.solutionTypes, (sol: any) => {
      return sol.value === data;
    });
    this.selectedSolutionType = this.solutionTypes[index].type;
    if (this.selectedSolutionType === 'video') {
      const showVideo = true;
      this.videoShow = showVideo;
    } else {
      this.showSolutionDropDown = false;
    }
  }

  deleteSolution() {
    if (this.selectedSolutionType === 'video') {
      this.mediaArr = _.filter(this.mediaArr, (item: any) => item.id !== this.editorState.solutions);
    }
    this.showSolutionDropDown = true;
    this.selectedSolutionType = '';
    this.videoSolutionName = '';
    this.editorState.solutions = '';
    this.videoThumbnail = '';
    this.showSolution = false;
  }

  getSolutionObj(solutionUUID, selectedSolutionType, editorStateSolutions: any) {
    let solutionObj: any;
    solutionObj = {};
    solutionObj.id = solutionUUID;
    solutionObj.type = selectedSolutionType;
    if (_.isString(editorStateSolutions)) {
      solutionObj.value = editorStateSolutions;
    }
    if (_.isArray(editorStateSolutions)) {
      if (_.has(editorStateSolutions[0], 'value')) {
        solutionObj.value = editorStateSolutions[0].value;
      }
    }
    return solutionObj;
  }

  getQuestionMetadata() {
    let metadata: any = {
      mimeType: 'application/vnd.sunbird.question',
      media: this.mediaArr,
      editorState: {}
    };
    metadata = _.assign(metadata, this.editorState);
    metadata.editorState.question = metadata.question;
    metadata.body = metadata.question;

    if (this.questionInteractionType === 'choice') {
      metadata.body = this.getMcqQuestionHtmlBody(this.editorState.question, this.editorState.templateId);
    }

    if (!_.isUndefined(this.selectedSolutionType) && !_.isEmpty(this.selectedSolutionType)) {
      const solutionObj = this.getSolutionObj(this.solutionUUID, this.selectedSolutionType, this.editorState.solutions);
      metadata.editorState.solutions = [solutionObj];
      metadata.solutions = [solutionObj];
    }
    if (_.isEmpty(this.editorState.solutions)) {
      metadata.solutions = [];
    }
    metadata = _.merge(metadata, this.getDefaultSessionContext());
    if(_.get(this.creationContext, 'objectType') === 'question') {
      metadata.programId = _.get(this.editorService, 'editorConfig.context.programId');
      metadata.collectionId = _.get(this.editorService, 'editorConfig.context.collectionIdentifier');
      metadata.organisationId = _.get(this.editorService, 'editorConfig.context.contributionOrgId');
    }
    metadata = _.merge(metadata, _.pickBy(this.childFormData, _.identity));
    return _.omit(metadata, ['question', 'numberOfOptions', 'options']);
  }

  getMcqQuestionHtmlBody(question, templateId) {
    const mcqTemplateConfig = {
      // tslint:disable-next-line:max-line-length
      mcqBody: '<div class=\'question-body\'><div class=\'mcq-title\'>{question}</div><div data-choice-interaction=\'response1\' class=\'{templateClass}\'></div></div>'
    };
    const { mcqBody } = mcqTemplateConfig;
    const questionBody = mcqBody.replace('{templateClass}', templateId)
      .replace('{question}', question);
    return questionBody;
  }

  getDefaultSessionContext() {
    return _.omitBy(_.merge(
      {
        creator: _.get(this.editorService.editorConfig, 'context.user.fullName'),
        createdBy: _.get(this.editorService.editorConfig, 'context.user.id'),
        ..._.pick(_.get(this.editorService.editorConfig, 'context'), ['board', 'medium', 'gradeLevel', 'subject', 'topic'])
      },
      {
        ..._.pick(this.questionSetHierarchy, this.configService.sessionContext)
      }
    ), key => _.isEmpty(key));
  }

  prepareRequestBody() {
    const questionId = this.questionId ? this.questionId : UUID.UUID();
    const data = this.treeService.getFirstChild();
    const activeNode = this.treeService.getActiveNode();
    const selectedUnitId = _.get(activeNode, 'data.id');
    this.editorService.data = {};
    return {
      nodesModified: {
        [questionId]: {
          metadata: _.omit(this.getQuestionMetadata(), ['creator']),
          objectType: 'Question',
          root: false,
          isNew: !this.questionId
        }
      },
      hierarchy: this.editorService._toFlatObj(data, questionId, selectedUnitId)
    };
  }

  prepareQuestionBody () {
    const requestBody = this.questionId ?
    {
      question: _.omit(this.getQuestionMetadata(), ['mimeType'])
    } :
    {
      question: {
        code: UUID.UUID(),
        ...this.getQuestionMetadata()
      }
    };
    return requestBody;
  }

  prepareSourcingUpdateBody (questionIds, comments?) {
      const sourcingUpdateAttribute = this.actionType === 'sourcingApproveQuestion' ? 'acceptedContributions'
        : 'rejectedContributions';
      const collectionObjectType = _.replace(_.lowerCase(this.creationContext['collectionObjectType']), ' ', '');
      const requestBody = {
        request: {
          [collectionObjectType]: {
            [sourcingUpdateAttribute]: questionIds
          }
        }
      };
      if (this.actionType === 'sourcingRejectQuestion') {
        requestBody.request[collectionObjectType]['rejectedContributionComments'] = comments;
        // requestBody.request[collectionObjectType]['rejectComment'] = comments;
      }
      return requestBody;
  }

  upsertQuestion(callback) {
    const requestBody = this.prepareQuestionBody();
    this.showHideSpinnerLoader(true);
    this.questionService.upsertQuestion(this.questionId, requestBody).pipe(
      finalize(() => {
        this.showHideSpinnerLoader(false);
      })).subscribe((response: ServerResponse) => {
        if (!_.includes(['submitQuestion'],this.actionType)) {
          this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.013'));
        }
        this.setQuestionId(_.get(response, 'result.identifier'));
        if (callback) callback();
      }, (err: ServerResponse) => {
          const errInfo = {
            errorMsg: 'Failed to save question. Please try again...',
          };
          this.editorService.apiErrorHandling(err, errInfo);
        });
  }

  createQuestion() {
    const requestBody = this.prepareRequestBody();
    this.showHideSpinnerLoader(true);
    this.questionService.updateHierarchyQuestionCreate(requestBody).pipe(
      finalize(() => {
        this.showHideSpinnerLoader(false);
      })).subscribe((response: ServerResponse) => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.007'));
        this.redirectToQuestionset();
      }, (err: ServerResponse) => {
          const errInfo = {
            errorMsg: 'Question creating failed. Please try again...',
          };
          this.editorService.apiErrorHandling(err, errInfo);
        });
  }

  updateQuestion() {
    const requestBody = this.prepareRequestBody();
    this.showHideSpinnerLoader(true);
    this.questionService.updateHierarchyQuestionUpdate(requestBody).pipe(
      finalize(() => {
        this.showHideSpinnerLoader(false);
      })).subscribe((response: ServerResponse) => {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.008'));
        this.redirectToQuestionset();
      }, (err: ServerResponse) => {
        const errInfo = {
          errorMsg: 'Question updating failed. Please try again...',
        };
        this.editorService.apiErrorHandling(err, errInfo);
      });
  }

  showHideSpinnerLoader(status: boolean, type?) {
    this.buttonLoaders.saveButtonLoader = status;
    if(type) {
      this.buttonLoaders[type] = status;
    }
  }

  previewContent() {
    this.validateQuestionData();
    if (this.showFormError === false) {
      this.previewFormData(false);
      const questionId = _.isUndefined(this.questionId) ? this.tempQuestionId : this.questionId;
      this.questionSetHierarchy.childNodes = [questionId];
      this.setQumlPlayerData(questionId);
      this.showPreview = true;
      this.toolbarConfig.showPreview = true;
    }
  }

  setQumlPlayerData(questionId: string) {
    const questionMetadata: any = _.cloneDeep(this.getQuestionMetadata());
    questionMetadata.identifier = questionId;
    this.questionSetHierarchy.children = [questionMetadata];
    this.editorCursor.setQuestionMap(questionId, questionMetadata);
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

  setQuestionId(questionId) {
    this.questionId = questionId;
  }

  setQuestionTitle(questionId?) {
    let index;
    let questionTitle = '';
    if(_.get(this.creationContext, 'objectType') === 'question') {
      if (!_.isUndefined(this.questionPrimaryCategory)) {
        questionTitle = this.questionPrimaryCategory;
      }
    }
    else {
      let hierarchyChildren = this.treeService.getChildren();
      if (!_.isUndefined(questionId)) {
        const parentNode = this.treeService.getActiveNode().getParent();
        hierarchyChildren = parentNode.getChildren();
        index =  _.findIndex(hierarchyChildren, (node) => node.data.id === questionId);
        const question  = hierarchyChildren[index];
        questionTitle = `Q${(index + 1).toString()} | ` + question.data.primaryCategory;
      } else {
        index = hierarchyChildren.length;
        questionTitle = `Q${(index + 1).toString()} | `;
        if (!_.isUndefined(this.questionPrimaryCategory)) {
          questionTitle = questionTitle + this.questionPrimaryCategory;
        }
      }
    }
    this.toolbarConfig.title = questionTitle;
  }
  output(event) { }

  onStatusChanges(event) {
  }

  valueChanges(event) {
    if(_.get(this.creationContext, 'objectType') === 'question') {
      event.maxScore = event.maxScore? parseInt(event.maxScore) : null;
    }
    this.childFormData = event;
  }
  validateFormFields() {
    _.forEach(this.questionFormConfig, (formFieldCategory) => {
      if (formFieldCategory.required && !this.childFormData[formFieldCategory.code]) {
        this.showFormError = true;
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.008'));
        return false;
      }
    });
    return true;
  }
  previewFormData(status) {
    const formvalue = _.cloneDeep(this.questionFormConfig);
    this.questionFormConfig = null;
    _.forEach(formvalue, (formFieldCategory) => {
      if (_.has(formFieldCategory, 'editable')) {
        formFieldCategory.editable = status ? _.find(this.initialLeafFormConfig, { code: formFieldCategory.code }).editable : status;
        formFieldCategory.default = this.childFormData[formFieldCategory.code];
      }
    });
    this.questionFormConfig = formvalue;
  }
  isEditable(fieldCode) {
    if (this.creationMode === 'edit') {
      return true;
    }
    if (!this.questionId) {
      return true;
    }
    /*
    const editableFields = this.creationContext.editableFields;
    if (editableFields && !_.isEmpty(editableFields[this.creationContext.mode]) && _.includes(editableFields[this.creationContext.mode], fieldCode)) {
      return true;
    }
    */
    return false;
  }

  populateFormData() {
    this.childFormData = {};
    _.forEach(this.leafFormConfig, (formFieldCategory) => {
      formFieldCategory.editable = formFieldCategory.editable ? this.isEditable(formFieldCategory.code) : false;
      if (!_.isUndefined(this.questionId)) {
        if (this.questionMetaData && _.has(this.questionMetaData, formFieldCategory.code)) {
          formFieldCategory.default = this.questionMetaData[formFieldCategory.code];
          this.childFormData[formFieldCategory.code] = this.questionMetaData[formFieldCategory.code];
        }
      } else {
        // tslint:disable-next-line:max-line-length
        const questionSetDefaultValue = _.get(this.questionSetHierarchy, formFieldCategory.code) ? _.get(this.questionSetHierarchy, formFieldCategory.code) : '';
        const defaultEditStatus = _.find(this.initialLeafFormConfig, {code: formFieldCategory.code}).editable === true;
        formFieldCategory.default = defaultEditStatus ? '' : questionSetDefaultValue;
        this.childFormData[formFieldCategory.code] = formFieldCategory.default;
      }
    });
    this.fetchFrameWorkDetails();
  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
    this.editorCursor.clearQuestionMap();
  }
}
