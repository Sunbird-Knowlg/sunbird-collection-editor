import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { QuestionService } from '../../services/question/question.service';
import { TreeService } from '../../services/tree/tree.service';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';

@Component({
  selector: 'lib-assign-page-number',
  templateUrl: './assign-page-number.component.html',
  styleUrls: ['./assign-page-number.component.scss']
})
export class AssignPageNumberComponent implements OnInit {

  toolbarConfig: any = {};
  pageId = 'pagination';
  treeData: any;
  questions = [];
  // tslint:disable-next-line:variable-name
  rendering_sequence: any;
  @Output() assignPageEmitter = new EventEmitter<any>();
  recordedBy: any;
  criteriaId: any;
  constructor(private editorService: EditorService, private treeService: TreeService,
              private questionService: QuestionService) { }

  ngOnInit() {
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.toolbarConfig.title = 'Observation Form';
    this.treeData = this.editorService.treeData;
    this.createSequence(this.treeData);
    this.treeEventListener({
      identifier: _.get(this.treeData[0], 'children[0].id'),
      criteriaName: _.get(this.treeData[0], 'children[0].title')
    });
  }

  toolbarEventListener(event) {
    switch (event.button) {
      case 'backContent':
        this.redirectToQuestionSet();
        break;
    }
  }

  redirectToQuestionSet() {
      this.assignPageEmitter.emit({ status: false });
  }

  treeEventListener(event) {
    this.criteriaId = event?.identifier;
    const data = this.treeService.getFirstChild();
    const hierarchy = this.editorService.getHierarchyObj(data, '', event?.identifier);
    this.questionService.getQuestionList('editorState', _.get(hierarchy[event?.identifier], 'children'))
    .subscribe((response: any) => {
      this.questions = [];
      const questionsArray = _.get(response, 'result.questions');
      questionsArray.forEach(element => {
        this.questions.push({
          question: element?.editorState?.question,
          identifier: element?.identifier,
          page_no: null,
        });
      });
    }, (error: any) => {
      console.log(error);
    });
  }

  onValueChange(event, question) {
    question.page_no = +event;
    console.log(this.questions);
    const numArray = [];
    // tslint:disable-next-line:no-shadowed-variable
    _.forEach(this.questions, (question) => {
      numArray.push(question.page_no);
    });
    const createArray = new Array(Math.max(...numArray));
    console.log(createArray);
    for (let i = 0; i < createArray.length; i++) {
      createArray[i] = new Array(1);
    }
    for (const [index, data] of this.questions.entries()){
      console.log(index);
    }
    _.forEach(this.rendering_sequence?.sequence, (data) => {
      if (data.value === this.criteriaId) {
        data.pages = createArray;
      }
    });
    console.log(this.rendering_sequence);
  }

  createSequence(data) {
    this.recordedBy = _.get(this.treeService.getFirstChild(), 'data.metadata.recordedBy');
    // tslint:disable-next-line:variable-name
    const dataArray = [];
    // tslint:disable-next-line:variable-name
    this.rendering_sequence = {
      name: this.recordedBy === 'Self' ? 'Criteria' : 'Ecm',
      sequence: []
    };
    _.forEach(data, (child: any) => {
      if (child.children) {
        _.forEach(child.children, (seq) => {
          dataArray.push(seq);
        });
      }
    });
    _.forEach(dataArray, (seq, i) => {
      this.rendering_sequence.sequence.push({
        value: seq?.id,
        name: seq?.title,
        pages: [],
        index: i
      });
    });
    console.log(this.rendering_sequence);
  }

  renderingSequence() {
  }

}
