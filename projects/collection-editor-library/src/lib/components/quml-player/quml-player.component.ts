import { Component, EventEmitter, Input, OnInit , Output, ViewEncapsulation, AfterViewInit, OnChanges, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
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
export class QumlPlayerComponent implements OnInit, AfterViewInit, OnChanges, AfterViewChecked {
  private static readonly PLAYER_INITIALIZATION_TIMEOUT = 200;
  private static readonly CUSTOM_ELEMENT_CHECK_INTERVAL = 100;
  private static readonly CUSTOM_ELEMENT_MAX_ATTEMPTS = 100;
  qumlPlayerConfig: any;
  @Input() questionSetHierarchy: any;
  @Input() isSingleQuestionPreview = false;
  showPreview = false;
  showViewButton = false;
  @Output() public toolbarEmitter: EventEmitter<any> = new EventEmitter();
  @ViewChild('inQuiryQuMLPlayer', { static: false }) inQuiryQuMLPlayer: ElementRef;

  private playerNeedsInitialization = false;
  private viewInitialized = false;
  private previousHierarchyId: string;
  constructor(private configService: ConfigService, private playerService: PlayerService,
    public editorService: EditorService ) { }

  ngOnInit() {
    this.initialize();
    if(!_.isUndefined(this.editorService?.editorConfig?.config?.renderTaxonomy)){
      this.showViewButton = true
    }
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    if (this.playerNeedsInitialization) {
      this.loadPlayer();
      this.playerNeedsInitialization = false;
    }
  }

  ngAfterViewChecked() {
    if (this.playerNeedsInitialization && this.viewInitialized) {
      this.checkAndInitializePlayer();
    }
  }

  ngOnChanges() {
    const currentHierarchyId = this.questionSetHierarchy?.identifier;
    if (this.previousHierarchyId !== currentHierarchyId) {
      this.previousHierarchyId = currentHierarchyId;
      this.initialize();
      if (this.viewInitialized) {
        this.loadPlayer();
      } else {
        this.playerNeedsInitialization = true;
      }
    }
  }

  initialize() {
    this.setQumlPlayerData();
    this.showPreview = true;
  }

  checkAndInitializePlayer() {
    if (this.inQuiryQuMLPlayer?.nativeElement && this.playerNeedsInitialization) {
      this.loadPlayer();
      this.playerNeedsInitialization = false;
    }
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

  loadPlayer() {
    if (!this.inQuiryQuMLPlayer?.nativeElement) {
      console.warn('ViewChild element not ready, scheduling player initialization...');
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

    const ensurePlayerScriptLoaded = async (): Promise<void> => {
      const scriptSrc = '/assets/sunbird-quml-player.js';
      try {
        await loadPlayerScript(scriptSrc);
      } catch (error) {
        console.warn('Failed to load QuML player script dynamically. Make sure the script is included in angular.json or loaded by the consuming application.', error);
      }
    };

    const waitForCustomElement = async (tagName: string): Promise<void> => {
      await ensurePlayerScriptLoaded();

      return new Promise((resolve, reject) => {
        if (checkCustomElement(tagName)) {
          resolve();
        } else {
          let attempts = 0;
          const maxAttempts = QumlPlayerComponent.CUSTOM_ELEMENT_MAX_ATTEMPTS;

          const interval = setInterval(() => {
            attempts++;
            if (checkCustomElement(tagName)) {
              clearInterval(interval);
              resolve();
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              reject(new Error('Quml player failed to load after max attempts'));
            }
          }, QumlPlayerComponent.CUSTOM_ELEMENT_CHECK_INTERVAL);
        }
      });
    };

    const initializePlayer = (element: any) => {
      setTimeout(() => {
        try {
          if (element.playerConfig !== this.qumlPlayerConfig) {
            element.playerConfig = this.qumlPlayerConfig;
          }

          element.dispatchEvent(new CustomEvent('playerConfigUpdated', {
            detail: this.qumlPlayerConfig
          }));

          if (typeof element.ngOnInit === 'function') {
            element.ngOnInit();
          }
        } catch (error) {
          console.error('Error initializing QuML player:', error);
        }
      }, QumlPlayerComponent.PLAYER_INITIALIZATION_TIMEOUT);
    };

    (window as any).questionListUrl = `/api/${_.get(this.configService, 'urlConFig.URLS.Question.LIST')}`;

    waitForCustomElement('sunbird-quml-player').then(() => {
      if (checkCustomElement('sunbird-quml-player') && this.inQuiryQuMLPlayer?.nativeElement) {
        const qumlElement = document.createElement('sunbird-quml-player') as any;
        qumlElement.setAttribute('player-config', JSON.stringify(this.qumlPlayerConfig));
        qumlElement.addEventListener('playerEvent', this.getPlayerEvents.bind(this));
        qumlElement.addEventListener('telemetryEvent', this.getTelemetryEvents.bind(this));
        this.inQuiryQuMLPlayer.nativeElement.innerHTML = '';
        this.inQuiryQuMLPlayer.nativeElement.appendChild(qumlElement);
        initializePlayer(qumlElement);
      } else {
        console.error('QuML player web component not available or ViewChild not ready.');
      }
    }).catch(() => {
      console.error('QuML player web component failed to load within the expected time.');
    });
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
