import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';

@Component({
    selector: 'lib-progress-status',
    templateUrl: './progress-status.component.html',
    styleUrls: ['./progress-status.component.scss'],
    standalone: false
})
export class ProgressStatusComponent implements OnInit {
  toolbarConfig: any = {};
  pageId = 'progressStatus';
  data=[{criteria:"Classrooms",maxScore:10,minScore:10,questionsCreated:10,isExpanded:false},
        {criteria:"Toilets",maxScore:10,minScore:10,questionsCreated:10,isExpanded:false},
        {criteria:"Assembly",maxScore:10,minScore:10,questionsCreated:10,isExpanded:false},
        {criteria:"Teaching and Learning",maxScore:10,minScore:10,questionsCreated:10,isExpanded:false}]
  expandedElement="";
  @Output() assignPageEmitter = new EventEmitter<any>();
  
  constructor(private editorService: EditorService) { }

  ngOnInit(): void {
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.toolbarConfig.title = 'Observation Form';
  }

  toolbarEventListener(event) {
    switch (event.button) {
      case 'backContent':
        this.redirectToQuestionSet();
        break;
      default :
        break;
    }
  }

  redirectToQuestionSet() {
      this.assignPageEmitter.emit({ status: false });
  }

  expand(event){
    this.expandedElement = (this.expandedElement==event.criteria)?"":event.criteria;
  }

}
