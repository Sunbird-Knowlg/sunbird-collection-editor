import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash-es';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { ConfigService } from '../../services/config/config.service';
import { SubMenu } from '../question-option-sub-menu/question-option-sub-menu.component';
import { TreeService } from '../../services/tree/tree.service';
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
  @Output() editorDataOutput: EventEmitter<any> = new EventEmitter<any>();
  public setCharacterLimit = 160;
  public setImageLimit = 1;
  public templateType = 'mcq-vertical';
  subMenus: SubMenu[];
  parentMeta: any;

  constructor(public telemetryService: EditorTelemetryService, public configService: ConfigService,public treeService:TreeService) { }

  ngOnInit() {
    this.parentMeta = this.treeService.getParent().data.metadata;
    if (!_.isUndefined(this.editorState.templateId)) {
      this.templateType = this.editorState.templateId;
    }
    this.editorDataHandler();
    this.subMenuConfig();
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
        options
      },
      qType: 'MCQ',
      primaryCategory: this.questionPrimaryCategory || 'Multiple Choice Question'
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
          outcomes: { SCORE: 1 }
        }
      }
    };
    return responseDeclaration;
  }

  getInteractions(options) {
    let index;
    const interactOptions = _.map(options, (opt, key) => {
      index = Number(key);
      return { label: opt.body, value: index };
    });
    const interactions = {
      response1: {
        type: 'choice',
        options: interactOptions
      }
    };
    return interactions;
  }

  setTemplete(template) {
    this.templateType = template;
    this.editorDataHandler();
  }

   subMenuChange({ index, value }) {
    this.subMenus[index].value = value;
   }

  subMenuConfig() {
    this.subMenus = [
    {
      id: 'addHint',
      name: 'Add Hint',
      value: '',
      label:'Hint',
      enabled: false,
      type: 'input',
      show: this.sourcingSettings.showAddHints
    },
   ];
  }
}

