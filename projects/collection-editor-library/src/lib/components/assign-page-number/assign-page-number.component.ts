import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';

@Component({
  selector: 'lib-assign-page-number',
  templateUrl: './assign-page-number.component.html',
  styleUrls: ['./assign-page-number.component.css']
})
export class AssignPageNumberComponent implements OnInit {

  toolbarConfig: any = {};
  pageId = 'pagination';

  @Output() assignPageEmitter = new EventEmitter<any>();

  constructor(private editorService: EditorService) { }

  ngOnInit(): void {
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.toolbarConfig.title = 'Observation Title';
  }

  toolbarEventListener(event) {
    switch (event.button) {
      case 'backContent':
        this.handleRedirectToQuestionSet();
        break;
    }
  }

  handleRedirectToQuestionSet() {
    this.redirectToQuestionSet();
  }

  redirectToQuestionSet() {
    setTimeout(() => {
      this.assignPageEmitter.emit({ status: false });
    }, 100);
  }

}
