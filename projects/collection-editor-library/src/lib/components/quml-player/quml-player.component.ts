import { Component, Input, OnInit , ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'lib-quml-player',
  templateUrl: './quml-player.component.html',
  styleUrls: ['./quml-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QumlPlayerComponent implements OnInit {
  qumlPlayerConfig: any;
  @Input() questionSetHierarchy: any;
  @Input() isSingleQuestionPreview = false;
  showPreview = false;
  constructor(private configService: ConfigService, private playerService: PlayerService ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.setQumlPlayerData();
    this.showPreview = true;
  }

  setQumlPlayerData() {
    const playerConfig = _.cloneDeep(this.playerService.getQumlPlayerConfig());
    this.qumlPlayerConfig = playerConfig;
    this.qumlPlayerConfig.context.threshold = _.get(this.configService, 'playerConfig.threshold');
    this.qumlPlayerConfig.metadata = _.cloneDeep(this.questionSetHierarchy);
    this.qumlPlayerConfig.metadata.totalQuestions = this.qumlPlayerConfig.metadata.childNodes.length;
    // tslint:disable-next-line:max-line-length
    this.qumlPlayerConfig.metadata.maxQuestions = this.qumlPlayerConfig.metadata.maxQuestions || this.qumlPlayerConfig.metadata.totalQuestions;
    this.qumlPlayerConfig.metadata.maxScore = this.qumlPlayerConfig.metadata.maxQuestions;
    if (this.isSingleQuestionPreview) {
      this.qumlPlayerConfig.context.threshold = 1;
      this.qumlPlayerConfig.metadata.showStartPage = 'No';
      this.qumlPlayerConfig.metadata.showTimer = 'No';
      this.qumlPlayerConfig.metadata.maxQuestions = 1;
      this.qumlPlayerConfig.metadata.requiresSubmit = 'No';
    }
    console.log('qumlPlayerConfig:: ', this.qumlPlayerConfig);
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

}
