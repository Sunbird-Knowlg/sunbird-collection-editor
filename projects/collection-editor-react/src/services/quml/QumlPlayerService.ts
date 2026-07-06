import type { IContext } from '../../types/editor';

const SCRIPT_SRC = '/assets/quml-player/sunbird-quml-player.js';
const STYLES_HREF = '/assets/quml-player/styles.css';
const QUESTION_LIST_URL = '/action/question/v2/list';
const TAG = 'sunbird-quml-player';

export interface QumlContextProps {
  mode?: string;
  cdata?: unknown[];
  contextRollup?: Record<string, string>;
  objectRollup?: Record<string, string>;
}

export interface QumlPlayerConfig {
  context: Record<string, unknown>;
  config: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

/**
 * Owns the lifecycle of the <sunbird-quml-player> web component:
 * script/style loading, element creation, and event wiring.
 * Ported from spark-portal's QumlPlayerService, with the telemetry context
 * built from the editor's IContext instead of portal identity singletons.
 */
export class QumlPlayerService {
  private eventHandlers = new WeakMap<
    HTMLElement,
    { player: (e: Event) => void; telemetry: (e: Event) => void }
  >();
  private static scriptLoaded = false;
  private static scriptLoading?: Promise<void>;
  private static stylesLoaded = false;

  private loadScript(): Promise<void> {
    if (QumlPlayerService.scriptLoaded || customElements.get(TAG)) {
      QumlPlayerService.scriptLoaded = true;
      return Promise.resolve();
    }
    if (QumlPlayerService.scriptLoading) return QumlPlayerService.scriptLoading;

    QumlPlayerService.scriptLoading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.setAttribute('data-quml-player-script', 'true');
      script.onload = () => {
        QumlPlayerService.scriptLoaded = true;
        QumlPlayerService.scriptLoading = undefined;
        resolve();
      };
      script.onerror = () => {
        QumlPlayerService.scriptLoading = undefined;
        reject(new Error(`Failed to load QuML player script: ${SCRIPT_SRC}`));
      };
      document.body.appendChild(script);
    });
    return QumlPlayerService.scriptLoading;
  }

  private loadStyles(): void {
    // The web component fetches individual questions from this URL.
    (window as unknown as Record<string, unknown>)['questionListUrl'] =
      QUESTION_LIST_URL;

    if (
      QumlPlayerService.stylesLoaded ||
      document.querySelector('[data-quml-player-styles="true"]')
    ) {
      QumlPlayerService.stylesLoaded = true;
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = STYLES_HREF;
    link.setAttribute('data-quml-player-styles', 'true');
    document.head.appendChild(link);
    QumlPlayerService.stylesLoaded = true;
  }

  /** Removes the QuML stylesheet on unmount to prevent style bleed. */
  static unloadStyles(): void {
    document.querySelector('[data-quml-player-styles="true"]')?.remove();
    QumlPlayerService.stylesLoaded = false;
  }

  /**
   * Waits for the web component script to load, then assembles the player
   * config from the editor context + enriched questionset metadata.
   */
  async createConfig(
    metadata: Record<string, unknown>,
    ctx: IContext | undefined,
    props?: QumlContextProps,
  ): Promise<QumlPlayerConfig> {
    await this.loadScript();

    const context: Record<string, unknown> = {
      mode: props?.mode ?? 'play',
      pdata: {
        id: ctx?.pdata?.id ?? 'sunbird.portal',
        ver: ctx?.pdata?.ver ?? '1.0',
        pid: ctx?.pdata?.pid ?? 'sunbird-portal',
      },
      contentId: (metadata['identifier'] as string) ?? '',
      sid: ctx?.sid ?? '',
      uid: ctx?.uid ?? ctx?.userId ?? '',
      channel: ctx?.channel ?? '',
      did: ctx?.did ?? '',
      tags: ctx?.tags ?? [],
      contextRollup: props?.contextRollup ?? ctx?.rollup ?? {},
      objectRollup: props?.objectRollup ?? {},
      ...(props?.cdata ? { cdata: props.cdata } : {}),
    };

    return {
      context,
      config: {
        sideMenu: {
          enable: false,
          showShare: false,
          showDownload: false,
          showReplay: true,
          showExit: false,
        },
      },
      metadata,
    };
  }

  createElement(config: QumlPlayerConfig): HTMLElement {
    this.loadStyles();
    const el = document.createElement(TAG);
    el.setAttribute('player-config', JSON.stringify(config));
    el.setAttribute('data-player-id', (config.metadata['identifier'] as string) ?? 'quml');
    return el;
  }

  attachEventListeners(
    el: HTMLElement,
    onPlayerEvent?: (e: CustomEvent) => void,
    onTelemetryEvent?: (e: unknown) => void,
  ): void {
    this.removeEventListeners(el);
    const player = (e: Event) => onPlayerEvent?.(e as CustomEvent);
    const telemetry = (e: Event) => onTelemetryEvent?.((e as CustomEvent).detail);
    el.addEventListener('playerEvent', player);
    el.addEventListener('telemetryEvent', telemetry);
    this.eventHandlers.set(el, { player, telemetry });
  }

  removeEventListeners(el: HTMLElement): void {
    const handlers = this.eventHandlers.get(el);
    if (handlers) {
      el.removeEventListener('playerEvent', handlers.player);
      el.removeEventListener('telemetryEvent', handlers.telemetry);
      this.eventHandlers.delete(el);
    }
  }
}

export const qumlPlayerService = new QumlPlayerService();
