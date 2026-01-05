import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash-es';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { ConfigService } from '../../services/config/config.service';
import { TreeService } from '../../services/tree/tree.service';
import { FrameworkService } from '../../services/framework/framework.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'lib-qumlplayer-page',
  templateUrl: './qumlplayer-page.component.html',
  styleUrls: ['./qumlplayer-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QumlplayerPageComponent implements OnChanges {
  qumlPlayerConfig: any;
  @Input() questionMetaData: any;
  @Input() leafFormConfig: any
  @Input() questionSetHierarchy: any;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  prevQuestionId: string;
  showPlayerPreview = false;
  showPotrait = false;
  hierarchy: any;
  showForm = false;
  questionFormConfig: any;
  frameworkDetails: any = {};

  constructor(public telemetryService: EditorTelemetryService, public configService: ConfigService, public editorService: EditorService,
              private treeService: TreeService, private frameworkService: FrameworkService) { }

  ngOnChanges() {
    if (_.has(this.questionMetaData, 'data.metadata')) {
      this.initQumlPlayer();
      this.questionFormConfig = _.cloneDeep(this.leafFormConfig);
      const framework = _.get(this.questionSetHierarchy, 'framework') ||  _.get(this.editorService.editorConfig, 'context.framework')
      if (framework) {
        this.fetchFrameWorkDetails(framework);
      } else {
        this.setFormDefaultValues();
      }
    }
  }

  fetchFrameWorkDetails(framework) {
    this.frameworkService.frameworkData$.pipe(
      filter(data => _.get(data, `frameworkdata.${framework}`))).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        const frameworkData = frameworkDetails.frameworkdata[framework].categories;
        this.frameworkDetails.frameworkData = frameworkData;
        this.setFieldsTerms();
      }
    });
  }

  setFieldsTerms() {
    const categoryMasterList = this.frameworkDetails.frameworkData;
    _.forEach(categoryMasterList, (category) => {
      _.forEach(this.questionFormConfig, (formFieldCategory) => {
        if (category.code === formFieldCategory.code) {
          formFieldCategory.terms = category.terms;
        }
      });
    });
    this.setFormDefaultValues();
  }

  setFormDefaultValues() {
    _.forEach(this.questionFormConfig, (formField) => {
      const fieldcode = formField.code;
      formField.default = this.questionMetaData[fieldcode];
      formField.editable = false;
    });
  this.showForm = true;
  }

  initQumlPlayer() {
    this.showPlayerPreview = false;
    this.questionMetaData = _.get(this.questionMetaData, 'data.metadata');
    const newQuestionId = _.get(this.questionMetaData, 'identifier');
    if (newQuestionId && this.prevQuestionId !== newQuestionId) {
      this.hierarchy = _.cloneDeep(this.questionSetHierarchy);
      const selectedNode = this.treeService.getNodeById(newQuestionId);
      this.hierarchy.children = _.castArray(_.get(selectedNode, 'data.metadata'));
      this.hierarchy.childNodes = [newQuestionId];
      this.hierarchy.shuffle = selectedNode.parent.data.metadata.shuffle;
      if (selectedNode.parent.data.metadata.shuffle === true) {
        this.hierarchy['outcomeDeclaration'] = {maxScore: {defaultValue: 1}};
      } else {
        if (this.questionMetaData.qType === 'SA') {
          this.hierarchy['outcomeDeclaration'] = {maxScore: {defaultValue: 0}};
        } else {
          this.hierarchy['outcomeDeclaration'] = {maxScore: {defaultValue: this.questionMetaData?.maxScore}};
        }
      }
      const parent = this.treeService.getParent()?.data?.metadata;
      this.hierarchy.showSolutions = parent?.showSolutions || false;
      this.hierarchy.showFeedback = parent?.showFeedback || false;
      this.prevQuestionId = newQuestionId;
      setTimeout(() => {
        this.showPlayerPreview = true;
      }, 0);
    }
  }

  switchToPotraitMode() {
    this.showPotrait = true;
  }
  switchToLandscapeMode() {
    this.showPotrait = false;
  }

  removeQuestion() {
    this.toolbarEmitter.emit({button: 'removeContent'});
  }

  editQuestion() {
    this.toolbarEmitter.emit({button : 'editContent'});
  }

  reviewQuestion(){
    this.toolbarEmitter.emit({button : 'reviewContent'});
  }

}
