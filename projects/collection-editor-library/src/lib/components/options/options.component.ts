import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ConfigService } from '../../services/config/config.service';
import { SubMenu } from '../question-option-sub-menu/question-option-sub-menu.component';
import { TreeService } from '../../services/tree/tree.service';
import { EditorService } from '../../services/editor/editor.service';
@Component({
  selector: 'lib-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OptionsComponent implements OnInit {
  @Input() editorState: any;
  @Input() showFormError;
  @Input() sourcingSettings;
  @Input() questionPrimaryCategory;
  @Input() mapping = [];
  @Input() isReadOnlyMode;
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public templateType = 'mcq-vertical';
  subMenus: SubMenu[][];
  hints = [];
  showSubMenu:boolean=false;
  parentMeta: any;
  constructor(
    public telemetryService: EditorTelemetryService,
    public configService: ConfigService,
    public treeService: TreeService,
    private editorService: EditorService
  ) {}

  ngOnInit() {
    if (!_.isUndefined(this.editorState.templateId)) {
      this.templateType = this.editorState.templateId;
    }
    this.editorDataHandler();
    this.mapping = _.get(this.editorState, 'responseDeclaration.response1.mapping') || [];
    if(!_.isUndefined(this.editorService.editorConfig.config.renderTaxonomy)){
      this.parentMeta = this.treeService.getFirstChild().data.metadata;
      this.showSubMenu=true;
    }
  }

  editorDataHandler(event?) {
    const body = this.prepareMcqBody(this.editorState);
    this.editorDataOutput.emit({ body, mediaobj: event ? event.mediaobj : undefined });
  }

  prepareMcqBody(editorState) {
    let metadata: any;
    const correctAnswer = editorState.answer;
    let resindex;
    const options = _.map(editorState.options, (opt, key) => {
      resindex = Number(key);
      if (Number(correctAnswer) === key) {
        return { answer: true, value: { body: opt.body, value: resindex } };
      } else {
        return { answer: false, value: { body: opt.body, value: resindex } };
      }
    });
    metadata = {
      templateId: this.templateType,
      name: this.questionPrimaryCategory || 'Multiple Choice Question',
      responseDeclaration: this.getResponseDeclaration(editorState),
      interactionTypes: ['choice'],
      interactions: this.getInteractions(editorState.options),
      editorState: {
        options,
      },
      qType: 'MCQ',
      primaryCategory: this.questionPrimaryCategory || 'Multiple Choice Question',
    };
    return metadata;
  }

  getResponseDeclaration(editorState) {
    const responseDeclaration = {
      response1: {
        maxScore: 1,
        cardinality: 'single',
        type: 'integer',
        correctResponse: {
          value: editorState.answer,
          outcomes: { SCORE: 1 },
        },
        mapping: this.mapping,
      },
    };
    return responseDeclaration;
  }

  getInteractions(options) {
    let index;
    const interactOptions = _.map(options, (opt, key) => {
      index = Number(key);
      const hints  = _.get(this.editorState, `interactions.response1.options[${index}].hints`)
      return { label: opt.body, value: index, hints };
    });
    this.subMenuConfig(options);
    const interactions = {
      response1: {
        type: 'choice',
        options: interactOptions,
      },
    };
    return interactions;
  }

  setTemplete(template) {
    this.templateType = template;
    this.editorDataHandler();
  }

  subMenuChange({ index, value }, optionIndex) {
    _.set(this.editorState, `interactions.response1.options[${optionIndex}].hints.en`, value)
  }

  subMenuConfig(options) {
    this.subMenus = []
    options.map((opt, index) => {
      const value  = _.get(this.editorState, `interactions.response1.options[${index}].hints.en`)
      this.subMenus[index] = [
        {
          id: 'addHint',
          name: 'Add Hint',
          value,
          label: 'Hint',
          enabled: value ? true : false,
          type: 'input',
          show: _.get(this.sourcingSettings, 'showAddHints'),
        },
      ];
    });
  }

  setScore(value, scoreIndex) {
    const obj = {
      response: scoreIndex,
      outcomes: {
        score: value,
      },
    };
    this.mapping[scoreIndex] = obj;
    this.editorDataHandler();
  }
}
