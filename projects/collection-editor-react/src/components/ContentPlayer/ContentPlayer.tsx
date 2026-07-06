import React, { useEffect, useRef, useState } from 'react';
import type { INode, EditorMode } from '../../types/editor';
import { useEditorStore } from '../../store/editor.store';
import { fetchContentDetails } from '../../api/content';
import { useQumlContent } from '../../hooks/useQumlContent';
import { qumlPlayerService, QumlPlayerService } from '../../services/quml/QumlPlayerService';
import styles from './ContentPlayer.module.scss';

// ── MIME-type classification ──────────────────────────────────────────────────
const MIME_GROUPS: Array<{ key: string; mimes: string[]; label: string; icon: string }> = [
  { key: 'video',  mimes: ['video/mp4','video/webm','video/ogg'],               label: 'Video',  icon: '🎬' },
  { key: 'audio',  mimes: ['audio/mp3','audio/mpeg','audio/ogg','audio/wav'],    label: 'Audio',  icon: '🎵' },
  { key: 'pdf',    mimes: ['application/pdf'],                                   label: 'PDF',    icon: '📄' },
  { key: 'epub',   mimes: ['application/epub'],                                  label: 'ePub',   icon: '📖' },
  { key: 'ecml',   mimes: ['application/vnd.ekstep.ecml-archive'],               label: 'ECML',   icon: '✏️'  },
  { key: 'h5p',    mimes: ['application/vnd.ekstep.h5p-archive'],                label: 'H5P',    icon: '🎮'  },
  { key: 'scorm',  mimes: ['application/vnd.ekstep.content-collection'],         label: 'SCORM',  icon: '📦'  },
];

function getMimeGroup(mimeType: string) {
  return MIME_GROUPS.find(g => g.mimes.includes(mimeType)) ?? { key: 'other', label: 'Content', icon: '📱' };
}

// ── Player type resolution ────────────────────────────────────────────────────
const PLAYER_TYPE_MAP: Record<string, string[]> = {
  'pdf-player':   ['application/pdf'],
  'video-player': ['video/mp4', 'video/webm'],
  'epub-player':  ['application/epub'],
};

const PLAYER_SCRIPTS: Record<string, string> = {
  'pdf-player':   '/assets/sunbird-pdf-player.js',
  'video-player': '/assets/sunbird-video-player.js',
  'epub-player':  '/assets/sunbird-epub-player.js',
};

const PLAYER_TAGS: Record<string, string> = {
  'pdf-player':   'sunbird-pdf-player',
  'video-player': 'sunbird-video-player',
  'epub-player':  'sunbird-epub-player',
};

const DEFAULT_PLAYER_URL =
  '/content/preview/preview.html?webview=true&build_number=2.8.0.e552fcd';

function resolvePlayerType(mimeType: string): string {
  for (const [type, mimes] of Object.entries(PLAYER_TYPE_MAP)) {
    if (mimes.includes(mimeType)) return type;
  }
  return 'default-player';
}

// ── Player config builder ─────────────────────────────────────────────────────
// fullMetadata: merged object — search-result fields overwritten by full content read
function buildPlayerConfig(
  node: INode,
  fullMetadata: Record<string, unknown>,
  editorConfig: ReturnType<typeof useEditorStore.getState>['editorConfig'],
) {
  const ctx = editorConfig?.context;
  const mimeType = (fullMetadata.mimeType as string) ?? node.mimeType ?? '';

  return {
    context: {
      mode: 'play',
      partner: [],
      pdata: { id: ctx?.pdata?.id ?? 'sunbird.portal', ver: 1.0, pid: 'sunbird-portal' },
      contentId: node.identifier,
      sid: ctx?.sid ?? '',
      uid: ctx?.uid ?? '',
      channel: ctx?.channel ?? '',
      did: ctx?.did ?? '',
      timeDiff: 0,
      contextRollup: {},
      tags: [],
      app: [ctx?.channel ?? ''],
      dims: '',
    },
    config: {
      showEndPage: false,
      showStartPage: true,
      host: '',
      overlay: { showUser: false },
      splash: { text: '', icon: '', bgImage: '', webLink: '' },
      sideMenu: { showDownload: true, showExit: false, showShare: true },
      apislug: '/action',
      repos: ['/sunbird-plugins/renderer'],
      plugins: [
        { id: 'org.sunbird.iframeEvent', ver: 1.0, type: 'plugin' },
        { id: 'org.sunbird.player.endpage', ver: 1.1, type: 'plugin' },
      ],
      enableTelemetryValidation: false,
    },
    // Full content data — includes artifactUrl, streamingUrl, body, etc.
    metadata: fullMetadata,
    data: mimeType === 'application/vnd.ekstep.ecml-archive'
      ? (fullMetadata.body ?? {})
      : {},
  };
}

