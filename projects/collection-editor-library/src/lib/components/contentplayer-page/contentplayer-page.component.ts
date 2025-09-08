import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { EditorService } from '../../services/editor/editor.service';
import { PlayerService } from '../../services/player/player.service';
import { ConfigService } from '../../services/config/config.service';
import { FrameworkService } from '../../services/framework/framework.service';
declare var $: any;

@Component({
  selector: 'lib-contentplayer-page',
  templateUrl: './contentplayer-page.component.html',
  styleUrls: ['./contentplayer-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentplayerPageComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('contentIframe') contentIframe: ElementRef;
  @ViewChild("pdfPlayer") pdfPlayer: ElementRef;
  @ViewChild("epubPlayer") epubPlayer: ElementRef;
  @ViewChild("videoPlayer") videoPlayer: ElementRef;
  @Input() contentMetadata: any;
  public contentDetails: any;
  public playerConfig: any;
  public content: any;
  public contentInfo: any;
  public contentInfoArray: any[] = [];
  public playerType: string;
  public contentId: string;
  private destroy$ = new Subject<void>();
  constructor(private editorService: EditorService, private playerService: PlayerService,
    public configService: ConfigService, private frameworkService: FrameworkService) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        contentId: this.contentId,
        contentData: _.get(res, 'result.content')
      };

      const baseContentInfo = {
        name: _.get(this.contentDetails, 'contentData.name'),
        author: _.get(this.contentDetails, 'contentData.author'),
        license: _.get(this.contentDetails, 'contentData.license'),
        copyright: _.get(this.contentDetails, 'contentData.copyright')
      };

      const frameworkId = this.frameworkService.organisationFramework;
      this.frameworkService.getTargetFrameworkCategories([frameworkId]);
      this.frameworkService.frameworkData$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(frameworkData => {
        if (frameworkData?.frameworkdata[frameworkId]) {
          const categories = frameworkData.frameworkdata[frameworkId].categories || [];
          const frameworkCodes = categories?.map(category => category.code);
          
          const matchedFields = frameworkCodes.reduce((acc, code) => {
            if (_.has(this.contentDetails.contentData, code)) {
              acc[code] = _.get(this.contentDetails.contentData, code);
            }
            return acc;
          }, {});

          this.contentInfo = { ...baseContentInfo, ...matchedFields };
        } else {
          // Fallback to base content info if framework data is not available
          console.warn('Framework data not available for:', frameworkId);
          this.contentInfo = baseContentInfo;
        }
        this.prepareContentInfoArray();
        this.initializeAndLoadPlayer();
      }, err => {
        console.error('Failed to get framework data:', err);
        this.contentInfo = baseContentInfo;
        this.prepareContentInfoArray();
        this.initializeAndLoadPlayer();
      });

    }, err => {
      console.error('Failed to fetch content details:', err);
    });
  }

  initializeAndLoadPlayer() {
    this.playerConfig = this.playerService.getPlayerConfig(this.contentDetails);
    this.setPlayerType();
    if (this.playerType === 'default-player') {
      this.loadDefaultPlayer();
    } else {
      this.playerConfig.config = {
        'traceId': 'afhjgh',
        'sideMenu': {
          'showDownload': true,
          'showExit': true,
          'showPrint': true,
          'showReplay': true,
          'showShare': true
        }
      };
      this.loadPlayer();
    }
  }

  prepareContentInfoArray() {
    this.contentInfoArray = [];
    let validIndex = 0;

    Object.keys(this.contentInfo).forEach((key) => {
      if (this.contentInfo[key] !== undefined && this.contentInfo[key] !== null && this.contentInfo[key] !== '') {
        let displayValue = this.contentInfo[key];
        if (Array.isArray(displayValue)) {
          displayValue = displayValue.join(', ');
        }

        this.contentInfoArray.push({
          key,
          label: this.capitalizeFirstLetter(key),
          value: displayValue,
          columnClass: this.getColumnClass(validIndex)
        });
        validIndex++;
      }
    });
  }

  capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getColumnClass(index: number): string {
    const columnClasses = ['six wide column', 'four wide column', 'two wide column'];
    return columnClasses[index % columnClasses.length];
  }

  setPlayerType() {
    const playerType = _.get(this.configService.playerConfig, 'playerType');
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

  eventHandler(e) { }

  generateContentReadEvent(e, state?) { }

  setPlayerProperties(playerElement: any) {
    playerElement.setAttribute('player-config', JSON.stringify(this.playerConfig));
    playerElement.addEventListener('playerEvent', this.eventHandler);
    playerElement.addEventListener('telemetryEvent', this.generateContentReadEvent);
  }

  loadPlayer() {
    setTimeout(() => {
      if (this.playerType === "pdf-player") {
        const pdfElement = document.createElement('sunbird-pdf-player');
        this.setPlayerProperties(pdfElement)
        this.pdfPlayer.nativeElement.append(pdfElement);
      } else if (this.playerType === "epub-player") {
        const epubElement = document.createElement('sunbird-epub-player');
        this.setPlayerProperties(epubElement)
        this.epubPlayer.nativeElement.append(epubElement);
      } else if (this.playerType === "video-player") {
        const videoElement = document.createElement('sunbird-video-player');
        this.setPlayerProperties(videoElement)
        this.videoPlayer.nativeElement.append(videoElement);
      }
    }, 500)
  }
}
