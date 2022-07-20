import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
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
  questions: any;
  @Output() assignPageEmitter = new EventEmitter<any>();

  constructor(private editorService: EditorService, private treeService: TreeService,
              public configService: ConfigService) { }

  ngOnInit() {
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.toolbarConfig.title = 'Observation Form';
    this.treeData = this.editorService.treeData;
  }

  toolbarEventListener(event) {
    switch (event.button) {
      case 'backContent':
        this.redirectToQuestionSet();
        break;
    }
  }

  treeEventListener(event) {}

  redirectToQuestionSet() {
      this.assignPageEmitter.emit({ status: false });
  }

}