// ── Script loader ─────────────────────────────────────────────────────────────
function loadScript(src: string): Promise<void> {
  if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function waitForCustomElement(tag: string, playerType: string, maxAttempts = 100): Promise<void> {
  await loadScript(PLAYER_SCRIPTS[playerType] ?? '');
  if (customElements.get(tag)) return;
  await new Promise<void>((resolve, reject) => {
    let attempts = 0;
    const id = setInterval(() => {
      attempts++;
      if (customElements.get(tag)) {
        clearInterval(id);
        resolve();
      } else if (attempts >= maxAttempts) {
        clearInterval(id);
        reject(new Error(`Custom element <${tag}> did not register`));
      }
    }, 100);
  });
}

// ── Info strip ────────────────────────────────────────────────────────────────
const INFO_FIELDS: Array<{ key: string; label: string; icon: string }> = [
  { key: 'author',      label: 'Author',   icon: '👤' },
  { key: 'license',     label: 'License',  icon: '⚖️'  },
  { key: 'language',    label: 'Language', icon: '🌐'  },
  { key: 'gradeLevel',  label: 'Class',    icon: '🏫'  },
  { key: 'subject',     label: 'Subject',  icon: '📚'  },
  { key: 'contentType', label: 'Type',     icon: '🏷️'  },
];

function InfoStrip({ node }: { node: INode }) {
  const meta = (node.metadata ?? {}) as Record<string, unknown>;
  const chips = INFO_FIELDS.flatMap(f => {
    const raw = meta[f.key];
    if (!raw) return [];
    const val = Array.isArray(raw) ? raw.join(', ') : String(raw);
    if (!val) return [];
    return [{ ...f, val }];
  });
  if (!chips.length) return null;

  return (
    <div className={styles.infoStrip}>
      {chips.map(c => (
        <div key={c.key} className={styles.infoChip}>
          {c.icon && <span className={styles.infoChipIcon}>{c.icon}</span>}
          <span className={styles.infoChipLabel}>{c.label}</span>
          {c.val}
        </div>
      ))}
    </div>
  );
}

// ── Cover overlay ─────────────────────────────────────────────────────────────
function CoverOverlay({ node, hidden }: { node: INode; hidden: boolean }) {
  const thumb = node.appIcon ?? (node.metadata?.appIcon as string | undefined);
  return (
    <div className={`${styles.coverOverlay} ${hidden ? styles.coverHidden : ''}`}>
      {thumb ? (
        <>
          <img src={thumb} alt={node.name} className={styles.coverThumb} />
          <div className={styles.coverPlayRing}>
            <div className={styles.coverPlayIcon} />
          </div>
          <span className={styles.coverLabel}>Loading preview…</span>
        </>
      ) : (
        <div className={styles.coverSkeleton} />
      )}
    </div>
  );
}

// ── Player error overlay ──────────────────────────────────────────────────────
function PlayerError({ message }: { message: string }) {
  return (
    <div className={styles.playerError}>
      <span className={styles.playerErrorIcon}>⚠</span>
      <span className={styles.playerErrorMsg}>{message}</span>
    </div>
  );
}

// ── Type badge ────────────────────────────────────────────────────────────────
function TypeBadge({ mimeType }: { mimeType: string }) {
  const group = getMimeGroup(mimeType);
  return (
    <span className={styles.typeBadge} data-type={group.key}>
      <span className={styles.typeDot} />
      {group.label}
    </span>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ContentPlayerProps {
  node: INode;
  editorMode: EditorMode;
  type: 'content' | 'quml';
}

// ── Root ──────────────────────────────────────────────────────────────────────
export const ContentPlayer: React.FC<ContentPlayerProps> = ({ node, editorMode, type }) => {
  if (type === 'quml') return <QumlPlayer node={node} editorMode={editorMode} />;

  const thumb = node.appIcon ?? (node.metadata?.appIcon as string | undefined);

  return (
    <div className={styles.contentPlayerRoot}>
      <div className={styles.stage}>
        <div className={styles.playerHeader}>
          {thumb && <img src={thumb} alt="" className={styles.playerHeaderThumb} />}
          <span className={styles.playerHeaderTitle}>{node.name}</span>
          <TypeBadge mimeType={node.mimeType ?? ''} />
        </div>
        <SunbirdContentPlayer node={node} />
      </div>
      <InfoStrip node={node} />
    </div>
  );
};

// ── Sunbird content player ────────────────────────────────────────────────────
function SunbirdContentPlayer({ node }: { node: INode }) {
  const editorConfig = useEditorStore((s) => s.editorConfig);
  const [playerType, setPlayerType] = useState(() => resolvePlayerType(node.mimeType ?? ''));
  const [coverHidden, setCoverHidden] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [fullMetadata, setFullMetadata] = useState<Record<string, unknown>>(
    (node.metadata ?? {}) as Record<string, unknown>,
  );
  // Gate: don't start the player until the full content fetch has resolved,
  // so playerConfig.metadata always contains artifactUrl when initializePreview is called.
  const [contentReady, setContentReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webComponentRef = useRef<HTMLDivElement>(null);

  const previewUrl = editorConfig?.config?.previewCdnUrl ?? DEFAULT_PLAYER_URL;

  // Fetch full content details — provides artifactUrl, streamingUrl, body, etc.
  useEffect(() => {
    let cancelled = false;
    setContentReady(false);
    setCoverHidden(false);
    setPlayerError(null);
    setFullMetadata((node.metadata ?? {}) as Record<string, unknown>);
    setPlayerType(resolvePlayerType(node.mimeType ?? ''));

    fetchContentDetails(node.identifier)
      .then((content) => {
        if (cancelled) return;
        const merged = { ...(node.metadata ?? {}), ...content } as Record<string, unknown>;
        setFullMetadata(merged);
        const mime = (content.mimeType as string) ?? node.mimeType ?? '';
        setPlayerType(resolvePlayerType(mime));
        setContentReady(true);
      })
      .catch(() => {
        // Proceed with whatever sparse metadata we have
        if (!cancelled) setContentReady(true);
      });

    return () => { cancelled = true; };
  }, [node.identifier]);

  // Build playerConfig after fullMetadata is populated — this runs on every render
  // so by the time contentReady=true the config already has artifactUrl
  const playerConfig = buildPlayerConfig(node, fullMetadata, editorConfig);

  // Default player — iframe. Only runs after contentReady so playerConfig has full metadata.
  useEffect(() => {
    if (!contentReady || playerType !== 'default-player') return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.src = previewUrl;

    const handleLoad = () => {
      try {
        const win = iframe.contentWindow as Record<string, unknown> | null;
        if (typeof win?.['initializePreview'] !== 'function') {
          setPlayerError('Preview player unavailable. Check that /content/preview is reachable.');
          return;
        }
        // playerConfig is captured here — contentReady gate ensures fullMetadata is set
        (win['initializePreview'] as (cfg: unknown) => void)(playerConfig);
        setTimeout(() => setCoverHidden(true), 300);
      } catch (err) {
        console.error('[ContentPlayer] initializePreview failed', err);
        setPlayerError('Failed to initialize the content player.');
      }
    };

    const handleError = () => setPlayerError('Preview player could not be loaded.');

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      iframe.src = '';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.identifier, playerType, previewUrl, contentReady]);

  // Web-component players (pdf / video / epub)
  useEffect(() => {
    if (!contentReady || playerType === 'default-player') return;
    const container = webComponentRef.current;
    if (!container) return;
    const tag = PLAYER_TAGS[playerType];
    if (!tag) return;

    // Snapshot playerConfig at effect-run time — contentReady gate ensures fullMetadata is set
    const config = playerConfig;

    waitForCustomElement(tag, playerType)
      .then(() => {
        if (!webComponentRef.current) return;
        if (!customElements.get(tag)) {
          setPlayerType('default-player');
          return;
        }
        const el = document.createElement(tag) as HTMLElement & Record<string, unknown>;
        el.setAttribute('player-config', JSON.stringify(config));
        el.addEventListener('playerEvent', () => {});
        el.addEventListener('telemetryEvent', () => {});
        container.innerHTML = '';
        container.appendChild(el);
        setTimeout(() => {
          try { el['playerConfig'] = config; } catch { /* attribute-only */ }
          setCoverHidden(true);
        }, 200);
      })
      .catch(() => {
        console.warn(`[ContentPlayer] ${playerType} script unavailable, falling back to iframe`);
        setPlayerType('default-player');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.identifier, playerType, contentReady]);

  return (
    <div className={styles.aspectRatio}>
      {playerError ? (
        <PlayerError message={playerError} />
      ) : (
        <CoverOverlay node={node} hidden={coverHidden} />
      )}

      {playerType === 'default-player' ? (
        <iframe
          ref={iframeRef}
          id="contentPlayer"
          title={node.name}
          className={styles.playerFrame}
          name="contentPlayer"
          allowFullScreen
        />
      ) : (
        <div ref={webComponentRef} className={styles.playerFrame} />
      )}
    </div>
  );
}

// ── QuML player ───────────────────────────────────────────────────────────────
// Loads a full QuestionSet: fetches the hierarchy + inlines every question's
// body, then renders it through the <sunbird-quml-player> web component.
function QumlPlayer({ node, editorMode }: { node: INode; editorMode: EditorMode }) {
  const editorConfig = useEditorStore((s) => s.editorConfig);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: metadata, isLoading, error } = useQumlContent(node.identifier);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !metadata) return;

    let el: HTMLElement | null = null;
    let cancelled = false;

    (async () => {
      try {
        const config = await qumlPlayerService.createConfig(
          metadata,
          editorConfig?.context,
          { mode: editorMode === 'edit' ? 'edit' : 'play' },
        );
        if (cancelled || !containerRef.current) return;
        const element = qumlPlayerService.createElement(config);
        el = element;
        qumlPlayerService.attachEventListeners(
          element,
          (e: CustomEvent) => console.debug('[QumlPlayer] playerEvent', e.detail),
          (detail: unknown) => console.debug('[QumlPlayer] telemetryEvent', detail),
        );
        container.innerHTML = '';
        container.appendChild(element);
      } catch (err) {
        console.error('[QumlPlayer] failed to initialize', err);
      }
    })();

    return () => {
      cancelled = true;
      if (el) {
        qumlPlayerService.removeEventListeners(el);
        el.remove();
      }
      QumlPlayerService.unloadStyles();
    };
  }, [metadata, editorConfig, editorMode]);

  return (
    <div className={styles.qumlRoot}>
      {error ? (
        <PlayerError message={`Unable to load questionset: ${error.message}`} />
      ) : isLoading || !metadata ? (
        <CoverOverlay node={node} hidden={false} />
      ) : null}
      <div ref={containerRef} className={styles.playerWrapper} />
    </div>
  );
}
