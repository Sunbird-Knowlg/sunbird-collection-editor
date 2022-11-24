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
  createArray = [];
  pageNumArray = [];
  numArray = []

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
    this.createArray = []
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
        this.setPageNumber(event)
      }, (error: any) => {
        console.log(error);
      });
  }

  setPageNumber(event) {
    const pageNumber = this.rendering_sequence.sequence.find(el => el.value === event.identifier)
    this.pageNumArray = pageNumber.pages;
    this.pageNumArray.forEach((entry, index) => {
      if (!_.isEmpty(entry)) {
        entry.forEach((identifier) => {
          const getQuestion = this.questions.find((el) => el.identifier === identifier)
          getQuestion.page_no = index + 1
          console.log(getQuestion)
        })
      }
    })
  }

  onValueChange(event, question, index) {
    if (+event === 0) {
      let subjecObject = _.find(this.rendering_sequence?.sequence, (data) => {
        return data.value === this.criteriaId;
      })

      if (subjecObject) {
        let questionsIdArray = subjecObject.pages[question.page_no - 1];
        let index = questionsIdArray.indexOf(question.identifier);
        questionsIdArray.splice(index, 1);
      }
      this.questions[index].page_no = null;
      this.numArray = [];
      _.forEach(this.questions, (question) => {
        this.numArray.push(question.page_no);
      });

      this.createArray = [];
      for (let i = 0; i < Math.max(...this.numArray); i++) {
        this.createArray[i] = new Array();
      }

      const pageNumber = this.rendering_sequence.sequence.find(el => el.value === this.criteriaId)
      this.pageNumArray = pageNumber.pages;
      if (this.createArray.length === this.pageNumArray.length) {
        this.createArray = this.pageNumArray;
      } else if (this.pageNumArray.length > this.createArray.length) {
        const result = this.pageNumArray.slice(0);
        const newArray = result.splice.apply(result, [0, this.createArray.length].concat(this.createArray));
        this.createArray = newArray;
      } else {
        const newArray = [...this.pageNumArray, ...this.createArray.slice(this.pageNumArray.length)]
        this.createArray = newArray;
      }
      return true;
    }

    question.page_no = +event;
    this.numArray = [];
    // tslint:disable-nevxt-line:no-shadowed-variable
    _.forEach(this.questions, (question) => {
      this.numArray.push(question.page_no);
    });

    this.createArray = [];
    const pageNumber = this.rendering_sequence.sequence.find(el => el.value === this.criteriaId)
    this.pageNumArray = pageNumber.pages;

    if (this.pageNumArray.length != 0) {
      for (let i = 0; i < Math.max(...this.numArray); i++) {
        this.createArray[i] = new Array();
      }
      if (this.createArray.length === this.pageNumArray.length) {
        this.createArray = this.pageNumArray;
      } else if (this.pageNumArray.length > this.createArray.length) {
        const result = this.pageNumArray.slice(0);
        const newArray = result.splice.apply(result, [0, this.createArray.length].concat(this.createArray));
        this.createArray = newArray;
      } else {
        const newArray = [...this.pageNumArray, ...this.createArray.slice(this.pageNumArray.length)]
        this.createArray = newArray;
      }
      this.pageNumArray = [];
    } else {
      for (let i = 0; i < Math.max(...this.numArray); i++) {
        if (!this.createArray[i]) {
          this.createArray[i] = new Array();
        }
      }
    }

    _.forEach(this.rendering_sequence?.sequence, (data) => {
      if (data.value === this.criteriaId) {
        const getIdentifier = this.createArray.filter((arr, index1) => arr.some((e, index2) => {
          if (e === question.identifier) {
            this.createArray[index1].splice(index2, 1)
          }
        }))
        this.createArray[Number(event) - 1].push(question.identifier)
        data.pages = this.createArray;
      }
    });
    console.log(this.rendering_sequence)
  }


  clearInput(event, question, index) {
    let subjecObject = _.find(this.rendering_sequence?.sequence, (data) => {
      return data.value === this.criteriaId;
    })

    if (subjecObject) {
      let questionsIdArray = subjecObject.pages[question.page_no - 1];
      let index = questionsIdArray.indexOf(question.identifier);
      questionsIdArray.splice(index, 1);
    }
    this.questions[index].page_no = null;

    this.numArray = [];
    _.forEach(this.questions, (question) => {
      this.numArray.push(question.page_no);
    });

    this.createArray = [];
    for (let i = 0; i < Math.max(...this.numArray); i++) {
      this.createArray[i] = new Array();
    }

    const pageNumber = this.rendering_sequence.sequence.find(el => el.value === this.criteriaId)
    this.pageNumArray = pageNumber.pages;
    if (this.createArray.length === this.pageNumArray.length) {
      this.createArray = this.pageNumArray;
    } else if (this.pageNumArray.length > this.createArray.length) {
      const result = this.pageNumArray.slice(0);
      const newArray = result.splice.apply(result, [0, this.createArray.length].concat(this.createArray));
      this.createArray = newArray;
    } else {
      const newArray = [...this.pageNumArray, ...this.createArray.slice(this.pageNumArray.length)]
      this.createArray = newArray;
    }
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