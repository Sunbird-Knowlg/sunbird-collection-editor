import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash-es';
import { ServerResponse } from '../../interfaces/serverResponse';
import { EditorService } from '../../services/editor/editor.service';
import { FormService } from '../../services/form/form.service';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'lib-quml-player',
  templateUrl: './quml-player.component.html',
  styleUrls: ['./quml-player.component.css']
})
export class QumlPlayerComponent implements OnInit {
  qumlPlayerConfig: any;
  @Input() questionSetHierarchy: any;
  @Input() questionIds: any;
  showPreview = false;
  constructor(private editorService: EditorService, private formService: FormService,
              private playerService: PlayerService ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    const formReadInputParams = {
      formType: 'content',
      formAction: 'play',
      contentType: 'player',
      rootOrgId: _.get(this.editorService, 'editorConfig.context.channel')
    };
    this.formService.getFormConfig(formReadInputParams).subscribe(
      (data: any) => {
       this.setQumlPlayerData(data);
       this.showPreview = true;
      }, (err: ServerResponse) => {
        const errInfo = {
          errorMsg: 'Fetching player detailes failed. Try again later',
        };
        this.editorService.apiErrorHandling(err, errInfo);
    });
  }

  setQumlPlayerData(formConfigData) {
    const playerConfig = _.cloneDeep(this.playerService.getQumlPlayerConfig());
    this.qumlPlayerConfig = playerConfig;
    this.qumlPlayerConfig.metadata = _.cloneDeep(this.questionSetHierarchy);
    _.forEach(formConfigData, (value) => {
      if (_.includes(_.get(value, 'mimeType'), this.qumlPlayerConfig.metadata.mimeType) && _.get(value, 'version') === 2) {
        this.qumlPlayerConfig.metadata.threshold = _.get(value, 'threshold');
      }
    });
    this.qumlPlayerConfig.metadata.totalQuestions = 1;
    // tslint:disable-next-line:max-line-length
    this.qumlPlayerConfig.metadata.maxQuestions = this.qumlPlayerConfig.metadata.maxQuestions || this.qumlPlayerConfig.metadata.totalQuestions;
    this.qumlPlayerConfig.metadata.maxScore = this.qumlPlayerConfig.metadata.maxQuestions;
    delete this.qumlPlayerConfig.metadata.children;
    console.log('qumlPlayerConfig:: ', this.qumlPlayerConfig);
  }

  getPlayerEvents(event) {
    console.log('get player events', JSON.stringify(event));
  }

  getTelemetryEvents(event) {
    console.log('event is for telemetry', JSON.stringify(event));
  }

}
