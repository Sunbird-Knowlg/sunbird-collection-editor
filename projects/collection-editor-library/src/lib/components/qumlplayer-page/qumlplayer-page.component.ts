import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash-es';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
import { ConfigService } from '../../services/config/config.service';
import { TreeService } from '../../services/tree/tree.service';
@Component({
  selector: 'lib-qumlplayer-page',
  templateUrl: './qumlplayer-page.component.html',
  styleUrls: ['./qumlplayer-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QumlplayerPageComponent implements OnChanges {
  qumlPlayerConfig: any;
  @Input() questionMetaData: any;
  @Input() questionSetHierarchy: any;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  prevQuestionId: string;
  showPlayerPreview = false;
  showPotrait = false;
  hierarchy: any;

  constructor(public telemetryService: EditorTelemetryService, public configService: ConfigService, public editorService: EditorService,
              private treeService: TreeService) { }

  ngOnChanges() {
    this.initQumlPlayer();
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
        // tslint:disable-next-line:no-string-literal
        this.hierarchy['maxScore'] = 1;
      } else {
        if (this.questionMetaData.qType === 'SA') {
          this.hierarchy = _.omit(this.hierarchy, 'maxScore');
        } else if (this.questionMetaData.maxScore) {
          // tslint:disable-next-line:no-string-literal
          this.hierarchy['maxScore'] = this.questionMetaData.maxScore;
        }
      }
      const parent = this.treeService.getParent()?.data?.metadata;
      this.hierarchy.showSolutions = parent?.showSolutions || "No";
      this.hierarchy.showFeedback = parent?.showFeedback || "No";
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
