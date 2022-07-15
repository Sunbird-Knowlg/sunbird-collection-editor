import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { QuestionService } from '../../services/question/question.service';
import { TreeService } from '../../services/tree/tree.service';
import * as _ from 'lodash-es';

@Component({
  selector: 'lib-assign-page-number',
  templateUrl: './assign-page-number.component.html',
  styleUrls: ['./assign-page-number.component.scss']
})
export class AssignPageNumberComponent implements OnInit {

  toolbarConfig: any = {};
  pageId = 'pagination';
  treeData: any;
  questions=[]

  @Output() assignPageEmitter = new EventEmitter<any>();

  constructor(private editorService: EditorService, private treeService: TreeService,
              private questionService: QuestionService) { }

  ngOnInit() {
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.toolbarConfig.title = 'Observation Form';
    this.treeData = this.editorService.treeData;
    this.treeEventListener({identifier: this.treeData[0].children[0].id})    
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
    const data = this.treeService.getFirstChild();
    const hierarchy = this.editorService.getHierarchyObj(data, '', event?.identifier);
    this.questionService.getQuestionList(_.get(hierarchy[event?.identifier], 'children'))
    .subscribe((response: any) => {
      this.questions=[];
      let questionsArray = _.get(response, 'result.questions')
      questionsArray.forEach(element => {
        this.questions.push(element.editorState.question);
      });
    }, (error: any) => {
      console.log(error);
    });
  }

}
