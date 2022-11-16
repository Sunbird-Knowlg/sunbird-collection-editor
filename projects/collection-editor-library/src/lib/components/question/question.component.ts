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
import { throwError, Subject} from 'rxjs';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config/config.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { TreeService } from '../../services/tree/tree.service';
import { EditorCursor } from '../../collection-editor-cursor.service';
import { filter, finalize, take, takeUntil } from 'rxjs/operators';
import { SubMenu } from '../question-option-sub-menu/question-option-sub-menu.component';
import { ICreationContext } from '../../interfaces/CreationContext';

const evidenceMimeType='';
const evidenceSizeLimit='20480';

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
  @Input() sourcingSettings: any;
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
  public questionMetadataFormStatus = true;
  public buttonLoaders = {
    saveButtonLoader: false,
    'review': false
  };
  public showTranslation = false;
  subMenus: SubMenu[];
  showAddSecondaryQuestionCat: boolean;
  sliderDatas: any = {};
  sliderOptions: any = {};
  hints: any;
  categoryLabel: any = {};
  scoreMapping: any;
  condition = 'default';
  targetOption: any;
  responseVariable = 'response1';
  newQuestionID: any;
  showOptions: boolean;
  selectedOptions: any;
  options = [];
  isChildQuestion = false;
  branchingLogic: any;
  selectedSectionId: any;
  sectionPrimaryCategory: any;
  maxScore = 1;
  public questionFormConfig: any;
  treeNodeData: any;
  showEcmList = false;
  ecmList = [];
  selectedEcm: any;
  groups: any;
  showQualityParameterPopup: boolean =false;
  public qualityFormConfig: any;
  requestChangesPopupAction: string;
  constructor(
    private questionService: QuestionService, public editorService: EditorService, public telemetryService: EditorTelemetryService,
    public playerService: PlayerService, private toasterService: ToasterService, private treeService: TreeService,
    private frameworkService: FrameworkService, private router: Router, public configService: ConfigService,
    private editorCursor: EditorCursor) {
    const { primaryCategory, label } = this.editorService.selectedChildren;
    this.questionPrimaryCategory = primaryCategory;
    this.pageStartTime = Date.now();
    this.categoryLabel = [];
    this.getOptions();
    if (!_.isUndefined(label)) {
      this.categoryLabel[primaryCategory] = label;
    }
  }

  ngOnInit() {
    const { questionSetId, questionId, type, category, config, creationContext, creationMode, setChildQuestion } = this.questionInput;
    console.log(this.questionInput);
    this.questionInteractionType = type;
    this.questionCategory = category;
    this.questionId = questionId;
    this.questionSetId = questionSetId;
    this.creationContext = creationContext;
    this.creationMode = creationMode;
    this.unitId = this.creationContext?.unitIdentifier;
    this.isReadOnlyMode = this.creationContext?.isReadOnlyMode;
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.toolbarConfig.showPreview = this.editorService.editorMode !== 'edit';
    this.toolbarConfig.add_translation = true;
    this.isChildQuestion  = !_.isUndefined(setChildQuestion) ? setChildQuestion : false;
    this.treeNodeData = this.treeService.getFirstChild();
    // this.getAllQuestionDetails();
    if (_.get(this.creationContext, 'objectType') === 'question') { this.toolbarConfig.questionContribution = true; }
    this.solutionUUID = UUID.UUID();
    this.telemetryService.telemetryPageId = this.pageId;
    this.initialLeafFormConfig = _.cloneDeep(this.leafFormConfig);
    this.initialize();
    this.framework = _.get(this.editorService.editorConfig, 'context.framework');
    this.qualityFormConfig = this.editorService.qualityFormConfig;
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
      const parentId = this.editorService.parentIdentifier ? this.editorService.parentIdentifier : this.questionId;
      // only for observation,survey,observation with rubrics
      if (!_.isUndefined(this.editorService.editorConfig.config.renderTaxonomy)) {
        this.showEcmList = _.get(this.editorService, 'editorConfig.config.renderTaxonomy');
        const ecmData = _.get(this.treeNodeData, 'data.metadata.ecm');
        _.forEach(ecmData, (ecm) => {
          this.ecmList.push({ value: ecm, label: ecm });
        });
        if (!_.isUndefined(parentId)) {
          this.getParentQuestionOptions(parentId);
          const sectionData = this.treeService.getNodeById(parentId);
          const children = _.get(response, 'result.questionSet.children');
          this.sectionPrimaryCategory = _.get(response, 'result.questionSet.primaryCategory');
          this.selectedSectionId = _.get(sectionData, 'data.metadata.parent');
          this.setQuestionEcm();
          this.getBranchingLogic(children);
        }
      }
      this.questionFormConfig = _.cloneDeep(this.leafFormConfig);
      let leafFormConfigFields = _.join(_.map(this.leafFormConfig, value => (value.code)), ',');
      leafFormConfigFields += ',isReviewModificationAllowed';
      if (!_.isUndefined(this.questionId)) {
        this.questionService.readQuestion(this.questionId, leafFormConfigFields)
          .subscribe((res) => {
            if (_.get(res, 'result')) {
              this.questionMetaData = _.get(res, 'result.question');
              this.questionPrimaryCategory = _.get(this.questionMetaData,'primaryCategory');
              // tslint:disable-next-line:max-line-length
              this.questionInteractionType = _.get(this.questionMetaData,'interactionTypes') ? _.get(this.questionMetaData,'interactionTypes[0]') : 'default';
              this.editorService.setIsReviewModificationAllowed(_.get(this.questionMetaData, 'isReviewModificationAllowed', false));
              this.populateFormData();
              if (this.questionInteractionType === 'default') {
                if (this.questionMetaData.editorState) {
                  this.editorState = this.questionMetaData.editorState;
                }
              }

              if (this.questionInteractionType === 'slider') {
                if (this.questionMetaData.editorState) {
                  this.editorState = this.questionMetaData.editorState;
                  this.sliderOptions = this.questionMetaData.interactions.response1;
                  this.sliderDatas = this.questionMetaData.interactions.response1;
                  this.hints = this.questionMetaData.hints;
                }
              }

              if (this.questionInteractionType === 'text') {
                if (this.questionMetaData.editorState) {
                  this.editorState = this.questionMetaData.editorState;
                }
              }

              if (this.questionInteractionType === 'date') {
                if (this.questionMetaData.editorState) {
                  this.editorState = this.questionMetaData.editorState;
                }
              }

              if (this.questionInteractionType === 'choice') {
                const responseDeclaration = this.questionMetaData.responseDeclaration;
                this.scoreMapping = _.get(responseDeclaration, 'response1.mapping');
                const templateId = this.questionMetaData.templateId;
                const numberOfOptions = this.questionMetaData?.editorState?.options?.length || 0;
                const maximumOptions = _.get(this.questionInput, 'config.maximumOptions');
                this.editorService.optionsLength = numberOfOptions;
                const options = _.map(this.questionMetaData?.editorState?.options, option => ({ body: option.value.body }));
                const question = this.questionMetaData?.editorState?.question;
                const interactions = this.questionMetaData?.interactions;
                this.editorState = new McqForm({
                  question, options, answer: _.get(responseDeclaration, 'response1.correctResponse.value')
                }, { templateId, numberOfOptions,maximumOptions });
                this.editorState.solutions = this.questionMetaData?.editorState?.solutions;
                this.editorState.interactions = interactions;
                if (_.has(this.questionMetaData, 'responseDeclaration')) {
                  this.editorState.responseDeclaration = _.get(this.questionMetaData, 'responseDeclaration');
                }
              }
              if (_.has(this.questionMetaData, 'primaryCategory')) {
                this.editorState.primaryCategory = _.get(this.questionMetaData, 'primaryCategory');
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
              /** for observation and survey to show hint,tip,dependent question option. */
              if(!_.isUndefined(this.editorService?.editorConfig?.config?.renderTaxonomy)){
                this.subMenuConfig();
              }
              this.contentComment = _.get(this.creationContext, 'correctionComments');
              if (this.showPreview) {
                this.previewContent();
              }
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
            this.editorState = { question: '', answer: '', solutions: '' };
          }
          this.editorState = { ...editorState };
        }
        else if (this.questionInteractionType === 'choice') {
          this.editorState = new McqForm({ question: '', options: [] }, { numberOfOptions: _.get(this.questionInput, 'config.numberOfOptions'), maximumOptions: _.get(this.questionInput, 'config.maximumOptions') });
        }
        /** for observation and survey to show hint,tip,dependent question option. */
        if(!_.isUndefined(this.editorService?.editorConfig?.config?.renderTaxonomy)){
          this.subMenuConfig();
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
        this.showAddSecondaryQuestionCat = false;
        this.saveContent();
        break;
      case 'showTranslation':
        this.showTranslation = true;
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
        this.isReadOnlyMode = false;
        this.showPreview = false;
        this.toolbarConfig.showPreview = false;
        this.previewFormData(!this.toolbarConfig.showPreview);
        break;
      case 'showReviewcomments':
        this.showReviewModal = !this.showReviewModal;
        break;
      case 'saveQualityParameters' :
        this.showQualityParameterPopup = true;
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
    if (this.showFormError === false) {
      this.showSubmitConfirmPopup = true;
    }
  }

  saveContent() {
    this.validateQuestionData();
    if (this.showFormError === false && this.questionMetadataFormStatus === true) {
      this.saveQuestion();
    } else {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.044'));
    }
  }

  onConsentSubmit(event) {
    this.showSubmitConfirmPopup = false;
    if (event) {
      this.questionMetaData = _.assign(this.questionMetaData, {isReviewModificationAllowed: event.editingConsent});
      this.sendForReview();
    }
  }

  sendForReview() {
    if (!_.get(this.editorService.editorConfig, 'config.skipTwoLevelReview')) {
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
    } else {
      const publishCallback = this.sendQuestionForPublish.bind(this);
      const callback = this.addResourceToQuestionset.bind(this, publishCallback);
      this.upsertQuestion(callback);
    }
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
      if (!(this.creationMode === 'sourcingReview' && this.editorService.isReviewModificationAllowed)) {
        this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.037'));
      }
      this.redirectToChapterList();
    }, err => {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.038'));
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
      let successMessage = '';
      this.editorService.fetchCollectionHierarchy(this.questionSetId).subscribe(res => {
        const questionSet = res.result['questionSet'];
        switch (event.button) {
          case 'sourcingApproveQuestion':
            questionIds = questionSet.acceptedContributions || [];
            successMessage = _.get(this.configService, 'labelConfig.messages.success.038')
            break;
          case 'sourcingRejectQuestion':
            questionIds = questionSet.rejectedContributions || [];
            comments = questionSet.rejectedContributionComments || {};
            comments[this.questionId] = event.comment;
            successMessage = _.get(this.configService, 'labelConfig.messages.success.039')
            break;
          default:
            break;
        }
        questionIds.push(this.questionId);
        event['requestBody'] = this.prepareSourcingUpdateBody(questionIds, comments);
        this.editorService.updateCollection(this.questionSetId, event).subscribe(res => {
          this.toasterService.success(successMessage);
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
            this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.040'));
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
    } else {
      this.showFormError = false;
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
      const data = _.get(this.treeNodeData, 'data.metadata');
      if (_.get(this.editorState, 'interactionTypes[0]') === 'choice' &&
        _.isEmpty(this.editorState?.responseDeclaration?.response1?.mapping) &&
        !_.isUndefined(this.editorService?.editorConfig?.config?.renderTaxonomy) &&
        _.get(data,'allowScoring') === 'Yes') {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.005'));  
        this.showFormError = true;
        return;
      } else {
        this.showFormError = false;
      }
      const optionValid = _.find(this.editorState.options, option =>
        (option.body === undefined || option.body === '' || option.length > this.setCharacterLimit));
      if (optionValid || (!this.editorState.answer && this.sourcingSettings?.enforceCorrectAnswer)) {
        this.showFormError = true;
        return;
      } else {
        this.showFormError = false;
      }
    }

    if (this.questionInteractionType === 'slider') {
      const min = _.get(this.sliderDatas, 'validation.range.min');
      const max = _.get(this.sliderDatas, 'validation.range.max');
      const step =  _.get(this.sliderDatas, 'step');
      if (_.isEmpty(this.sliderDatas) || _.isEmpty(min) || _.isEmpty(max) || _.isEmpty(step)) {
        this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.005'));
        this.showFormError = true;
      } else {
        this.showFormError = false;
      }
    }

  }

  redirectToQuestionset() {
    this.showConfirmPopup = false;
    this.treeService.clearTreeCache();
    setTimeout(() => {
      this.showAddSecondaryQuestionCat ?
      this.questionEmitter.emit({ type: 'createNewContent', isChildQuestion: true }) :
      this.editorService.parentIdentifier = undefined;
      this.showAddSecondaryQuestionCat = false;
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

  addResourceToQuestionset(callback = null) {
    this.editorService.addResourceToQuestionset(this.questionSetId, this.unitId, this.questionId).subscribe(res => {
      if (callback) {
        callback();
      } else {
        this.redirectToChapterList();
      }
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
        const callback = this.addResourceToQuestionset.bind(this);
        this.upsertQuestion(callback);
      } else if (this.creationMode === 'sourcingReview') {
        const callback = this.sendQuestionForPublish.bind(this);
        this.upsertQuestion(callback);
      } else {
        this.upsertQuestion(undefined);
      }
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
    console.log('getQuestionMetadata');
    console.log(this.editorState);
    metadata = _.assign(metadata, this.editorState);
    metadata.editorState.question = metadata.question;
    metadata.body = metadata.question;
    const treeNodeData = _.get(this.treeNodeData, 'data.metadata');
    _.get(treeNodeData,'allowScoring') === 'Yes' ? '' : _.set(metadata,'responseDeclaration.response1.mapping',[]);

    if (this.questionInteractionType === 'choice') {
      metadata.body = this.getMcqQuestionHtmlBody(this.editorState.question, this.editorState.templateId);
    } else {
      metadata.responseDeclaration = this.getResponseDeclaration(this.questionInteractionType);
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
    if (this.questionInteractionType === 'choice') {
      if (!_.isUndefined(this.editorService.editorConfig.config.renderTaxonomy)){
        const scoreArray = [];
        const score = _.get(metadata, 'responseDeclaration.response1.mapping');
        _.forEach(score, (data) => {
          scoreArray.push(+_.get(data, 'outcomes.score'));
        });
        // tslint:disable-next-line:max-line-length
        this.maxScore = _.get(this.childFormData, 'allowMultiSelect') === 'No' ? Math.max(...scoreArray) : _.sum(scoreArray) ;
        metadata.responseDeclaration.response1.minScore = Math.min(...scoreArray);
      }
      metadata.responseDeclaration.response1.maxScore = this.maxScore;
      // metadata.responseDeclaration.response1.correctResponse.outcomes.SCORE = this.maxScore;
    }
    metadata = _.merge(metadata, _.pickBy(this.childFormData, _.identity));
    if (_.get(this.creationContext, 'objectType') === 'question') {
      metadata.isReviewModificationAllowed = !!_.get(this.questionMetaData, 'isReviewModificationAllowed');
    }
    // tslint:disable-next-line:max-line-length
    return _.omit(metadata, ['question', 'numberOfOptions', 'options', 'allowMultiSelect', 'showEvidence', 'evidenceMimeType', 'showRemarks', 'markAsNotMandatory', 'leftAnchor', 'rightAnchor', 'step', 'numberOnly', 'characterLimit', 'dateFormat', 'autoCapture', 'remarksLimit', 'maximumOptions']);
  }

  getResponseDeclaration(type) {
    const responseDeclaration = {
      response1: {
        type: type === 'slider' ? 'integer' : 'string'
      }
    };
    if (type === 'text' || type === 'slider') {
      responseDeclaration.response1['maxScore'] = this.maxScore;
    }
    return responseDeclaration;
  }



  getMcqQuestionHtmlBody(question, templateId) {
    const mcqTemplateConfig = {
      // tslint:disable-next-line:max-line-length
      mcqBody: '<div class=\'question-body\' tabindex=\'-1\'><div class=\'mcq-title\' tabindex=\'0\'>{question}</div><div data-choice-interaction=\'response1\' class=\'{templateClass}\'></div></div>'
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

  setQuestionTypeValues(metaData) {
    metaData.showEvidence = this.childFormData.showEvidence;
    if (metaData.showEvidence === 'Yes') {
        metaData.evidence = {
          required: 'No',
          mimeType: this.childFormData.evidenceMimeType,
          minCount: 1,
          maxCount: 1,
          sizeLimit: evidenceSizeLimit,
        };
    }
    metaData.showRemarks = this.childFormData.showRemarks;
    if (metaData.showRemarks === 'Yes') {
      metaData.remarks = {
        maxLength:  this.childFormData.remarksLimit,
        required: 'No'
      };
    }
    metaData.interactions = metaData.interactions || {};

    metaData.interactions.validation = { required: this.childFormData.markAsNotMandatory === 'Yes' ? 'No' : 'Yes'};
    metaData.responseDeclaration.response1.cardinality = _.get(this.childFormData, 'allowMultiSelect') === 'Yes' ? 'multiple' : 'single';

    _.forEach(this.subMenus, (el: any) => {
      if (el.id === 'addHint') {
        metaData.hints = {
          en: [el.value]
        };
      }
      if (el.id === 'addTip') {
        metaData.instructions = {
          en: [el.value]
        };
      }
    });

    if (!_.isEmpty(this.sliderDatas) && this.questionInteractionType === 'slider') {
      metaData.interactionTypes = [this.questionInteractionType];
      metaData.primaryCategory = this.questionPrimaryCategory;
      metaData.interactions = {
        ...metaData.interactions,
        response1: {
          validation: this.sliderDatas.validation,
          step: this.sliderDatas.step
        }
      };
    }

    if (this.questionInteractionType === 'date') {
      metaData.interactionTypes = [this.questionInteractionType];
      metaData.primaryCategory = this.questionPrimaryCategory;
      metaData.interactions = {
        ...metaData.interactions,
        response1: {
          validation: {pattern: this.childFormData.dateFormat},
          autoCapture: this.childFormData.autoCapture
        }
      };
  }

    if (this.questionInteractionType === 'text') {
      metaData.interactionTypes = [this.questionInteractionType];
      metaData.primaryCategory = this.questionPrimaryCategory;
      metaData.interactions = {
        ...metaData.interactions,
        response1: {
          validation: {
            limit: {
              maxLength: this.childFormData.characterLimit,
            }
          },
          type: {
            number: this.childFormData.numberOnly
          }
        }
      };
    }
    //  return metaData;
  }

  prepareRequestBody() {
    const questionId = this.questionId ? this.questionId : UUID.UUID();
    this.newQuestionID = questionId;
    const data = this.treeNodeData;
    const activeNode = this.treeService.getActiveNode();
    const selectedUnitId = _.get(activeNode, 'data.id');
    this.editorService.data = {};
    this.editorService.selectedSection = selectedUnitId;
    const metaData = this.getQuestionMetadata();
    this.setQuestionTypeValues(metaData);
    return {
      nodesModified: {
        [questionId]: {
          metadata: _.omit(metaData, ['creator']),
          objectType: 'Question',
          root: false,
          isNew: !this.questionId
        }
      },
      hierarchy: this.editorService.getHierarchyObj(data, questionId, selectedUnitId)
    };
  }

  prepareQuestionBody () {
    return this.questionId ?
    {
      question: _.omit(this.getQuestionMetadata(), ['mimeType', 'creator', 'createdBy', 'organisationId'])
    } :
    {
      question: {
        code: UUID.UUID(),
        ...this.getQuestionMetadata()
      }
    };
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
    console.log('CreateQuestion');
    if (this.showOptions) {
      this.buildCondition('create');
    } else {
      const requestBody = this.prepareRequestBody();
      this.saveQuestions(requestBody, 'create');
  }
}


  saveQuestions(requestBody, type?) {
    this.showHideSpinnerLoader(true);
    this.questionService.updateHierarchyQuestionCreate(requestBody).pipe(
      finalize(() => {
        this.showHideSpinnerLoader(false);
      })).subscribe((response: ServerResponse) => {
        const result = _.get(response.result.identifiers, this.newQuestionID);
        if (this.showAddSecondaryQuestionCat) {
          this.editorService.parentIdentifier = result;
        }
        if (!_.isEmpty(this.selectedEcm)){
          this.buildEcm(result);
        } else{
          if (type === 'create') {
            this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.007'));
          } else {
            this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.008'));
          }
          this.redirectToQuestionset();
        }
      }, (err: ServerResponse) => {
          const errInfo = {
            errorMsg: 'Question creating failed. Please try again...',
          };
          this.editorService.apiErrorHandling(err, errInfo);
        });
  }


  updateQuestion() {
    console.log('updateQuestion');
    if (this.isChildQuestion) {
      this.buildCondition('update');
    } else {
      this.saveUpdateQuestions();
    }
  }

 saveUpdateQuestions() {
    const requestBody = this.prepareRequestBody();
    this.showHideSpinnerLoader(true);
    this.questionService.updateHierarchyQuestionUpdate(requestBody).pipe(
      finalize(() => {
        this.showHideSpinnerLoader(false);
      })).subscribe((response: ServerResponse) => {
        const result = _.get(response.result.identifiers, this.questionId);
        if (this.showAddSecondaryQuestionCat) {
          this.editorService.parentIdentifier = result;
        }

        if (!_.isEmpty(this.selectedEcm)){
          this.buildEcm(result);
        } else{
          this.toasterService.success(_.get(this.configService, 'labelConfig.messages.success.008'));
          this.redirectToQuestionset();
        }
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
    if (this.showFormError === false && this.questionMetadataFormStatus === true) {
      this.previewFormData(false);
      const activeNode = this.treeService.getActiveNode();
      let questionId = '';
      if (_.isUndefined(this.questionId)) {
        questionId = this.tempQuestionId;
        this.setParentConfig(activeNode?.data?.metadata);
      } else {
        questionId = this.questionId;
        this.setParentConfig(activeNode?.parent?.data?.metadata);
      }
      this.questionSetHierarchy.childNodes = [questionId];
      this.setQumlPlayerData(questionId);
      this.showPreview = true;
      this.toolbarConfig.showPreview = true;
    } else {
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.044'));
    }
  }

  setParentConfig(parentConfig) {
    this.questionSetHierarchy.showSolutions = !_.isUndefined(parentConfig?.showSolutions) ?
    parentConfig.showSolutions : 'No';
    this.questionSetHierarchy.shuffle = !_.isUndefined(parentConfig?.shuffle) ?
    parentConfig.shuffle : true;
    this.questionSetHierarchy.showFeedback = !_.isUndefined(parentConfig?.showFeedback) ?
    parentConfig.showFeedback : 'No';
  }

  setQumlPlayerData(questionId: string) {
    const questionMetadata: any = _.cloneDeep(this.getQuestionMetadata());
    questionMetadata.identifier = questionId;
    this.questionSetHierarchy.children = [questionMetadata];
    if (this.questionSetHierarchy.shuffle === true) {
      // tslint:disable-next-line:no-string-literal
      this.questionSetHierarchy['maxScore'] = 1;
    } else {
      if (questionMetadata.qType === 'SA') {
        this.questionSetHierarchy = _.omit(this.questionSetHierarchy, 'maxScore');
      } else if (questionMetadata.maxScore) {
        // tslint:disable-next-line:no-string-literal
        this.questionSetHierarchy['maxScore'] = this.maxScore;
      }
    }
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
    if (_.get(this.creationContext, 'objectType') === 'question') {
      if (!_.isUndefined(this.questionPrimaryCategory)) {
        questionTitle = this.questionPrimaryCategory;
      }
    } else {
      let hierarchyChildren = this.treeService.getChildren();
      if (!_.isUndefined(questionId)) {
          const parentNode = this.treeService.getActiveNode().getParent();
          hierarchyChildren = parentNode.getChildren();
          _.forEach(hierarchyChildren, (child) => {
            if (child.children) {
              index =  _.findIndex(child.children, { identifier: questionId });
              const question  = child.children[index];
              // tslint:disable-next-line:max-line-length
              questionTitle = `Q${(index + 1).toString()} | ` + (_.get(this.categoryLabel, `${question.primaryCategory}`) || question.primaryCategory);
            } else {
              index =  _.findIndex(hierarchyChildren, (node) => node.data.id === questionId);
              const question  = hierarchyChildren[index];
              // tslint:disable-next-line:max-line-length
              questionTitle = `Q${(index + 1).toString()} | ` + (_.get(this.categoryLabel, `${_.get(question, 'data.primaryCategory')}`) || _.get(question, 'data.primaryCategory'));
            }
        });

      } else {
        index = hierarchyChildren.length;
        questionTitle = `Q${(index + 1).toString()} | `;
        if (!_.isUndefined(this.questionPrimaryCategory)) {
          questionTitle = questionTitle + (_.get(this.categoryLabel, `${this.questionPrimaryCategory}`) || this.questionPrimaryCategory);
        }
      }
    }
    this.toolbarConfig.title = questionTitle;
  }

  output(event) { }

  onStatusChanges(event) {
    if (_.has(event, 'isValid')) {
      this.questionMetadataFormStatus = event.isValid;
    }
  }

  valueChanges(event) {
    if (_.has(event, 'maxScore')) {
      // tslint:disable-next-line:radix
      event.maxScore = !_.isNull(event.maxScore) ? parseInt(event.maxScore) : this.maxScore;
      this.maxScore = event.maxScore;
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
    const formConfig = _.cloneDeep(this.leafFormConfig);
    this.questionFormConfig = null;
    _.forEach(formConfig, (formFieldCategory) => {
      if (_.has(formFieldCategory, 'editable') && !_.isUndefined(formFieldCategory.editable)) {
        formFieldCategory.editable = status ? _.find(this.leafFormConfig, { code: formFieldCategory.code }).editable : status;
        formFieldCategory.default = this.childFormData[formFieldCategory.code];
      }
    });
    this.questionFormConfig = formConfig;
  }

  isEditable(fieldCode) {
    if (this.creationMode === 'edit') {
      return true;
    }
    if (!this.questionId) {
      return true;
    }
    return false;
  }

  populateFormData() {
    this.childFormData = {};
    _.forEach(this.leafFormConfig, (formFieldCategory) => {
      if (!_.isUndefined(this.questionId)) {
        if (formFieldCategory.code === 'maxScore' && this.questionInteractionType === 'choice') {
          this.childFormData[formFieldCategory.code] = _.has(this.questionMetaData, 'responseDeclaration.response1.maxScore') ?
          _.get(this.questionMetaData, 'responseDeclaration.response1.maxScore') : this.maxScore;
        } else if (formFieldCategory.code === 'allowMultiSelect' && this.questionInteractionType === 'choice') {
          this.childFormData[formFieldCategory.code] = _.get(this.questionMetaData, 'responseDeclaration.response1.cardinality') === 'multiple' ? 'Yes' : 'No';
        }
        else if (this.questionMetaData && _.has(this.questionMetaData, formFieldCategory.code)) {
          formFieldCategory.default = this.questionMetaData[formFieldCategory.code];
          this.childFormData[formFieldCategory.code] = this.questionMetaData[formFieldCategory.code];
        }
        try {
          const availableAlias = {
            dateFormat: 'interactions.response1.validation.pattern',
            autoCapture: 'interactions.response1.autoCapture',
            markAsNotMandatory: 'interactions.validation.required',
            numberOnly: 'interactions.response1.type.number',
            characterLimit: 'interactions.response1.validation.limit.maxLength',
            remarksLimit: 'remarks.maxLength',
            evidenceMimeType: 'evidence.mimeType'
          };
          if (this.questionMetaData && _.has(availableAlias, formFieldCategory.code)) {
            let defaultValue = _.get(this.questionMetaData, availableAlias[formFieldCategory.code]);
            if (formFieldCategory.code === 'markAsNotMandatory') {
              defaultValue === 'Yes' ? (defaultValue = 'No') : (defaultValue = 'Yes');
            }
            formFieldCategory.default = defaultValue;
            this.childFormData[formFieldCategory.code] = defaultValue;
          }
        } catch (error) {

        }
      } else {
        // tslint:disable-next-line:max-line-length
        const questionSetDefaultValue = _.get(this.questionSetHierarchy, formFieldCategory.code) ? _.get(this.questionSetHierarchy, formFieldCategory.code) : '';
        const defaultEditStatus = _.find(this.initialLeafFormConfig, {code: formFieldCategory.code}).editable === true;
        formFieldCategory.default = defaultEditStatus ? '' : questionSetDefaultValue;
        this.childFormData[formFieldCategory.code] = formFieldCategory.default;
        if (formFieldCategory.code === 'maxScore' && this.questionInteractionType === 'choice') {
          this.childFormData[formFieldCategory.code] = this.maxScore;
        }
      }
    });
    this.fetchFrameWorkDetails();
    // tslint:disable-next-line:max-line-length
    (this.isReadOnlyMode === true && !_.isUndefined(this.editorService?.editorConfig?.config?.renderTaxonomy)) ? this.previewFormData(false) : this.previewFormData(true);
  }

  subMenuChange({ index, value }) {
    if (this.subMenus[index].id === 'addDependantQuestion') {
      this.showAddSecondaryQuestionCat = true;
      this.saveContent();
      if (this.showFormError) {
        this.showAddSecondaryQuestionCat = false;
        return;
      }
    }
    this.subMenus[index].value = value;
  }

  get dependentQuestions() {
    try {
       return this.subMenus.filter(menu => menu.id === 'addDependantQuestion')[0].value;
    } catch (error) {
      return null;
    }
  }
  subMenuConfig() {
    this.subMenus = [
      {
        id: 'addHint',
        name: 'Add Hint',
        value: _.get(this.questionMetaData, 'hints.en[0]'),
        label: 'Hint',
        enabled: _.get(this.questionMetaData, 'hints.en[0]') ? true : false,
        type: 'input',
        show: _.get(this.sourcingSettings, 'showAddHints')
      },
      {
        id: 'addTip',
        name: 'Add Tip',
        value: _.get(this.questionMetaData, 'instructions.en[0]'),
        label: 'Tip',
        enabled: _.get(this.questionMetaData, 'instructions.en[0]') ? true : false,
        type: 'input',
        show: _.get(this.sourcingSettings, 'showAddTips')
      },
      {
        id: 'addDependantQuestion',
        name: 'Add Dependant Question',
        label: '',
        value: [],
        enabled: false,
        type: '',
        show: _.get(this.sourcingSettings, 'showAddSecondaryQuestion') && !this.questionInput.setChildQuestion
      },
    ];
    if (!_.get(this.sourcingSettings, 'showAddSecondaryQuestion') && !this.questionInput.setChildQuestion) {
      this.showOptions = false;
    } else {
    this.showOptions = (this.questionInput.setChildQuestion === true) ? true : false;
  }
  }
  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
    this.editorCursor.clearQuestionMap();
  }

  sliderData($event) {
    const val = $event;
    const obj = {
      validation: {
        range: {
          min: '',
          max: ''
        }
      },
      step: ''
    };
    if (val.leftAnchor) {
      obj.validation.range.min = val.leftAnchor;
    }
    if (val.rightAnchor) {
      obj.validation.range.max = val.rightAnchor;
    }
    if (val.step) {
      obj.step = val.step;
    }
    this.sliderDatas = obj;
  }

  optionHandler(e) {
    this.targetOption = e.target.value;
  }


  buildCondition(type) {
    if(this.condition ==='default' || _.isEmpty(this.selectedOptions) ){
      this.toasterService.error(_.get(this.configService, 'labelConfig.messages.error.038'));
      return;
    }
    const questionId = this.questionId ? this.questionId : UUID.UUID();
    const data = this.treeNodeData;
    const hierarchyData = this.editorService.getHierarchyObj(data, '', this.selectedSectionId);
    const sectionData = _.get(hierarchyData, `${this.selectedSectionId}`);
    const sectionName = sectionData.name;
    const branchingLogic = {
      ...this.branchingLogic,
      [this.editorService.parentIdentifier]: {
        target: this.updateTarget(questionId),
        preCondition: {},
        source: []
      },
      [questionId]: {
        target: [],
        source: [this.editorService.parentIdentifier],
        preCondition: {
          and: [
            {
              [this.condition]: [
                {
                  var: `${this.editorService.parentIdentifier}.${this.responseVariable}.value`,
                  type: 'responseDeclaration',
                },
                this.selectedOptions,
              ],
            },
          ],
        },
      },
  };
    this.updateTreeCache(sectionName, branchingLogic, this.selectedSectionId);
    const metaData = this.getQuestionMetadata();
    this.setQuestionTypeValues(metaData);
    const finalResult = {
      nodesModified: {
        [questionId]: {
          metadata: metaData,
          objectType: 'Question',
          root: false,
          isNew: this.questionId ? false : true
        },
        [this.selectedSectionId]: {
          ...this.treeService.treeCache.nodesModified[this.selectedSectionId]
        }
      },
      hierarchy: this.editorService.getHierarchyObj(data, questionId, this.selectedSectionId,this.editorService.parentIdentifier)
    };
    this.saveQuestions(finalResult, type);
  }

  updateTarget(questionId) {
    if (!_.isEmpty(this.branchingLogic) && _.get(this.branchingLogic, `${this.editorService.parentIdentifier}.target`)) {
      if (this.branchingLogic[this.editorService.parentIdentifier].target.includes(questionId)) {
        return [...this.branchingLogic[this.editorService.parentIdentifier].target];
      }
      return [...this.branchingLogic[this.editorService.parentIdentifier].target, `${questionId}`];
    }
    return [`${questionId}`];
  }

  getOptions() {
    if (this.editorService.optionsLength) {
      this.options = [];
      Array.from({length: this.editorService.optionsLength}, (x, i) => {
        this.options.push({value: i, label: i});
      });
    }
  }

  getParentQuestionOptions(questionId) {
    this.editorService.parentIdentifier = questionId;
    this.questionService.readQuestion(questionId)
    .subscribe((res) => {
      if (res.responseCode === 'OK') {
        const result = res.result.question;
        if (result.interactionTypes[0] === 'choice') {
          const numberOfOptions = result.editorState.options.length;
          this.editorService.optionsLength = numberOfOptions;
          this.getOptions();
        }
      }
    });
  }

  updateTreeCache(sectionName, branchingLogic, selectedSection) {
    const metadata = {
      name: sectionName,
      primaryCategory: this.sectionPrimaryCategory,
      allowBranching: 'Yes',
      branchingLogic
    };
    this.treeService.updateNode(metadata, selectedSection, this.sectionPrimaryCategory);
  }

  setCondition(data) {
    const Condition = _.get(data?.branchingLogic, `${this.questionId}.preCondition.and[0]`);
    const getCondition = Object.keys(Condition);
    this.condition = getCondition[0];
    this.selectedOptions = Condition[getCondition][1];
  }

  getBranchingLogic(children) {
    _.forEach(children, (data) => {
      if (data.identifier === this.selectedSectionId) {
        if (!_.isUndefined(data?.groups)){
          this.groups = _.get(data, 'groups');
        }
        this.branchingLogic = data?.branchingLogic ? data?.branchingLogic : {};
        if (_.get(data?.branchingLogic, `${this.questionId}.source[0]`)) {
          this.isChildQuestion = true;
          this.getParentQuestionOptions(data.branchingLogic[this.questionId].source[0]);
          this.setCondition(data);
        }
      }
      if (data?.children) {
        this.getBranchingLogic(data?.children);
      }
    });
  }

  onQualityFormSubmit(event) {
    switch (event.action) {
      case 'submit':
        this.saveQualityParameters(event.data, this.sendQuestionForPublish.bind(this, {}));
        break;
      case 'requestChange':
        this.requestChangesPopupAction = null;
        this.saveQualityParameters(event.data, this.openRequestChangesPopup.bind(this, {}));
        break;
      default:
        this.showQualityParameterPopup = false;
    }
  }

  saveQualityParameters(qualityParameters, callback) {
    const requestObj = {
      question: {
        reviewerQualityChecks: qualityParameters
      }
    };
    this.questionService.updateQuestion(this.questionId, requestObj).subscribe(res => {
        this.showQualityParameterPopup = false;
        if (callback) {
          callback();
        }
    });
  }

  openRequestChangesPopup() {
    this.requestChangesPopupAction = 'rejectQuestion';
  }

  getAllQuestionDetails(id?: any){
    const questionList = [];
    const activeNode = this.treeService.getActiveNode();
    const identifier = !activeNode.folder ? _.get(activeNode, 'parent.data.id') : _.get(activeNode, 'data.id');
    const parentData = this.treeService.getNodeById(identifier);
    const children = _.get(parentData, 'children');
    _.forEach(children, (child) => {
      if (_.get(child, 'data.metadata.interactionTypes[0]') === 'choice') {
        questionList.push(_.get(child, 'data.metadata.identifier'));
      }
    });
    const branchingLogic = _.get(parentData, 'data.metadata.branchingLogic');
    if (id) {questionList.push(id); }
    const target = {};

    if (!_.isEmpty(questionList)){
      this.questionService.getQuestionList('responseDeclaration', questionList)
      .subscribe((response: any) => {
        const result = _.get(response, 'result.questions').map((data) => data?.identifier);
      });
    }
  }

  optionCombination(numArray?: any) {
    if (numArray.length === 1) {
      return [numArray];
    } else {
      const tail = this.optionCombination(numArray.slice(1));
      return tail.reduce(
        (combos, combo) => { combos.push([numArray[0], ...combo]); return combos; },
        [[numArray[0]], ...tail]
      );
    }
}

  buildEcm(QuestionId) {
    if (_.get(this.editorService, 'editorConfig.config.renderTaxonomy')) {
      const activeNode = this.treeService.getActiveNode();
      const identifier = !activeNode.folder ? _.get(activeNode, 'parent.data.id') : _.get(activeNode, 'data.id');
      const sectionData = this.treeService.getNodeById(identifier);
      const section = _.get(sectionData, 'data.metadata');
      const ecmData = _.get(sectionData, 'data.metadata.groups') || {};
      const keys = _.keys(ecmData);
      const isKey = _.includes(keys, this.selectedEcm);
      if (isKey){
        if (!_.includes(ecmData[this.selectedEcm], QuestionId)) {
          ecmData[this.selectedEcm].push(QuestionId);
        }
      }else{
        ecmData[this.selectedEcm] = [];
        ecmData[this.selectedEcm].push(QuestionId);
      }
      const metadata = {
        name: section?.name,
        primaryCategory: section?.primaryCategory,
        groups: ecmData
      };
      this.treeService.updateNode(metadata, identifier, section?.primaryCategory);
      const finalResult = {
        nodesModified: {
          [identifier]: {
            ...this.treeService.treeCache.nodesModified[identifier]
          }
        },
        hierarchy: this.editorService.getHierarchyObj(this.treeNodeData, QuestionId, identifier)
      };
      this.selectedEcm = '';
      this.saveQuestions(finalResult);
    }
  }

  setQuestionEcm() {
    if (_.get(this.editorService, 'editorConfig.config.renderTaxonomy')) {
      const sectionData = this.treeService.getNodeById(this.selectedSectionId);
      const ecmData = _.get(sectionData, 'data.metadata.groups');
      const keys = _.keys(ecmData);
      _.forEach(keys, (key) => {
        _.forEach(ecmData[key], (arr) => {
          if (arr === this.questionId) {
            this.selectedEcm = key.toString();
          }
        });
      });
    }
  }


}
