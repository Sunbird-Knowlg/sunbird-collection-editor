import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, ViewEncapsulation} from '@angular/core';
import * as _ from 'lodash-es';
import { EditorService} from '../../services/editor/editor.service';
import { HelperService } from '../../services/helper/helper.service';
import { TreeService } from '../../services/tree/tree.service';
import { PLAYER_CONFIG } from '../../editor.config';
declare var $: any;

@Component({
  selector: 'lib-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentplayerPageComponent implements OnInit, OnChanges {
  @ViewChild('contentIframe', {static: false}) contentIframe: ElementRef;
  @Input() contentMetadata: any;
  public contentDetails: any;
  public playerConfig: any;
  public content: any;
  public playerType: string;
  public contentId: string;
  public editorConfig;
  constructor(private editorService: EditorService, private helperService: HelperService, private treeService: TreeService) { }

  ngOnInit() {
    this.editorConfig = _.cloneDeep(this.editorService.editorConfig);
  }

  ngOnChanges() {
    this.contentMetadata = _.get(this.contentMetadata, 'data.metadata') || this.contentMetadata;
    if (this.contentId !== this.contentMetadata.identifier) {
      this.contentId = this.contentMetadata.identifier;
      this.getContentDetails();
    }
  }
  getContentDetails() {
    this.playerType = 'default-player';
    this.editorService.fetchContentDetails(this.contentId).subscribe(res => {
      this.contentDetails = {
        contentId : this.contentId,
        contentData: _.get(res, 'result.content')
      };
      this.playerConfig = this.helperService.getPlayerConfig(this.contentDetails);
      this.setPlayerType();
      this.playerType === 'default-player' ? this.loadDefaultPlayer() : this.playerConfig.config = {};
    });
  }

  setPlayerType() {
    const playerType = _.get(PLAYER_CONFIG, 'playerType');
    _.forIn(playerType, (value, key) => {
      if (value.length) {
        if (_.includes(value, _.get(this.contentDetails, 'contentData.mimeType'))) {
          this.playerType = key;
        }
      }
    });
  }

  loadDefaultPlayer() {
    // const iFrameSrc = this.configService.appConfig.PLAYER_CONFIG.baseURL + '&build_number=' + this.buildNumber;
    const iFrameSrc = `/content/preview/preview.html?webview=true&build_number=2.8.0.e552fcd`;
    setTimeout(() => {
      const playerElement = this.contentIframe.nativeElement;
      playerElement.src = iFrameSrc;
      playerElement.onload = (event) => {
        try {
          this.adjustPlayerHeight();
          // this.playerLoaded = true;
          playerElement.contentWindow.initializePreview(this.playerConfig);
          // playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
          // window.frames['contentPlayer'].addEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
        } catch (err) {
          console.log('loading default player failed', err);
          // const prevUrls = this.navigationHelperService.history;
          // if (this.isCdnWorking.toLowerCase() === 'yes' && prevUrls[prevUrls.length - 2]) {
          //   history.back();
          // }
        }
      };
    }, 0);
  }

  /**
   * Adjust player height after load
   */
  adjustPlayerHeight() {
    const playerWidth = $('#contentPlayer').width();
    if (playerWidth) {
      const height = playerWidth * (9 / 16);
      $('#contentPlayer').css('height', height + 'px');
    }
  }

  eventHandler(e) {}

  generateContentReadEvent(e, boo) {}
}
