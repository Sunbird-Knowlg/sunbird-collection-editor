import { Component, EventEmitter, Input, OnInit , Output, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash-es';
import { ConfigService } from '../../services/config/config.service';
import { PlayerService } from '../../services/player/player.service';
import { EditorService } from '../../services/editor/editor.service';
@Component({
    selector: 'lib-quml-player',
    templateUrl: './quml-player.component.html',
    styleUrls: ['./quml-player.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class QumlPlayerComponent implements OnInit {
  qumlPlayerConfig: any;
  @Input() questionSetHierarchy: any;
  @Input() isSingleQuestionPreview = false;
  showPreview = false;
  showViewButton = false;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  constructor(private configService: ConfigService, private playerService: PlayerService,
    public editorService: EditorService ) { }

  ngOnInit() {
    this.initialize();
    if(!_.isUndefined(this.editorService?.editorConfig?.config?.renderTaxonomy)){
      this.showViewButton = true
    }
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
    if (this.qumlPlayerConfig.metadata) {
      let childNodes = this.qumlPlayerConfig.metadata.childNodes;
      childNodes = _.filter(childNodes, (identifier) => !_.endsWith(identifier, '.img'));
      this.qumlPlayerConfig.metadata.childNodes = childNodes;
      const allQuestions = _.get(this.qumlPlayerConfig, 'config.objectType') === 'Question' ? [] : this.editorService.getContentChildrens();
      this.qumlPlayerConfig.metadata.maxQuestions = this.qumlPlayerConfig.metadata.maxQuestions || allQuestions.length;
      if (this.isSingleQuestionPreview) {
        this.qumlPlayerConfig.context.threshold = 1;
        this.qumlPlayerConfig.metadata.maxQuestions = 1;
        this.qumlPlayerConfig.metadata.showStartPage = 'No';
        this.qumlPlayerConfig.metadata.showTimer = 'No';
        this.qumlPlayerConfig.metadata.requiresSubmit = 'No';
        this.qumlPlayerConfig.config.showLegend = false;
      }
    }
    console.log('qumlPlayerConfig:: ', this.qumlPlayerConfig);
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

  reviewQuestion(){
    this.toolbarEmitter.emit({});
  }

}
