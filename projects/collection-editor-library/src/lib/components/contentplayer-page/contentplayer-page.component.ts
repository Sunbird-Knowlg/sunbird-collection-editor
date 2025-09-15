import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, ViewEncapsulation, AfterViewInit, AfterViewChecked } from '@angular/core';
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
export class ContentplayerPageComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  private static readonly PLAYER_INITIALIZATION_TIMEOUT = 200;
  private static readonly CUSTOM_ELEMENT_CHECK_INTERVAL = 100;
  private static readonly CUSTOM_ELEMENT_MAX_ATTEMPTS = 100;
  @ViewChild('contentIframe') contentIframe: ElementRef;
  @ViewChild("pdfPlayer", { static: false }) pdfPlayer: ElementRef;
  @ViewChild("epubPlayer", { static: false }) epubPlayer: ElementRef;
  @ViewChild("videoPlayer", { static: false }) videoPlayer: ElementRef;
  @Input() contentMetadata: any;
  public contentDetails: any;
  public playerConfig: any;
  public content: any;
  public contentInfo: any;
  public contentInfoArray: any[] = [];
  public playerType: string;
  public contentId: string;
  private playerNeedsInitialization = false;
  private viewInitialized = false;
  constructor(private editorService: EditorService, private playerService: PlayerService,
    public configService: ConfigService, private frameworkService: FrameworkService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.viewInitialized = true;
    if (this.playerNeedsInitialization) {
      this.initializeAndLoadPlayer();
      this.playerNeedsInitialization = false;
    }
  }

  ngAfterViewChecked() {
    // Check if player elements become available after template changes
    if (this.playerNeedsInitialization && this.viewInitialized) {
      this.checkAndInitializePlayer();
    }
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
      const frameworkData = this.frameworkService.frameworkData;
      
      if (frameworkData?.[frameworkId]?.categories) {
        const categories = frameworkData[frameworkId].categories;
        const frameworkCodes = categories.map(category => category.code);
        
        const matchedFields = frameworkCodes.reduce((acc, code) => {
          if (_.has(this.contentDetails.contentData, code)) {
            acc[code] = _.get(this.contentDetails.contentData, code);
          }
          return acc;
        }, {});

        this.contentInfo = { ...baseContentInfo, ...matchedFields };
      } else {
        this.contentInfo = baseContentInfo;
      }
      this.prepareContentInfoArray();
      if (this.viewInitialized) {
        this.initializeAndLoadPlayer();
      } else {
        this.playerNeedsInitialization = true;
      }
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

  checkAndInitializePlayer() {
    const playerElement = this.getPlayerElement();
    if (playerElement && this.playerNeedsInitialization) {
      this.initializeAndLoadPlayer();
      this.playerNeedsInitialization = false;
    }
  }

  getPlayerElement(): ElementRef | null {
    switch (this.playerType) {
      case 'pdf-player':
        return this.pdfPlayer;
      case 'epub-player':
        return this.epubPlayer;
      case 'video-player':
        return this.videoPlayer;
      default:
        return null;
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
    // Add initial safety check for ViewChild elements
    const playerElement = this.getPlayerElement();
    if (!playerElement?.nativeElement) {
      console.warn('ViewChild elements not ready, scheduling player initialization...');
      this.playerNeedsInitialization = true;
      return;
    }

    const checkCustomElement = (tagName: string) => {
      return customElements.get(tagName) !== undefined;
    };

    const loadPlayerScript = (scriptSrc: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src*="${scriptSrc}"]`)) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${scriptSrc}`));
        document.head.appendChild(script);
      });
    };

    const ensurePlayerScriptLoaded = async (playerType: string): Promise<void> => {
      const scriptMap = {
        'pdf-player': '/assets/sunbird-pdf-player.js',
        'epub-player': '/assets/sunbird-epub-player.js',
        'video-player': '/assets/sunbird-video-player.js'
      };

      const scriptSrc = scriptMap[playerType];
      if (scriptSrc) {
        try {
          await loadPlayerScript(scriptSrc);
        } catch (error) {
          console.warn(`Failed to load ${playerType} script dynamically. Make sure the script is included in angular.json or loaded by the consuming application.`, error);
        }
      }
    };

    const waitForCustomElement = async (tagName: string, playerType: string): Promise<void> => {
      // First try to ensure the script is loaded
      await ensurePlayerScriptLoaded(playerType);
      
      return new Promise((resolve) => {
        if (checkCustomElement(tagName)) {
          resolve();
        } else {
          let attempts = 0;
          const maxAttempts = ContentplayerPageComponent.CUSTOM_ELEMENT_MAX_ATTEMPTS;
          
          const interval = setInterval(() => {
            attempts++;
            if (checkCustomElement(tagName)) {
              clearInterval(interval);
              resolve();
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              resolve();
            }
          }, ContentplayerPageComponent.CUSTOM_ELEMENT_CHECK_INTERVAL);
        }
      });
    };

    const initializePlayer = (element: any) => {
      setTimeout(() => {
        try {
          if (element.playerConfig !== this.playerConfig) {
            element.playerConfig = this.playerConfig;
          }
          
          element.dispatchEvent(new CustomEvent('playerConfigUpdated', {
            detail: this.playerConfig
          }));
          
          if (typeof element.ngOnInit === 'function') {
            element.ngOnInit();
          }
        } catch (error) {
          console.error('Error initializing player:', error);
        }
      }, ContentplayerPageComponent.PLAYER_INITIALIZATION_TIMEOUT);
    };

    if (this.playerType === "pdf-player") {
      waitForCustomElement('sunbird-pdf-player', 'pdf-player').then(() => {
        if (checkCustomElement('sunbird-pdf-player') && this.pdfPlayer?.nativeElement) {
          const pdfElement = document.createElement('sunbird-pdf-player') as any;
          this.setPlayerProperties(pdfElement);
          this.pdfPlayer.nativeElement.innerHTML = ''; // Clear any existing content
          this.pdfPlayer.nativeElement.appendChild(pdfElement);
          initializePlayer(pdfElement);
        } else {
          console.error('PDF player web component not available or ViewChild not ready. Falling back to default player.');
          this.playerType = 'default-player';
          this.loadDefaultPlayer();
        }
      });
    } else if (this.playerType === "epub-player") {
      waitForCustomElement('sunbird-epub-player', 'epub-player').then(() => {
        if (checkCustomElement('sunbird-epub-player') && this.epubPlayer?.nativeElement) {
          const epubElement = document.createElement('sunbird-epub-player') as any;
          this.setPlayerProperties(epubElement);
          this.epubPlayer.nativeElement.innerHTML = ''; // Clear any existing content
          this.epubPlayer.nativeElement.appendChild(epubElement);
          initializePlayer(epubElement);
        } else {
          console.error('EPUB player web component not available or ViewChild not ready. Falling back to default player.');
          this.playerType = 'default-player';
          this.loadDefaultPlayer();
        }
      });
    } else if (this.playerType === "video-player") {
      waitForCustomElement('sunbird-video-player', 'video-player').then(() => {
        if (checkCustomElement('sunbird-video-player') && this.videoPlayer?.nativeElement) {
          const videoElement = document.createElement('sunbird-video-player') as any;
          this.setPlayerProperties(videoElement);
          this.videoPlayer.nativeElement.innerHTML = ''; // Clear any existing content
          this.videoPlayer.nativeElement.appendChild(videoElement);
          initializePlayer(videoElement);
        } else {
          console.error('Video player web component not available or ViewChild not ready. Falling back to default player.');
          this.playerType = 'default-player';
          this.loadDefaultPlayer();
        }
      });
    }
  }
}
