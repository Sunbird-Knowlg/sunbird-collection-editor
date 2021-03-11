import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash-es';
import { ServerResponse } from '../../interfaces/serverResponse';
import { QuestionService } from '../../services/question/question.service';
import { PlayerService } from '../../services/player/player.service';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import { EditorService } from '../../services/editor/editor.service';
@Component({
  selector: 'lib-qumlplayer-page',
  templateUrl: './qumlplayer-page.component.html',
  styleUrls: ['./qumlplayer-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QumlplayerPageComponent implements OnInit, OnChanges {
  QumlPlayerConfig: any;
  @Input() questionMetaData: any;
  @Input() questionSetHierarchy: any;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  questionId: string;
  showPlayerPreview = false;
  showPotrait = false;

  constructor(private questionService: QuestionService, public telemetryService: EditorTelemetryService,
              public editorService: EditorService, private playerService: PlayerService) { }

  ngOnInit() {}

  ngOnChanges() {
    this.questionMetaData = _.get(this.questionMetaData, 'data.metadata');
    if (this.questionId !== _.get(this.questionMetaData, 'identifier')) {
      this.showPlayerPreview = false;
      this.initialize();
    }
  }
  switchToPotraitMode() {
    this.showPotrait = true;
  }
  switchToLandscapeMode() {
    this.showPotrait = false;
  }
  initialize() {
    this.questionId = _.get(this.questionMetaData, 'identifier');
    this.questionService.readQuestion(this.questionId).subscribe((res) => {
       const questionData = res.result.question;
       this.setQumlPlayerData(questionData);
       this.showPlayerPreview = true;
    }, (err: ServerResponse) => {
      const errInfo = {
        errorMsg: 'Fetching question detailes failed. Try again later',
      };
      this.editorService.apiErrorHandling(err, errInfo);
    });
  }

  setQumlPlayerData(questionData) {
    const playerConfig = _.cloneDeep(this.playerService.getQumlPlayerConfig());
    this.QumlPlayerConfig = playerConfig;
    this.QumlPlayerConfig.data = _.cloneDeep(this.questionSetHierarchy);
    this.QumlPlayerConfig.data.totalQuestions = 1;
    this.QumlPlayerConfig.data.maxQuestions = this.QumlPlayerConfig.data.maxQuestions || this.QumlPlayerConfig.data.totalQuestions;
    this.QumlPlayerConfig.data.maxScore = this.QumlPlayerConfig.data.maxQuestions;
    this.QumlPlayerConfig.data.children = [];
    this.QumlPlayerConfig.data.children.push(questionData);
  }

  removeQuestion() {
    this.toolbarEmitter.emit({button: 'removeContent'});
  }

  editQuestion() {
    this.toolbarEmitter.emit({button : 'editContent'});
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

}
