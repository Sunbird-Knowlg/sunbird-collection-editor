import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IeventData } from '../../interfaces';
import { EditorService, HelperService, TreeService } from '../../services';
import { PLAYER_CONFIG } from '../../editor.config';
declare var $: any;

@Component({
  selector: 'lib-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss']
})
export class ContentplayerPageComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('contentIframe', {static: false}) contentIframe: ElementRef;
  @Input() contentListDetails: any;
  public contentDetails: any;
  public playerConfig: any;
  private onComponentDestroy$ = new Subject<any>();
  public content: any;
  public playerType: string;
  constructor(private editorService: EditorService, private helperService: HelperService, private treeService: TreeService) { }

  ngOnInit() {
    // this.getContentDetails();
    this.editorService.nodeData$.pipe(takeUntil(this.onComponentDestroy$)).subscribe((data: IeventData) => {
      if (data.type === 'nodeSelect' && (!this.playerConfig || this.playerConfig.metadata.identifier !== data.metadata.identifier)) {
        this.content = data.metadata;
        this.getContentDetails();
      }
    });
  }
  ngAfterViewInit() {
    // this.loadDefaultPlayer();
  }
  ngOnChanges() {
    if (this.contentListDetails.identifier && this.contentListDetails) {
      this.content = this.contentListDetails;
      this.getContentDetails();
    }
  }
  getContentDetails() {
    this.playerType = 'default-player';
    this.editorService.fetchContentDetails(this.content.identifier).subscribe(res => {
      this.contentDetails = {
        contentId: this.content.identifier,
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

  eventHandler(e) {

  }

  generateContentReadEvent(e, boo) {

  }

  ngOnDestroy() {
    this.onComponentDestroy$.next();
    this.onComponentDestroy$.complete();
  }
}
